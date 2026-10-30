import { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { Footer } from "@/components/footer"
import { Database, FileText, Brain, Shield, CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Content & Data Compliance | CryptoIntel",
  description: "Data sources, content attribution, AI disclaimer, and deployment compliance guidelines.",
}

const sections = [
  {
    icon: Database,
    title: "Data Sources",
    items: [
      "All news sourced from public RSS feeds with attribution",
      "Market data from CoinGecko's public tier",
      "No proprietary data collection, no user tracking",
    ],
  },
  {
    icon: FileText,
    title: "Content Attribution",
    items: [
      "All articles link to original sources",
      "Source names and publication dates displayed",
      "No content reproduction — headlines and summaries only",
    ],
  },
  {
    icon: Brain,
    title: "AI Disclaimer",
    items: [
      "AI sentiment analysis is interpretive, not financial advice",
      "Keyword scores come from word lists, AI scores from a language model reading the headlines",
      "Users should verify information with original sources",
    ],
  },
  {
    icon: Shield,
    title: "Deployment Compliance for Buyers",
    items: [
      "Review API terms of service for commercial use",
      "Add financial disclaimer for any monetized deployment",
      "Ensure GDPR/CCPA compliance for user data collection",
      "Consider content licensing if expanding beyond API-provided data",
    ],
  },
]

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SidebarNav />
      
      <main className="xl:ml-16">
        <div className="mx-auto max-w-[1000px] px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Legal</span>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Content & Data Compliance
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Guidelines for data sourcing, content attribution, and responsible platform deployment.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section) => (
              <div
                key={section.title}
                className="bg-card border border-border rounded-lg p-6 md:p-8"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center shrink-0">
                    <section.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground pt-1.5">{section.title}</h2>
                </div>
                <ul className="space-y-3 ml-14">
                  {section.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-bullish mt-0.5 shrink-0" />
                      <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Important Notice */}
          <div className="mt-8 bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-2">Important Notice</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This platform is provided as-is for informational purposes. Nothing on this site constitutes 
              financial advice. Users and buyers are responsible for ensuring their use of the platform 
              complies with applicable laws and regulations in their jurisdiction.
            </p>
          </div>

          {/* Related Links */}
          <div className="mt-8 pt-8 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">Related Pages</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href="/terms"
                className="px-4 py-2 bg-secondary text-sm text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/privacy"
                className="px-4 py-2 bg-secondary text-sm text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/architecture"
                className="px-4 py-2 bg-secondary text-sm text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                System Architecture
              </a>
            </div>
          </div>
        </div>
        
        <Footer />
      </main>
    </div>
  )
}
