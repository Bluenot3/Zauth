"use client";

import { useState } from "react";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("admin@zauth.local");
  const [password, setPassword] = useState("ChangeMe123!");
  const [templateId, setTemplateId] = useState("");
  const [recipientWallet, setRecipientWallet] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [verifyUrl, setVerifyUrl] = useState<string | null>(null);

  const handleLogin = async () => {
    setStatus(null);
    const res = await fetch(`${apiBase}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
    } else {
      setStatus(data.error || "Login failed");
    }
  };

  const createTemplate = async () => {
    if (!token) return;
    const res = await fetch(`${apiBase}/templates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: "AI Pioneer",
        description: "Pioneer credential for ZEN AI Co programs.",
        issuer: "ZEN AI Co",
        program: "AI Pioneer Program",
        badgeImageUrl: "https://placehold.co/400x400/png",
        fields: [
          { key: "cohort", label: "Cohort", type: "string" },
          { key: "score", label: "Score", type: "number" }
        ]
      })
    });
    const data = await res.json();
    if (res.ok) {
      setTemplateId(data.id);
      setStatus(`Template created: ${data.id}`);
    } else {
      setStatus(data.error || "Template creation failed");
    }
  };

  const issueCredential = async () => {
    if (!token || !templateId) return;
    const res = await fetch(`${apiBase}/credentials/issue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        templateId,
        recipientWallet,
        fields: {
          cohort: "2025-A",
          score: "98"
        }
      })
    });
    const data = await res.json();
    if (res.ok) {
      setStatus(`Issued credential. Verify: ${data.verifyUrl}`);
      setVerifyUrl(data.verifyUrl);
    } else {
      setStatus(data.error || "Issuance failed");
      setVerifyUrl(null);
    }
  };

  return (
    <main className="grid gap-6">
      <section className="glass p-6">
        <h2 className="text-xl font-semibold mb-3">ZENAuth Admin Console</h2>
        <p className="text-white/60 text-sm mb-4">
          Authenticate, craft templates, and issue credentials that become part of a permanent professional ledger.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <input
            className="rounded-lg bg-white/10 p-3"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
          />
          <input
            className="rounded-lg bg-white/10 p-3"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
          />
          <button
            className="bg-blue-500 hover:bg-blue-400 transition rounded-lg px-4 py-3 font-semibold"
            onClick={handleLogin}
          >
            {token ? "Authenticated" : "Login"}
          </button>
        </div>
      </section>

      <section className="glass p-6">
        <h3 className="font-semibold mb-3">Template & Issuance</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            className="bg-emerald-500 hover:bg-emerald-400 transition rounded-lg px-4 py-3 font-semibold"
            onClick={createTemplate}
          >
            Create ZEN Template
          </button>
          <input
            className="rounded-lg bg-white/10 p-3"
            value={templateId}
            onChange={(event) => setTemplateId(event.target.value)}
            placeholder="Template ID"
          />
          <input
            className="rounded-lg bg-white/10 p-3"
            value={recipientWallet}
            onChange={(event) => setRecipientWallet(event.target.value)}
            placeholder="Recipient Wallet"
          />
          <button
            className="bg-purple-500 hover:bg-purple-400 transition rounded-lg px-4 py-3 font-semibold"
            onClick={issueCredential}
          >
            Issue Credential
          </button>
        </div>
      </section>

      {status && (
        <section className="glass p-4 text-sm text-white/80">{status}</section>
      )}

      {verifyUrl && (
        <section className="glass p-4 text-sm text-white/80 grid gap-3">
          <div className="font-semibold">Verification QR</div>
          <img
            alt="Credential QR"
            className="w-40 h-40 rounded-lg border border-white/20"
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verifyUrl)}`}
          />
        </section>
      )}
    </main>
  );
}
