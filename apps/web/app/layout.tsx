import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZENAuth",
  description: "Blockchain-backed credential issuance and verification."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
            <div className="relative">
              <div className="glow-ring" />
              <div className="relative">
                <p className="uppercase tracking-[0.4em] text-xs text-cyan-200/80">ZEN AI Co</p>
                <h1 className="text-3xl md:text-4xl font-semibold">ZENAuth</h1>
                <p className="text-white/70">The living ledger for every credential, badge, and honor.</p>
              </div>
            </div>
            <nav className="flex gap-4 text-sm text-white/70">
              <a href="/" className="hover:text-white">Home</a>
              <a href="/admin" className="hover:text-white">Admin</a>
              <a href="/wallet" className="hover:text-white">Wallet</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
