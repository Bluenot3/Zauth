export default function Home() {
  return (
    <main className="grid gap-8">
      <section className="glass p-8">
        <h2 className="text-2xl font-semibold mb-2">Credential issuance for ZEN programs</h2>
        <p className="text-white/70">
          Issue on-chain credentials, generate QR-ready verification links, and deliver trusted proof for
          ZEN AI Co programs.
        </p>
      </section>
      <section className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Admin Issuance", copy: "Create templates and issue credentials with audit trails." },
          { title: "Recipient Wallet", copy: "Recipients connect wallets and share proof instantly." },
          { title: "Public Verification", copy: "Anyone can verify credentials and revocation status." }
        ].map((card) => (
          <div key={card.title} className="glass p-6">
            <h3 className="font-semibold mb-1">{card.title}</h3>
            <p className="text-white/70 text-sm">{card.copy}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
