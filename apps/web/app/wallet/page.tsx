"use client";

import { useState } from "react";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Credential = {
  credential_id: string;
  metadata: { fields: Record<string, string> };
  issued_at: string;
};

export default function WalletPage() {
  const [wallet, setWallet] = useState("");
  const [credentials, setCredentials] = useState<Credential[]>([]);

  const fetchCredentials = async () => {
    const res = await fetch(`${apiBase}/wallet/${wallet}/credentials`);
    if (res.ok) {
      const data = await res.json();
      setCredentials(data);
    }
  };

  return (
    <main className="grid gap-6">
      <section className="glass p-6">
        <h2 className="text-xl font-semibold mb-3">Wallet Credentials</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            className="rounded-lg bg-white/10 p-3 flex-1"
            value={wallet}
            onChange={(event) => setWallet(event.target.value)}
            placeholder="Wallet address"
          />
          <button
            className="bg-blue-500 hover:bg-blue-400 transition rounded-lg px-4 py-3 font-semibold"
            onClick={fetchCredentials}
          >
            Load Credentials
          </button>
        </div>
      </section>

      <section className="grid gap-4">
        {credentials.map((credential) => (
          <div key={credential.credential_id} className="glass p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{credential.credential_id}</h3>
                <p className="text-sm text-white/70">Issued {new Date(credential.issued_at).toLocaleString()}</p>
              </div>
              <a
                className="text-sm text-blue-200 hover:text-blue-100"
                href={`/verify/${credential.credential_id}`}
              >
                View Verification
              </a>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
