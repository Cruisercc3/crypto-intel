import { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { Footer } from "@/components/footer"
import { ArrowRight, Database, Brain, LineChart, TrendingUp, Shield, ExternalLink } from "lucide-react"
import { AI_MODEL, AI_PROVIDER, FEED_COUNT, MAX_COINS, RSS_FEEDS } from "@/lib/site"

export const metadata: Metadata = {
  title: "System Architecture | CryptoIntel",
  description: "How CryptoIntel is put together: public news feeds, keyword and AI sentiment, CoinGecko market data, all on Next.js route handlers.",
}

const feedNames = RSS_FEEDS.map(f => f.name).join(", ")

const layers = [
  {
    number: "01",
    title: "Multi-Source News Aggregation",
    description: `A Next.js route pulls ${FEED_COUNT} public RSS feeds in parallel (${feedNames}), so one blocked feed only costs its own stories. Every item is parsed into one article shape, tagged with tickers by name and capitalised symbol, and cached for 5 minutes. An optional CryptoNews API key adds up to 3 extra stories. Search, ticker and category filters run on the server across the whole pool.`,
    metrics: [
      { label: "Feeds", value: String(FEED_COUNT) },
      { label: "Cache", value: "5 min" },
      { label: "Client refresh", value: "60s" },
    ],
    link: { href: "/news", label: "News Feed" },
    icon: Database,
  },
  {
    number: "02",
    title: "Sentiment & AI Analysis",
    description: `Every headline gets a free keyword score (whole-word matching against bullish and bearish word lists). On top of that, ${AI_PROVIDER}'s ${AI_MODEL} reads a single article on request, the 10 newest headlines for the home page score, or one asset's headlines on the analysis page, and answers in JSON. If the model call fails, the page says so instead of showing a made-up score.`,
    metrics: [
      { label: "AI model", value: `${AI_PROVIDER} (${AI_MODEL})` },
      { label: "Analysis", value: "Per-article + per-asset + headline set" },
      { label: "Keyword score", value: "Every story" },
    ],
    link: { href: "/analysis", label: "AI Analysis" },
    icon: Brain,
  },
  {
    number: "03",
    title: "Live Market Data Context",
    description: `CoinGecko's free API supplies the top ${MAX_COINS} coins by market cap with 24h, 7d and 30d changes and a 7-day price line, plus global market stats. Requests are spaced out and cached for 15 minutes to stay inside the free tier. The Fear & Greed Index comes from alternative.me. Coin pages use TradingView charts where a Binance pair exists and draw the CoinGecko line where it doesn't.`,
    metrics: [
      { label: "Coins", value: `Top ${MAX_COINS}` },
      { label: "Cache", value: "15 min" },
      { label: "Data", value: "CoinGecko + alternative.me" },
    ],
    link: { href: "/markets", label: "Markets" },
    icon: LineChart,
  },
  {
    number: "04",
    title: "Discovery & Trending",
    description: "Trending tickers are counted from the tags on every story in the feed. Sentiment shifts compare each asset's keyword score in the last 24 hours with the stories before that. Headlines can be browsed by category, which the site assigns from keywords in each story.",
    metrics: [
      { label: "Trending", value: "Counted from tags" },
      { label: "Shifts", value: "Last 24h vs before" },
      { label: "Categories", value: "16" },
    ],
    link: { href: "/trending", label: "Trending" },
    icon: TrendingUp,
  },
  {
    number: "05",
    title: "Platform Infrastructure",
    description: "Next.js 16 on Vercel with no database and no user accounts. The watchlist lives in your browser's local storage. Contact and access forms post to Formspree. The status page checks every upstream live. There are 18 pages, including API docs, a development log, compliance and legal pages.",
    metrics: [
      { label: "Pages", value: "18" },
      { label: "Auth", value: "None" },
      { label: "Database", value: "None" },
      { label: "Status", value: "Live checks" },
    ],
    links: [
      { href: "/status", label: "Status" },
      { href: "/blog", label: "Blog" },
      { href: "/compliance", label: "Compliance" },
    ],
    icon: Shield,
  },
]

const summaryStats = [
  { label: "Layers", value: "5" },
  { label: "News feeds", value: String(FEED_COUNT) },
  { label: "Coins", value: String(MAX_COINS) },
  { label: "AI Sentiment", value: "Yes" },
  { label: "API routes", value: "8" },
  { label: "Pages", value: "18" },
  { label: "Infrastructure", value: "~$1/mo" },
]

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SidebarNav />

      <main className="xl:ml-16">
        <div className="mx-auto max-w-[1400px] px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <span className="text-xs font-mono text-primary uppercase tracking-widest">System Architecture</span>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              5-Layer News Intelligence Platform
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Every layer below is deployed. Each links to the page where it runs.
            </p>
          </div>

          {/* Layers */}
          <div className="space-y-6">
            {layers.map((layer) => (
              <div
                key={layer.number}
                className="bg-card border border-border rounded-lg p-6 md:p-8 card-hover"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Layer Number & Icon */}
                  <div className="flex items-center gap-4 lg:w-48 shrink-0">
                    <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                      <layer.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-muted-foreground">LAYER</span>
                      <div className="text-2xl font-bold text-primary font-mono">{layer.number}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold text-foreground mb-3">{layer.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {layer.description}
                    </p>

                    {/* Metrics */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      {layer.metrics.map((metric) => (
                        <div key={metric.label} className="bg-secondary/50 px-3 py-1.5 rounded">
                          <span className="text-xs text-muted-foreground">{metric.label}:</span>
                          <span className="ml-1.5 text-xs font-mono text-foreground">{metric.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-2">
                      {layer.link && (
                        <Link
                          href={layer.link.href}
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                          <ArrowRight className="w-4 h-4" />
                          {layer.link.label}
                        </Link>
                      )}
                      {layer.links && layer.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                          <ArrowRight className="w-4 h-4" />
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-12 bg-card border border-border rounded-lg p-6">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {summaryStats.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary font-mono">{stat.value}</span>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  {i < summaryStats.length - 1 && (
                    <span className="hidden md:block ml-4 text-border">|</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <Link
              href="/acquisition"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              View Acquisition Details
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  )
}
