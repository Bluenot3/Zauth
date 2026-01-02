import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import dotenv from "dotenv";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { hashMetadata } from "@zauth/shared";
import { ethers } from "ethers";
import { evaluateVerification } from "./verification";

dotenv.config();

const app = Fastify({ logger: true });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const jwtSecret = process.env.AUTH_SECRET || "dev-secret";

const contractAbi = [
  "function issueCredential(bytes32 credentialId, address owner, bytes32 metadataHash)",
  "function revokeCredential(bytes32 credentialId)",
  "function getCredential(bytes32 credentialId) view returns (tuple(address owner, bytes32 metadataHash, uint8 status, uint256 issuedAt, uint256 revokedAt))"
];

const getContract = () => {
  const rpcUrl = process.env.RPC_URL || "http://127.0.0.1:8545";
  const privateKey = process.env.ADMIN_PRIVATE_KEY || "";
  if (!process.env.CONTRACT_ADDRESS || !privateKey) {
    throw new Error("Missing CONTRACT_ADDRESS or ADMIN_PRIVATE_KEY");
  }
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);
  return new ethers.Contract(process.env.CONTRACT_ADDRESS, contractAbi, signer);
};

const authHeaderSchema = z.string().startsWith("Bearer ");
const requireAdmin = async (request: any, reply: any) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeaderSchema.safeParse(authHeader).success) {
    return reply.status(401).send({ error: "Unauthorized" });
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, jwtSecret) as { email: string };
    request.admin = payload;
  } catch (error) {
    return reply.status(401).send({ error: "Unauthorized" });
  }
};

app.register(cors, { origin: true });
app.register(rateLimit, { global: false });
app.register(swagger, {
  openapi: {
    info: {
      title: "ZENAuth API",
      version: "0.1.0"
    }
  }
});
app.register(swaggerUi, { routePrefix: "/docs" });

app.post("/auth/login", async (request, reply) => {
  const bodySchema = z.object({ email: z.string().email(), password: z.string().min(8) });
  const body = bodySchema.parse(request.body);
  const result = await pool.query("SELECT email, password_hash FROM admins WHERE email = $1", [body.email]);
  const admin = result.rows[0];
  if (!admin) {
    return reply.status(401).send({ error: "Invalid credentials" });
  }
  const valid = await bcrypt.compare(body.password, admin.password_hash);
  if (!valid) {
    return reply.status(401).send({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ email: admin.email }, jwtSecret, { expiresIn: "8h" });
  return reply.send({ token });
});

app.get("/auth/me", { preHandler: requireAdmin }, async (request: any) => {
  return { email: request.admin.email };
});

app.get("/templates", { preHandler: requireAdmin }, async () => {
  const result = await pool.query("SELECT * FROM templates ORDER BY created_at DESC");
  return result.rows;
});

app.get("/templates/:id", { preHandler: requireAdmin }, async (request) => {
  const result = await pool.query("SELECT * FROM templates WHERE id=$1", [(request.params as { id: string }).id]);
  return result.rows[0];
});

app.post("/templates", { preHandler: requireAdmin }, async (request: any) => {
  const schema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    issuer: z.string().min(1),
    program: z.string().min(1),
    badgeImageUrl: z.string().url(),
    fields: z.array(z.object({ key: z.string(), label: z.string(), type: z.enum(["string", "number", "date"]) }))
  });
  const body = schema.parse(request.body);
  const result = await pool.query(
    `INSERT INTO templates (title, description, issuer, program, badge_image_url, fields)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [body.title, body.description, body.issuer, body.program, body.badgeImageUrl, JSON.stringify(body.fields)]
  );
  await pool.query(
    "INSERT INTO audit_logs (actor_email, action, template_id, payload) VALUES ($1, $2, $3, $4)",
    [request.admin.email, "template_created", result.rows[0].id, body]
  );
  return result.rows[0];
});

app.put("/templates/:id", { preHandler: requireAdmin }, async (request: any) => {
  const schema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    issuer: z.string().min(1),
    program: z.string().min(1),
    badgeImageUrl: z.string().url(),
    fields: z.array(z.object({ key: z.string(), label: z.string(), type: z.enum(["string", "number", "date"]) }))
  });
  const body = schema.parse(request.body);
  const result = await pool.query(
    `UPDATE templates SET title=$1, description=$2, issuer=$3, program=$4, badge_image_url=$5, fields=$6, updated_at=now()
     WHERE id=$7 RETURNING *`,
    [body.title, body.description, body.issuer, body.program, body.badgeImageUrl, JSON.stringify(body.fields), request.params.id]
  );
  await pool.query(
    "INSERT INTO audit_logs (actor_email, action, template_id, payload) VALUES ($1, $2, $3, $4)",
    [request.admin.email, "template_updated", request.params.id, body]
  );
  return result.rows[0];
});

app.delete("/templates/:id", { preHandler: requireAdmin }, async (request) => {
  await pool.query("DELETE FROM templates WHERE id=$1", [(request.params as { id: string }).id]);
  return { status: "deleted" };
});

app.post("/credentials/issue", { preHandler: requireAdmin }, async (request: any, reply) => {
  const schema = z.object({
    templateId: z.string().uuid(),
    recipientWallet: z.string().min(1),
    fields: z.record(z.string(), z.string())
  });
  const body = schema.parse(request.body);
  const credentialId = uuidv4();
  const metadata = {
    credentialId,
    templateId: body.templateId,
    recipientWallet: body.recipientWallet,
    issuedAt: new Date().toISOString(),
    fields: body.fields
  };
  const metadataHash = hashMetadata(metadata);

  let txHash: string | null = null;
  try {
    const contract = getContract();
    const tx = await contract.issueCredential(
      ethers.keccak256(ethers.toUtf8Bytes(credentialId)),
      body.recipientWallet,
      metadataHash
    );
    const receipt = await tx.wait();
    txHash = receipt?.hash ?? tx.hash;
  } catch (error) {
    app.log.error(error);
  }

  const result = await pool.query(
    `INSERT INTO credentials (credential_id, template_id, recipient_wallet, metadata, metadata_hash, tx_hash, chain_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [credentialId, body.templateId, body.recipientWallet, metadata, metadataHash, txHash, process.env.CHAIN_ID || "31337"]
  );
  await pool.query(
    "INSERT INTO audit_logs (actor_email, action, credential_id, tx_hash, chain_id, payload) VALUES ($1, $2, $3, $4, $5, $6)",
    [request.admin.email, "credential_issued", credentialId, txHash, process.env.CHAIN_ID || "31337", metadata]
  );
  return reply.send({ ...result.rows[0], verifyUrl: `${process.env.PUBLIC_WEB_URL}/verify/${credentialId}` });
});

app.post("/credentials/:credentialId/revoke", { preHandler: requireAdmin }, async (request: any) => {
  const credentialId = request.params.credentialId as string;
  let txHash: string | null = null;
  try {
    const contract = getContract();
    const tx = await contract.revokeCredential(ethers.keccak256(ethers.toUtf8Bytes(credentialId)));
    const receipt = await tx.wait();
    txHash = receipt?.hash ?? tx.hash;
  } catch (error) {
    app.log.error(error);
  }

  const result = await pool.query(
    `UPDATE credentials SET status='revoked', revoked_at=now(), tx_hash=$1 WHERE credential_id=$2 RETURNING *`,
    [txHash, credentialId]
  );
  await pool.query(
    "INSERT INTO audit_logs (actor_email, action, credential_id, tx_hash, chain_id) VALUES ($1, $2, $3, $4, $5)",
    [request.admin.email, "credential_revoked", credentialId, txHash, process.env.CHAIN_ID || "31337"]
  );
  return result.rows[0];
});

app.get("/wallet/:address/credentials", async (request) => {
  const address = (request.params as { address: string }).address;
  const result = await pool.query(
    "SELECT * FROM credentials WHERE recipient_wallet = $1 ORDER BY issued_at DESC",
    [address]
  );
  return result.rows;
});

app.get("/verify/:credentialId", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request) => {
  const credentialId = (request.params as { credentialId: string }).credentialId;
  const dbResult = await pool.query("SELECT * FROM credentials WHERE credential_id=$1", [credentialId]);
  if (!dbResult.rows[0]) {
    return { status: "invalid", reason: "Not found" };
  }
  const credential = dbResult.rows[0];
  let chainStatus: "unknown" | "active" | "revoked" = "unknown";
  let chainHash: string | null = null;

  try {
    const contract = getContract();
    const chainData = await contract.getCredential(ethers.keccak256(ethers.toUtf8Bytes(credentialId)));
    chainHash = chainData.metadataHash;
    if (chainData.status === 1n) chainStatus = "active";
    if (chainData.status === 2n) chainStatus = "revoked";
  } catch (error) {
    app.log.error(error);
  }

  const evaluation = evaluateVerification({
    metadata: credential.metadata,
    metadataHash: credential.metadata_hash,
    chainHash,
    status: credential.status,
    chainStatus
  });
  return { ...evaluation, credential };
});

const port = Number(process.env.API_PORT || 4000);
app.listen({ port, host: "0.0.0.0" }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
