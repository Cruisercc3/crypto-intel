import { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { Footer } from "@/components/footer"
import { ArrowRight, Key, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AI_MODEL, MAX_COINS } from "@/lib/site"

export const metadata: Metadata = {
  title: "API Reference | CryptoIntel",
  description: "The JSON routes behind CryptoIntel: news, sentiment, market data and status.",
}

const endpoints = [
  {
    method: "GET",
    path: "/api/news",
    description: "Articles from every feed, newest first, with keyword sentiment and ticker tags. Filters run across the whole pool, then the result is paged.",
    parameters: [
      { name: "tickers", type: "string", required: false, description: "One symbol, e.g. BTC" },
      { name: "name", type: "string", required: false, description: "Coin name, used with tickers for coins outside the built-in list" },
      { name: "search", type: "string", required: false, description: "Text to find in titles and summaries" },
      { name: "section", type: "string", required: false, description: "Category slug, e.g. defi, etf, regulation, macro" },
      { name: "page", type: "number", required: false, description: "Page number (default 1)" },
      { name: "limit", type: "number", required: false, description: "Articles per page (default 30, max 200)" },
    ],
    response: "{ data: Article[], total, total_pages, pool, sources: { name, ok, count }[], updated }",
  },
  {
    method: "GET",
    path: "/api/coins",
    description: `Market data for the top ${MAX_COINS} coins from CoinGecko, cached for 15 minutes.`,
    parameters: [
      { name: "per_page", type: "number", required: false, description: `How many coins (default 100, max ${MAX_COINS})` },
      { name: "id", type: "string", required: false, description: "One CoinGecko id, e.g. bitcoin. Returns { coin }" },
      { name: "sparkline", type: "1", required: false, description: "Include the 7-day price line (one point every 2 hours)" },
    ],
    response: "{ coins: Coin[], total, timestamp }",
  },
  {
    method: "GET",
    path: "/api/prices",
    description: "Price, 24h change and market cap for a list of symbols.",
    parameters: [
      { name: "symbols", type: "string", required: false, description: "Comma-separated, e.g. BTC,ETH,SOL" },
    ],
    response: "{ prices: { symbol, price, change24h, marketCap }[], timestamp }",
  },
  {
    method: "GET",
    path: "/api/market-stats",
    description: "Global market cap, volume, BTC and ETH dominance from CoinGecko, plus today's Fear & Greed Index.",
    parameters: [],
    response: "{ totalMarketCap, totalVolume24h, btcDominance, ethDominance, activeCryptos, fearGreedIndex, fearGreedLabel, marketCapChange24h }",
  },
  {
    method: "GET",
    path: "/api/fear-greed",
    description: "Daily Fear & Greed Index history from alternative.me, oldest first.",
    parameters: [
      { name: "days", type: "number", required: false, description: "Days of history (default 30, max 90)" },
    ],
    response: "{ points: { date, value, label }[] }",
  },
  {
    method: "POST",
    path: "/api/sentiment",
    description: `AI read of one article by ${AI_MODEL}. Errors come back as { error } with a 4xx or 5xx status.`,
    parameters: [
      { name: "title", type: "string", required: true, description: "Headline" },
      { name: "text", type: "string", required: false, description: "Article text, first 1,500 characters are used" },
    ],
    response: "{ sentiment, score (-100 to 100), confidence, summary, impactedAssets, marketImpact }",
  },
  {
    method: "POST",
    path: "/api/sentiment/batch",
    description: "AI read of up to 15 headlines at once. Each server instance keeps an answer for 10 minutes per headline set.",
    parameters: [
      { name: "articles", type: "{ title }[]", required: true, description: "Headlines to read" },
      { name: "focus", type: "string", required: false, description: "An asset name, to judge sentiment toward that asset" },
    ],
    response: "{ overallSentiment, overallScore, bullishPercent, bearishPercent, neutralPercent, topThemes, marketMood, analyzed }",
  },
  {
    method: "GET",
    path: "/api/status",
    description: "Live check of every upstream: each news feed, CoinGecko, alternative.me and the AI model.",
    parameters: [],
    response: "{ checked, services: { name, group, status, detail }[] }",
  },
]

const plannedTiers = [
  { tier: "Free", limit: "100 requests/day" },
  { tier: "Pro", limit: "10,000 requests/day" },
  { tier: "Enterprise", limit: "Custom limits" },
]

export default function APIDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SidebarNav />

      <main className="xl:ml-16">
        <div className="mx-auto max-w-[1000px] px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <span className="text-xs font-mono text-primary uppercase tracking-widest">API Reference</span>
            <h1 className="mt-3 text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              CryptoIntel API
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl">
              These are the JSON routes the site itself runs on. They return what the pages show, from the same caches.
            </p>
          </div>

          {/* Available Endpoints */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-6">Available Endpoints</h2>
            <div className="space-y-4">
              {endpoints.map((endpoint) => (
                <div
                  key={endpoint.path}
                  className="bg-card border border-border rounded-lg overflow-hidden"
                >
                  {/* Endpoint Header */}
                  <div className="flex items-center gap-3 p-4 border-b border-border bg-secondary/30">
                    <span className={`px-2 py-0.5 text-xs font-mono font-bold rounded ${
                      endpoint.method === "GET"
                        ? "bg-bullish/20 text-bullish"
                        : "bg-primary/20 text-primary"
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-sm font-mono text-foreground">{endpoint.path}</code>
                  </div>

                  {/* Endpoint Body */}
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground mb-4">{endpoint.description}</p>

                    {endpoint.parameters.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">Parameters</h4>
                        <div className="bg-secondary/50 rounded-lg overflow-x-auto">
                          <table className="w-full text-sm min-w-[480px]">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Name</th>
                                <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Type</th>
                                <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Required</th>
                                <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {endpoint.parameters.map((param) => (
                                <tr key={param.name} className="border-b border-border last:border-0">
                                  <td className="px-3 py-2 font-mono text-xs text-foreground">{param.name}</td>
                                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{param.type}</td>
                                  <td className="px-3 py-2 text-xs">
                                    {param.required ? (
                                      <span className="text-bearish">Yes</span>
                                    ) : (
                                      <span className="text-muted-foreground">No</span>
                                    )}
                                  </td>
                                  <td className="px-3 py-2 text-xs text-muted-foreground">{param.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">Response</h4>
                      <code className="block text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded break-words">{endpoint.response}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Authentication */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Authentication
            </h2>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-4">
                There are no API keys yet. The routes are open, the same as when the site calls them.
                Go easy on them, they sit on free upstream tiers.
              </p>
              <div className="bg-[#0d1117] rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-[#c9d1d9]">
                  <span className="text-[#7ee787]">curl</span> <span className="text-[#a5d6ff]">&quot;https://www.cryptointel.site/api/news?tickers=BTC&amp;limit=5&quot;</span>
                </pre>
              </div>
            </div>
          </section>

          {/* Planned tiers */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Planned Access Tiers
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Keys and rate limits aren&apos;t built. This is the plan for when they are.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {plannedTiers.map((tier) => (
                <div
                  key={tier.tier}
                  className={`bg-card border rounded-lg p-5 text-center ${
                    tier.tier === "Enterprise" ? "border-primary" : "border-border"
                  }`}
                >
                  <h3 className="text-sm font-semibold text-foreground mb-1">{tier.tier}</h3>
                  <p className="text-lg font-mono text-primary">{tier.limit}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Get Started CTA */}
          <section className="bg-card border border-border rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-3">Get Started</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
              Planning to build on this data? Request access and say what you need.
            </p>
            <Link href="/request-access">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Request API Access
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
