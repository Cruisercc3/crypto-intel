import { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Privacy Policy | CryptoIntel",
  description: "Privacy policy for the CryptoIntel crypto news intelligence platform.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SidebarNav />

      <main className="xl:ml-16">
        <div className="mx-auto max-w-[860px] px-4 py-12">
          <div className="mb-8">
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Legal</span>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-foreground tracking-tight">Privacy Policy</h1>
            <p className="mt-3 text-sm text-muted-foreground font-mono">Effective: March 2026 &nbsp;·&nbsp; Version 1.4</p>
          </div>

          <div className="space-y-4">
            <div className="bg-primary/10 border border-primary/30 rounded-lg px-5 py-4">
              <p className="text-sm text-foreground leading-relaxed">
                This Privacy Policy explains how CryptoIntel collects, uses, stores, and protects information when you access the platform — including its web application, REST API, enterprise services, and associated infrastructure. CryptoIntel is designed with a data-minimisation philosophy: we collect only what is necessary to operate and improve the platform.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 md:p-8 space-y-8">

              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">01</span> Platform Overview &amp; Data Context
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  CryptoIntel is a cryptocurrency news intelligence platform aggregating content from public RSS news feeds, market data for the top 500 digital assets from CoinGecko, keyword sentiment on every headline and AI sentiment analysis through Groq. Understanding the architecture — detailed at <Link href="/architecture" className="text-primary hover:text-primary/80">/architecture</Link> — is relevant to understanding what data flows through the system:
                </p>
                <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> News content passes through server-side RSS parsers, gets a keyword sentiment score, and is cached. When you ask for AI analysis, the headline and article text (never anything about you) are sent to Groq. No user-identifiable data is appended to this pipeline.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Market data is fetched server-side from CoinGecko and cached. User queries do not trigger direct calls to third-party market APIs.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> TradingView chart widgets are rendered client-side and are subject to TradingView&apos;s own privacy policy.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> API consumers interact with our endpoints directly. Request metadata (IP address, timestamp, endpoint, response code) appears in Vercel's standard request logs.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">02</span> Information We Collect
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-2">Information you provide directly</h3>
                    <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                      <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Contact form submissions (name, email, company, enquiry type, message) submitted via <Link href="/contact" className="text-primary hover:text-primary/80">/contact</Link>.</li>
                      <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Request Access form submissions (name, email, company, interest area, use case description) submitted via <Link href="/request-access" className="text-primary hover:text-primary/80">/request-access</Link>.</li>
                      <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Newsletter waitlist sign-ups (email address only) from the home page.</li>
                      <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Enterprise and acquisition enquiry details submitted through the Enterprise portal at <Link href="/enterprise" className="text-primary hover:text-primary/80">/enterprise</Link>.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-2">Information collected automatically</h3>
                    <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                      <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Standard web server logs: IP address, browser user-agent, referring URL, requested path, HTTP status code, and timestamp. Logs are retained for up to 30 days for security purposes.</li>
                      <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Vercel platform analytics (aggregated, anonymised page view and performance data). Individual users are not identified in these analytics.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-2">Browser-stored data</h3>
                    <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                      <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Watchlist preferences (selected assets) are stored in browser local storage on your device. This data is never transmitted to CryptoIntel servers.</li>
                      <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Filter selections and chart toggles live only in the open page and are not stored.</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">03</span> How We Use Your Information
                </h2>
                <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> To respond to contact, enterprise, and access request enquiries.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> To process and evaluate API access requests, enterprise licensing negotiations, and acquisition enquiries.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> To detect abuse and protect platform integrity.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> To monitor system health and performance via aggregated, anonymised telemetry.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> To comply with legal obligations, regulatory requirements, and court orders where applicable.</li>
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  We do not sell, rent, or trade personal data to third parties. We do not use personal data for advertising or profiling purposes.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">04</span> Cookies &amp; Tracking
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  CryptoIntel uses minimal, strictly necessary cookies only. We do not deploy third-party advertising cookies, retargeting pixels, or behavioural tracking technologies. The following limited cookies may be set:
                </p>
                <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Session cookies for basic navigation state (no persistent identifiers).</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Vercel infrastructure cookies necessary for edge function routing and performance optimisation.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> TradingView widget cookies, governed by TradingView&apos;s own cookie policy, set client-side when chart components are rendered.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">05</span> Third-Party Integrations
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  The platform integrates with the following third-party services, each operating under their own privacy policies:
                </p>
                <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> <strong className="text-foreground">CoinGecko</strong> — market data API (server-side only; no user data transmitted).</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> <strong className="text-foreground">TradingView</strong> — chart widgets rendered client-side; subject to TradingView&apos;s privacy policy.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> <strong className="text-foreground">Vercel</strong> — hosting, edge network, and anonymised analytics infrastructure.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> <strong className="text-foreground">RSS News Publishers</strong> (CoinDesk, CoinTelegraph, Decrypt, Bitcoin Magazine, NewsBTC, The Block, Crypto Briefing) — content aggregated server-side via public RSS feeds.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> <strong className="text-foreground">Groq</strong> — AI analysis. Receives headlines and article text when analysis is requested. No user data is sent.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> <strong className="text-foreground">alternative.me</strong> — Fear &amp; Greed Index (server-side only; no user data transmitted).</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> <strong className="text-foreground">Formspree</strong> — contact, access request and newsletter waitlist submissions are processed by this form provider.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">06</span> Enterprise &amp; API Consumer Data
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Enterprise clients, white-label licensees, and API consumers are subject to additional data processing terms set out in their respective Master Service Agreements (MSA). In the context of enterprise engagements:
                </p>
                <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Business contact information provided during acquisition or licensing negotiations is retained for the duration of those negotiations and for up to 3 years thereafter for audit purposes.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> API keys are not issued yet. If they are introduced, issuance will require a valid business email address and agreed terms.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> White-label deployments operate on dedicated infrastructure; user data generated within those deployments is the responsibility of the licensee as the independent data controller.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">07</span> Data Retention
                </h2>
                <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Contact and enquiry form data: retained for up to 2 years or until the purpose for which it was collected is fulfilled.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Server access logs: retained for 30 days then purged.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Enterprise engagement records: retained for up to 7 years for legal and audit compliance.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Browser-stored data (watchlist, UI prefs): persists on your device until cleared; not stored on our servers.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">08</span> Compliance &amp; Legal Basis (GDPR)
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  For users in the EU and UK, our lawful basis for processing personal data is as follows:
                </p>
                <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> <strong className="text-foreground">Legitimate interests</strong> — server log retention for security, abuse detection, and platform integrity.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> <strong className="text-foreground">Contract performance</strong> — processing enquiry data to respond to and fulfil enterprise, licensing, and access requests.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> <strong className="text-foreground">Legal obligation</strong> — retaining enterprise records for tax, audit, and regulatory compliance purposes.</li>
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  A full compliance overview, including jurisdiction-specific data handling practices, is available at <Link href="/compliance" className="text-primary hover:text-primary/80">/compliance</Link>.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">09</span> Your Rights
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Depending on your jurisdiction, you may have the following rights regarding your personal data:
                </p>
                <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Right of access — request a copy of personal data we hold about you.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Right to rectification — request correction of inaccurate data.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Right to erasure — request deletion of your data, subject to legal retention obligations.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Right to data portability — receive your data in a structured, machine-readable format.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Right to restrict processing or object — where processing is based on legitimate interests.</li>
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  To exercise any of these rights, contact us at{" "}
                  <a href="mailto:privacy@cryptointel.dev" className="text-primary hover:text-primary/80">privacy@cryptointel.dev</a>.
                  We will respond within 30 days.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">10</span> Security
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  CryptoIntel is deployed on Vercel&apos;s global edge infrastructure with HTTPS enforced on all endpoints. Third-party credentials stay on the server and are never sent to the browser. Despite these measures, no transmission over the internet is entirely secure, and we cannot guarantee absolute security. In the event of a data breach affecting personal data, we will notify affected individuals and relevant authorities in accordance with applicable law.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">11</span> Changes to This Policy
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy periodically to reflect changes in platform functionality, data practices, or legal requirements. Material changes will be flagged with a revised &quot;Effective&quot; date. Continued use of the platform after an update constitutes acceptance of the revised policy. Enterprise clients will be notified of material changes via the contact details held in their MSA.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">12</span> Contact
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Privacy enquiries:{" "}
                  <a href="mailto:privacy@cryptointel.dev" className="text-primary hover:text-primary/80">privacy@cryptointel.dev</a>.
                  Enterprise data processing enquiries: <Link href="/enterprise" className="text-primary hover:text-primary/80">/enterprise</Link>.
                  General contact: <Link href="/contact" className="text-primary hover:text-primary/80">/contact</Link>.
                </p>
              </section>

            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  )
}
