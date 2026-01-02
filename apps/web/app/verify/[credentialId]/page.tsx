import { hashMetadata } from "@zauth/shared";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type VerifyResponse = {
  status: "valid" | "invalid" | "revoked";
  hashMatches: boolean;
  chainMatches: boolean;
  credential: {
    credential_id: string;
    recipient_wallet: string;
    metadata: Record<string, string>;
    metadata_hash: string;
    issued_at: string;
    revoked_at?: string | null;
  };
};

async function getVerification(credentialId: string): Promise<VerifyResponse> {
  const res = await fetch(`${apiBase}/verify/${credentialId}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Unable to verify credential");
  }
  return res.json();
}

export default async function VerifyPage({ params }: { params: { credentialId: string } }) {
  const data = await getVerification(params.credentialId);
  const recomputed = hashMetadata(data.credential.metadata);

  return (
    <main className="glass p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Verification</h2>
          <p className="text-white/60 text-sm">Credential ID: {data.credential.credential_id}</p>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            data.status === "valid"
              ? "bg-emerald-500/80"
              : data.status === "revoked"
              ? "bg-amber-500/80"
              : "bg-rose-500/80"
          }`}
        >
          {data.status.toUpperCase()}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="glass p-4">
          <h3 className="font-semibold mb-2">Credential Details</h3>
          <div className="text-sm text-white/70 space-y-2">
            <div>Recipient: {data.credential.recipient_wallet}</div>
            <div>Issued: {new Date(data.credential.issued_at).toLocaleString()}</div>
            <div>Metadata Hash: {data.credential.metadata_hash}</div>
            <div>Recomputed Hash: {recomputed}</div>
          </div>
        </div>
        <div className="glass p-4">
          <h3 className="font-semibold mb-2">Metadata Fields</h3>
          <ul className="text-sm text-white/70 space-y-2">
            {Object.entries(data.credential.metadata.fields || {}).map(([key, value]) => (
              <li key={key}>
                <span className="font-semibold">{key}:</span> {value}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 text-sm text-white/70">
        Hash match: {data.hashMatches ? "✅" : "❌"} | Chain match: {data.chainMatches ? "✅" : "❌"}
      </div>
    </main>
  );
}
