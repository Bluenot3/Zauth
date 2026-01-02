import { Client } from "pg";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const run = async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const email = process.env.ADMIN_EMAIL || "admin@zauth.local";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const hash = await bcrypt.hash(password, 12);

  await client.query(
    "INSERT INTO admins (email, password_hash) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING",
    [email, hash]
  );

  await client.end();
  console.log("Seeded admin user", email);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
