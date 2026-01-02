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
          <header className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-semibold">ZENAuth</h1>
              <p className="text-white/70">Build once, verify forever.</p>
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
