import { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Terms of Service | CryptoIntel",
  description: "Terms of service for the CryptoIntel crypto news intelligence platform.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SidebarNav />

      <main className="xl:ml-16">
        <div className="mx-auto max-w-[860px] px-4 py-12">
          <div className="mb-8">
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Legal</span>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-foreground tracking-tight">Terms of Service</h1>
            <p className="mt-3 text-sm text-muted-foreground font-mono">Effective: March 2026 &nbsp;·&nbsp; Version 1.4</p>
          </div>

          <div className="space-y-4">
            {/* Intro notice */}
            <div className="bg-primary/10 border border-primary/30 rounded-lg px-5 py-4">
              <p className="text-sm text-foreground leading-relaxed">
                These Terms of Service govern your access to and use of the CryptoIntel platform, including its news intelligence infrastructure, AI sentiment engine, REST API, market data feeds, enterprise licensing programmes, and all associated web interfaces. By accessing any part of the platform you confirm that you have read, understood, and agree to be bound by these terms in full.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 md:p-8 space-y-8">

              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">01</span> Platform Description &amp; Scope
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  CryptoIntel is a cryptocurrency news intelligence platform aggregating content from 7 public RSS news feeds, market data for the top 500 digital assets via CoinGecko, keyword sentiment on every headline and AI sentiment analysis through Groq. The platform comprises:
                </p>
                <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> A public web application providing news feeds, trending analysis, AI sentiment dashboards, market tables, per-asset detail pages, and a personal watchlist.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> A REST API (documented at <Link href="/api-docs" className="text-primary hover:text-primary/80">/api-docs</Link>) providing programmatic access to news, sentiment scores, market data, and AI analysis endpoints.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> An enterprise licensing tier offering white-label deployment, custom data feeds, dedicated infrastructure, and acquisition pathways.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Internal analytics, batch sentiment processing, and TradingView-integrated charting components.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">02</span> Acceptance &amp; Eligibility
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You must be at least 18 years of age and legally capable of entering binding contracts to use the platform. Use by entities on OFAC, EU, UN, or other applicable sanctions lists is strictly prohibited. Enterprise clients and API licensees must complete the Request Access process at <Link href="/request-access" className="text-primary hover:text-primary/80">/request-access</Link> and receive written confirmation before accessing restricted tiers. Your continued use after any amendment to these terms constitutes acceptance of the revised terms.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">03</span> Not Financial or Investment Advice
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  All content on the CryptoIntel platform — including but not limited to news aggregation, AI-generated sentiment scores, trending analysis, market data, price charts, and per-asset summaries — is provided strictly for informational and research purposes. Nothing on this platform constitutes:
                </p>
                <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Financial, investment, trading, tax, or legal advice of any kind.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> A solicitation, recommendation, or endorsement to buy, sell, or hold any digital asset or financial instrument.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> A guarantee of accuracy, completeness, or future performance of any market data or AI sentiment output.</li>
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  Cryptocurrency markets are highly volatile and speculative. Always conduct independent research and consult qualified financial and legal professionals before making any investment decisions.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">04</span> API Access &amp; Licensing
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  The CryptoIntel API routes are currently open and do not use keys. If keys and the access tiers planned in the API documentation are introduced, keys will be non-transferable and must not be shared, resold, or embedded in publicly accessible client-side code. Permitted uses include:
                </p>
                <ul className="space-y-1.5 text-sm text-muted-foreground ml-4 mb-3">
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Internal application development, research tooling, and personal projects at reasonable request volumes.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Commercial use under a valid Enterprise or white-label licence agreement.</li>
                  <li className="flex gap-2"><span className="text-primary shrink-0">—</span> Integration into exchange platforms, trading terminals, and research products with explicit written consent.</li>
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Scraping, reverse engineering, or circumventing any rate limits is prohibited and may result in immediate termination and legal action. Free-tier access is provided as-is with no SLA guarantees. Enterprise and paid tiers are governed by separate service level agreements.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">05</span> Enterprise, White-Label &amp; Acquisition
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  CryptoIntel is available for enterprise licensing, white-label deployment, and full platform acquisition. Enterprise engagements include custom-branded deployments of the news intelligence infrastructure, sentiment API feeds, and market data pipelines. Architecture details are available at <Link href="/architecture" className="text-primary hover:text-primary/80">/architecture</Link> and acquisition enquiries at <Link href="/acquisition" className="text-primary hover:text-primary/80">/acquisition</Link>.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  All enterprise, licensing, and acquisition engagements are subject to separate Master Service Agreements (MSA), Non-Disclosure Agreements (NDA), and — where applicable — Share Purchase or Asset Transfer Agreements. Nothing in these public Terms of Service constitutes an offer to sell or transfer intellectual property. Enterprise pricing, SLAs, data retention, and support terms supersede these general terms where applicable.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">06</span> Data Sources &amp; Third-Party Content
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  News content is aggregated via publicly available RSS feeds from third-party publishers including CoinDesk, CoinTelegraph, Decrypt, Bitcoin Magazine, NewsBTC, The Block, and Crypto Briefing. Market data is sourced from the CoinGecko public API and the Fear &amp; Greed Index from alternative.me. Chart data is rendered via TradingView widgets. Sentiment scores come from headline keywords and, on request, from an AI model on Groq, and represent automated analysis only.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  CryptoIntel does not claim ownership of third-party content. All news articles link to their original sources. Third-party data providers operate under their own terms and policies. We make no warranties as to the accuracy, latency, or completeness of any externally sourced data.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">07</span> Compliance &amp; Regulatory Obligations
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  CryptoIntel operates in compliance with applicable data protection legislation including GDPR (EU/UK), CCPA (California), and other relevant jurisdictions. Platform operators and API consumers are individually responsible for ensuring their use of CryptoIntel data and services complies with local laws and regulations in their operating territories.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Enterprise clients integrating CryptoIntel into regulated financial products — including trading platforms, asset management tools, or regulated exchanges — are solely responsible for obtaining all required regulatory approvals, licences, and compliance sign-offs. A dedicated compliance overview is available at <Link href="/compliance" className="text-primary hover:text-primary/80">/compliance</Link>.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">08</span> Intellectual Property
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The CryptoIntel platform, including its architecture, AI sentiment models, scoring algorithms, UI design, branding, and all proprietary source code, is the exclusive intellectual property of the platform owner. No part of the platform may be reproduced, distributed, sublicensed, or used to create derivative works without express written permission. The &quot;CryptoIntel&quot; name, logo, and associated marks are protected. API consumers are granted a limited, non-exclusive, non-transferable licence to access platform data within the scope of their agreed tier.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">09</span> Limitation of Liability
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To the maximum extent permitted by applicable law, CryptoIntel, its operators, affiliates, and licensors shall not be liable for any direct, indirect, incidental, special, consequential, punitive, or exemplary damages — including but not limited to loss of profits, loss of data, loss of goodwill, or financial losses — arising from or related to your use of the platform, reliance on any AI sentiment output or market data, API downtime, third-party data inaccuracies, or any platform acquisition or enterprise licensing engagement. Total liability in any event shall not exceed the fees paid by you to CryptoIntel in the twelve months preceding the claim.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">10</span> Governing Law &amp; Disputes
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  These terms are governed by the laws of Ireland without regard to conflict of law principles. Any disputes arising from or relating to these terms or the platform shall be submitted to the exclusive jurisdiction of the courts of Ireland, unless otherwise agreed in a separate enterprise or licensing agreement. Enterprise disputes are subject to the dispute resolution mechanism set out in the applicable MSA.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">11</span> Modifications &amp; Termination
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We reserve the right to modify, suspend, or discontinue any part of the platform at any time without notice. These terms may be updated at any time; the &quot;Effective&quot; date above reflects the current version. Continued use of the platform following any amendment constitutes acceptance of the revised terms. We may terminate or restrict your access for breach of these terms, misuse of the API, or any activity determined to be harmful to the platform or its users.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary font-mono text-xs">12</span> Contact
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Legal and compliance enquiries:{" "}
                  <a href="mailto:legal@cryptointel.dev" className="text-primary hover:text-primary/80">legal@cryptointel.dev</a>.
                  Enterprise and licensing enquiries: <Link href="/enterprise" className="text-primary hover:text-primary/80">/enterprise</Link>.
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
