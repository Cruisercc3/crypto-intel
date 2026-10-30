import { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { Footer } from "@/components/footer"
import { Building2, Rss, FileText, ArrowRight, Briefcase, Coins, LineChart, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Enterprise | CryptoIntel",
  description: "White-label news intelligence, custom sentiment feeds, and branded deployment for crypto companies and trading platforms.",
}

const solutions = [
  {
    icon: Building2,
    title: "White-Label Deployment",
    description: "Deploy CryptoIntel under your own brand with custom colors, logo, and domain. Full news intelligence with AI sentiment analysis running under your identity. Ideal for exchanges, token projects, and trading communities.",
  },
  {
    icon: Rss,
    title: "Sentiment API Feed",
    description: "Integrate real-time sentiment data directly into your existing platform via REST API. Per-asset sentiment scores, aggregate market mood, and AI-generated analysis available as structured JSON endpoints.",
  },
  {
    icon: FileText,
    title: "Custom News Curation",
    description: "Filtered news feeds focused on specific assets, sectors, or themes. Custom source selection. Priority coverage for your project or ecosystem. Branded content alongside curated intelligence.",
  },
]

const useCases = [
  {
    icon: Coins,
    title: "Cryptocurrency Exchanges",
    description: "Branded news feeds for user dashboards",
  },
  {
    icon: Briefcase,
    title: "Token Projects",
    description: "Sentiment monitoring and community intelligence",
  },
  {
    icon: LineChart,
    title: "Trading Platforms",
    description: "Embedded sentiment widgets and alerts",
  },
  {
    icon: Search,
    title: "Research Firms",
    description: "Historical sentiment data and trend analysis",
  },
]

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SidebarNav />
      
      <main className="xl:ml-16">
        <div className="mx-auto max-w-[1200px] px-4 py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Enterprise</span>
            <h1 className="mt-3 text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              CryptoIntel for Business
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              White-label news intelligence, custom sentiment feeds, and branded deployment for crypto companies and trading platforms.
            </p>
          </div>

          {/* Enterprise Solutions */}
          <section className="mb-16">
            <h2 className="text-xl font-semibold text-foreground mb-6">Enterprise Solutions</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {solutions.map((solution) => (
                <div
                  key={solution.title}
                  className="bg-card border border-border rounded-lg p-6 card-hover"
                >
                  <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center mb-4">
                    <solution.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{solution.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{solution.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Who This Is For */}
          <section className="mb-16">
            <h2 className="text-xl font-semibold text-foreground mb-6">Who This Is For</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {useCases.map((useCase) => (
                <div
                  key={useCase.title}
                  className="bg-card border border-border rounded-lg p-5 flex items-start gap-4"
                >
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                    <useCase.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">{useCase.title}</h3>
                    <p className="text-xs text-muted-foreground">{useCase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact CTA */}
          <section className="bg-card border border-border rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Interested in enterprise deployment or API licensing?
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
              Contact us to discuss custom configurations, volume pricing, and integration support.
            </p>
            <Link href="/request-access">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Request Enterprise Access
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </section>
        </div>
        
        <Footer />
      </main>
    </div>
  )
}
