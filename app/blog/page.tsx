import { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { Footer } from "@/components/footer"
import { Calendar, ArrowUpRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Development Log | CryptoIntel",
  description: "Build history for the CryptoIntel platform.",
}

const devLogEntries = [
  {
    date: "Oct 2026",
    title: "Fix and Finish Pass",
    description: "Moved the AI calls to gpt-oss-120b on Groq after the old Llama model was retired, and made failures show as errors. Replaced the AMBCrypto feed, which blocks Vercel's servers, with The Block. Fixed coin-page news links and dates, made the header search and categories filter the whole feed, and decoded HTML entities in headlines. The watchlist stars now save across the site. Charts and sparklines now use real 7-day CoinGecko prices, the analysis history shows the Fear & Greed Index, sentiment shifts are computed from the feed, and the status page runs live checks. Copy across the site now matches what the code does.",
    tags: ["ai", "news", "markets", "core"],
  },
  {
    date: "Mar 2026",
    title: "Acquisition & Architecture Pages",
    description: "Added the acquisition overview with commercialization paths and the 5-layer architecture page with live links.",
    tags: ["meta", "documentation"],
  },
  {
    date: "Mar 2026",
    title: "Compliance Framework",
    description: "Data sources, content attribution guidelines, AI disclaimer and a deployment compliance checklist.",
    tags: ["legal", "compliance"],
  },
  {
    date: "Mar 2026",
    title: "System Status Page",
    description: "A status page for the platform's services. It showed fixed values until October 2026, when it switched to live checks.",
    tags: ["infrastructure", "monitoring"],
  },
  {
    date: "Mar 2026",
    title: "AI Deep Analysis",
    description: "Groq-powered analysis of single articles from the news feed, with sentiment, a confidence score, a short summary and the assets it affects.",
    tags: ["ai", "analysis"],
  },
  {
    date: "Mar 2026",
    title: "Markets Page with CoinGecko",
    description: "The top 500 coins from CoinGecko's free API with search, sorting, categories and pagination, cached to stay inside the free tier.",
    tags: ["markets", "api"],
  },
  {
    date: "Mar 2026",
    title: "Trending Tickers",
    description: "Tickers are pulled out of each article and counted across the feed to show what's being covered most.",
    tags: ["trending", "analysis"],
  },
  {
    date: "Mar 2026",
    title: "AI Sentiment Engine on Groq",
    description: "Batch sentiment over the newest headlines for the home page score, with a keyword score on every story as the fallback.",
    tags: ["ai", "infrastructure"],
  },
  {
    date: "Mar 2026",
    title: "News Feed from Public RSS",
    description: "Seven public crypto RSS feeds fetched in parallel and merged into one feed, with an optional CryptoNews API key on top.",
    tags: ["news", "core"],
  },
  {
    date: "Mar 2026",
    title: "Platform Architecture & Design System",
    description: "Next.js with TypeScript, Tailwind CSS, a dark theme and a shadcn/ui component library, built by directing v0, Vercel's AI app builder.",
    tags: ["foundation", "design"],
  },
]

const tagColors: Record<string, string> = {
  meta: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  documentation: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  legal: "bg-red-500/10 text-red-400 border-red-500/20",
  compliance: "bg-red-500/10 text-red-400 border-red-500/20",
  infrastructure: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  monitoring: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  ai: "bg-primary/10 text-primary border-primary/20",
  analysis: "bg-primary/10 text-primary border-primary/20",
  alerts: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  markets: "bg-green-500/10 text-green-400 border-green-500/20",
  api: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  trending: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  news: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  core: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  foundation: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  design: "bg-violet-500/10 text-violet-400 border-violet-500/20",
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SidebarNav />
      
      <main className="xl:ml-16">
        <div className="mx-auto max-w-[1000px] px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Development Log</span>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Build History
            </h1>
            <p className="mt-3 text-muted-foreground">
              Development timeline and feature releases for the CryptoIntel platform.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border hidden md:block" />
            
            <div className="space-y-6">
              {devLogEntries.map((entry, index) => (
                <div key={index} className="relative flex gap-6">
                  {/* Timeline dot */}
                  <div className="hidden md:flex shrink-0 w-4 h-4 mt-1.5 rounded-full bg-primary/20 border-2 border-primary items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 bg-card border border-border rounded-lg p-5 card-hover">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-foreground">{entry.title}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                        <Calendar className="w-3.5 h-3.5" />
                        {entry.date}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {entry.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-2 py-0.5 text-xs font-mono rounded border ${tagColors[tag] || "bg-secondary text-muted-foreground border-border"}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              CryptoIntel was first built in March 2026.
            </p>
            <a
              href="/architecture"
              className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              View System Architecture
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
        
        <Footer />
      </main>
    </div>
  )
}
