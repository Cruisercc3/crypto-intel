import Link from "next/link"
import { FEED_COUNT, MAX_COINS } from "@/lib/site"

const footerLinks = {
  platform: [
    { href: "/news", label: "News Feed" },
    { href: "/trending", label: "Trending" },
    { href: "/analysis", label: "AI Analysis" },
    { href: "/markets", label: "Markets" },
    { href: "/watchlist", label: "Watchlist" },
  ],
  enterprise: [
    { href: "/enterprise", label: "Enterprise" },
    { href: "/acquisition", label: "Acquisition" },
    { href: "/architecture", label: "Architecture" },
    { href: "/api-docs", label: "API" },
    { href: "/request-access", label: "Request Access" },
  ],
  resources: [
    { href: "/blog", label: "Dev Log" },
    { href: "/status", label: "System Status" },
    { href: "/compliance", label: "Compliance" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-sidebar border-t border-border xl:ml-16">
      <div className="mx-auto max-w-[1600px] px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                <span className="text-primary-foreground font-mono font-semibold text-xs">CI</span>
              </div>
              <span className="text-sm font-semibold text-foreground">CryptoIntel</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Crypto News Intelligence Infrastructure
            </p>
            <Link href="/status" className="flex items-center gap-2 group">
              <span className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-xs text-muted-foreground group-hover:text-foreground">Live system status</span>
            </Link>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enterprise Links */}
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">Enterprise</h4>
            <ul className="space-y-2">
              {footerLinks.enterprise.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2026 Conor Cruise. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span className="text-xs text-muted-foreground">{FEED_COUNT} news feeds</span>
            <span className="text-xs text-muted-foreground">Top {MAX_COINS} coins</span>
            <Link href="/acquisition" className="text-xs text-primary font-medium hover:text-primary/80 transition-colors">
              Complete platform available for acquisition
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
