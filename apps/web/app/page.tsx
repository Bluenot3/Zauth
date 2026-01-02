export default function Home() {
  return (
    <main className="grid gap-10">
      <section className="glass p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-60 pointer-events-none" />
        <div className="grid gap-6 md:grid-cols-[1.3fr_0.7fr] items-center relative">
          <div>
            <p className="text-cyan-200/80 text-sm uppercase tracking-[0.3em]">ZEN AI Co · Credential Network</p>
            <h2 className="text-3xl md:text-4xl font-semibold mt-3">
              A new-age credential ledger that replaces the resume.
            </h2>
            <p className="text-white/70 mt-4">
              ZENAuth turns diplomas, certifications, licenses, awards, and achievements into tamper-proof tokens.
              Every credential is minted with cryptographic proof, verifiable anywhere in seconds.
            </p>
            <div className="flex flex-wrap gap-3 mt-6 text-sm">
              <span className="px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-100 border border-cyan-400/30">
                Keccak Proof
              </span>
              <span className="px-4 py-2 rounded-full bg-purple-500/20 text-purple-100 border border-purple-400/30">
                Instant Verify
              </span>
              <span className="px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-100 border border-emerald-400/30">
                Revocation Safe
              </span>
            </div>
          </div>
          <div className="glass p-6 space-y-4">
            <div className="text-sm text-white/60">Live Credential Stack</div>
            {[
              { title: "AI Pioneer Diploma", meta: "ZEN AI Co · 2025 Cohort" },
              { title: "Cybersecurity License", meta: "Vanguard Labs · Validated" },
              { title: "Healthcare Compliance Badge", meta: "Clinic Network · Active" }
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="font-semibold">{item.title}</div>
                <div className="text-xs text-white/60">{item.meta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Admin Issuance", copy: "Create templates and issue credentials with audit trails and chain proofs." },
          { title: "Recipient Wallet", copy: "Recipients connect wallets and share proofs instantly with QR." },
          { title: "Public Verification", copy: "Anyone verifies status and metadata with anti-tamper hashing." }
        ].map((card) => (
          <div key={card.title} className="glass p-6">
            <h3 className="font-semibold mb-1">{card.title}</h3>
            <p className="text-white/70 text-sm">{card.copy}</p>
          </div>
        ))}
      </section>

      <section className="glass p-8 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-xl font-semibold mb-2">Industries served</h3>
          <p className="text-white/70 text-sm">
            Built for universities, training programs, professional societies, and enterprises that need trusted
            proof of capability at scale.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-white/70">
          {[
            "Education & Bootcamps",
            "Healthcare & Licensing",
            "Finance & Compliance",
            "Government & Civic",
            "Creative & Media",
            "Enterprise L&D"
          ].map((label) => (
            <div key={label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              {label}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
