import Link from 'next/link';

const LEGAL = [
  { href: '/legal/privacy-policy', label: 'Privacy Policy' },
  { href: '/legal/cookie-policy', label: 'Cookie Policy' },
  { href: '/legal/terms-of-service', label: 'Terms of Service' },
  { href: '/legal/disclaimer', label: 'Disclaimer' },
  { href: '/legal/acceptable-use', label: 'Acceptable Use' },
];

export default function Footer() {
  return (
    <footer className="relative bg-forge-panel border-t border-forge-border">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-br from-forge-accent to-forge-accent2" />
              <span className="font-orbitron font-bold tracking-[0.2em] text-forge-text">
                FORGE<span className="text-forge-accent">AI</span>
              </span>
            </div>
            <p className="text-sm text-forge-text2 leading-relaxed max-w-xs">
              AI-powered PC builds tuned to your budget, region and games.
              Compatibility checked. Explained part by part.
            </p>
          </div>

          <div>
            <h4 className="font-orbitron text-xs tracking-[0.25em] text-forge-text mb-4">PLATFORM</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/builder" className="text-forge-text2 hover:text-forge-accent transition-colors">PC Builder</Link></li>
              <li><Link href="/#features" className="text-forge-text2 hover:text-forge-accent transition-colors">How It Works</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-orbitron text-xs tracking-[0.25em] text-forge-text mb-4">LEGAL</h4>
            <ul className="space-y-2.5 text-sm">
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-forge-text2 hover:text-forge-accent transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <button id="cookie-settings-link" className="text-forge-text2 hover:text-forge-accent transition-colors">
                  Cookie Settings
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-forge-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-forge-text2">
            &copy; {new Date().getFullYear()} FORGE AI. All rights reserved.
          </p>
          <p className="text-xs text-forge-text2">
            Prices shown are estimates. Always verify with vendors before purchase.
          </p>
        </div>
      </div>
    </footer>
  );
}