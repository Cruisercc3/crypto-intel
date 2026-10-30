import { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { Footer } from "@/components/footer"
import { Code, Globe, FileText, Scale, CreditCard, Megaphone, Building, TrendingUp, Bell, Plug, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Acquisition Overview | CryptoIntel",
  description: "Complete ownership transfer — source code, domain, documentation, and unrestricted commercial rights.",
}

const includedItems = [
  {
    title: "Source Code & IP",
    description: "Complete Next.js 16 TypeScript codebase via GitHub transfer. 100% original. No licensing restrictions. Full ownership.",
    icon: Code,
  },
  {
    title: "Domain & Deployment",
    description: "Domain transfer included. Vercel config. 2-3 environment variables. Deploy in minutes. ~$1/month infrastructure.",
    icon: Globe,
  },
  {
    title: "Documentation",
    description: "5-layer architecture breakdown. Deployment guide. API integration reference. Video walkthrough. Rebranding guide.",
    icon: FileText,
  },
  {
    title: "Commercial Rights",
    description: "Unrestricted modification, rebranding, resale, white-label, and distribution rights. No royalties.",
    icon: Scale,
  },
]

const revenuePaths = [
  {
    title: "Launch a Crypto News Subscription",
    description: "Premium news intelligence at $9-19/month for traders wanting AI-analyzed news with market context.",
    icon: CreditCard,
  },
  {
    title: "Add Advertising Revenue",
    description: "The news feed format is naturally suited to display ads, sponsored content, and affiliate exchange links alongside articles.",
    icon: Megaphone,
  },
  {
    title: "White-Label for Crypto Projects",
    description: "Token projects and exchanges want branded news feeds for their communities. Deploy customized instances.",
    icon: Building,
  },
  {
    title: "Expand to Traditional Finance",
    description: "Replace crypto news APIs with general financial news sources. Same architecture, different market.",
    icon: TrendingUp,
  },
  {
    title: "Build a Premium Alert Service",
    description: "Sentiment shift alerts, breaking news notifications, and whale activity alerts as a paid notification service.",
    icon: Bell,
  },
  {
    title: "Integrate with Trading Platforms",
    description: "License the sentiment data feed to existing exchanges and trading platforms as an embedded widget or API.",
    icon: Plug,
  },
]

const techStack = [
  { label: "Framework", value: "Next.js 16 (App Router)" },
  { label: "Language", value: "TypeScript" },
  { label: "Styling", value: "Tailwind CSS" },
  { label: "News Data", value: "7 public RSS feeds + optional CryptoNews API" },
  { label: "Market Data", value: "CoinGecko API (top 500 coins) + alternative.me Fear & Greed" },
  { label: "AI", value: "Groq (openai/gpt-oss-120b)" },
  { label: "Deployment", value: "Vercel" },
]

export default function AcquisitionPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SidebarNav />
      
      <main className="xl:ml-16">
        <div className="mx-auto max-w-[1400px] px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Platform Transfer</span>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Acquisition Overview
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Complete ownership transfer — source code, domain, documentation, and unrestricted commercial rights.
            </p>
          </div>

          {/* What's Included */}
          <section className="mb-16">
            <h2 className="text-xl font-semibold text-foreground mb-6">What&apos;s Included</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {includedItems.map((item) => (
                <div
                  key={item.title}
                  className="bg-card border border-border rounded-lg p-6 card-hover"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Revenue Paths */}
          <section className="mb-16">
            <h2 className="text-xl font-semibold text-foreground mb-2">6 Paths to Revenue</h2>
            <p className="text-sm text-muted-foreground mb-6">Commercialization strategies for immediate deployment.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {revenuePaths.map((path, index) => (
                <div
                  key={path.title}
                  className="bg-card border border-border rounded-lg p-5 card-hover"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-lg font-bold text-primary font-mono">{index + 1}.</span>
                    <path.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-2">{path.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{path.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Tech Stack */}
          <section className="mb-16">
            <h2 className="text-xl font-semibold text-foreground mb-6">Tech Stack</h2>
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="grid md:grid-cols-2">
                {techStack.map((item, index) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between px-5 py-3.5 ${
                      index < techStack.length - 1 ? "border-b border-border" : ""
                    } ${index % 2 === 0 ? "md:border-r" : ""}`}
                  >
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-mono text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">Interested in acquiring this platform?</h2>
            <p className="text-sm text-muted-foreground mb-6">Get documentation or start the acquisition conversation.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/contact?type=docs"
                className="inline-flex items-center gap-2 bg-secondary text-foreground border border-border px-5 py-2.5 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
              >
                Request Documentation
              </Link>
              <Link
                href="/contact?type=acquisition"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Contact for Acquisition
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </div>
        
        <Footer />
      </main>
    </div>
  )
}
