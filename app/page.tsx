"use client"

import { Navigation } from "@/components/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { StatsBar } from "@/components/home/stats-bar"
import { PriceTicker } from "@/components/home/price-ticker"
import { HeadlinesTicker } from "@/components/home/headlines-ticker"
import { FeaturedArticle } from "@/components/home/featured-article"
import { NewsGrid } from "@/components/home/news-grid"
import { SentimentWidget } from "@/components/home/sentiment-widget"
import { TopMovers } from "@/components/home/top-movers"
import { Footer } from "@/components/footer"
import { CategoryNewsRow } from "@/components/home/category-news-row"
import { TopAssetsTable } from "@/components/home/top-assets-table"
import { TrendingInNews } from "@/components/home/trending-in-news"
import { MarketPulseSidebar } from "@/components/home/market-pulse-sidebar"
import { LatestByCategory } from "@/components/home/latest-by-category"
import { NewsletterBanner } from "@/components/home/newsletter-banner"
import { MoreStories } from "@/components/home/more-stories"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"

// Rendered after mount so the date is the visitor's own, not the server's
function TodayLabel() {
  const [label, setLabel] = useState("")
  useEffect(() => {
    setLabel(new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }).toUpperCase())
  }, [])
  return <span className="text-xs text-muted-foreground font-mono">{label}</span>
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <StatsBar />
      <Navigation />
      <PriceTicker />
      <HeadlinesTicker />
      <SidebarNav />

      <main className="xl:ml-16">
        {/* ── SECTION 1: TOP STORY + SIDEBAR ─────────────────────────────── */}
        <section className="px-4 pt-6 pb-0">
          <div className="mx-auto max-w-[1600px]">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h1 className="text-xl font-bold text-foreground uppercase tracking-wide">Latest Crypto News</h1>
                <TodayLabel />
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <span className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 border border-primary/30 rounded">TOP STORY</span>
                <Link href="/news?section=analysis" className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-secondary rounded">ANALYSIS</Link>
                <Link href="/news?section=markets" className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-secondary rounded">MARKETS</Link>
                <Link href="/news?section=defi" className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-secondary rounded">DEFI</Link>
              </div>
            </div>
            <div className="flex flex-col xl:flex-row gap-6">
              <div className="flex-1 min-w-0">
                <FeaturedArticle />
              </div>
              <div className="xl:w-72 shrink-0 space-y-4">
                <SentimentWidget />
                <TrendingInNews />
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: MORE STORIES GRID ────────────────────────────────── */}
        <section className="px-4 pt-8 pb-0">
          <div className="mx-auto max-w-[1600px]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-widest border-l-2 border-primary pl-3">More Stories</h2>
              <Link href="/news" className="flex items-center gap-1 text-xs text-primary hover:underline">
                See all crypto news <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <NewsGrid />
          </div>
        </section>

        {/* ── SECTION 3: BY CATEGORY ROW ──────────────────────────────────── */}
        <section className="px-4 pt-10 pb-0">
          <div className="mx-auto max-w-[1600px]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-widest border-l-2 border-primary pl-3">News by Category</h2>
              <Link href="/news" className="flex items-center gap-1 text-xs text-primary hover:underline">
                Browse all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid lg:grid-cols-3 gap-4 mb-6">
              <CategoryNewsRow category="DeFi" section="defi" href="/news?section=defi" accentClass="text-chart-2" />
              <CategoryNewsRow category="ETF" section="etf" href="/news?section=etf" accentClass="text-chart-4" />
              <CategoryNewsRow category="Stablecoins" section="stablecoins" href="/news?section=stablecoins" accentClass="text-bearish" />
            </div>
            {/* Topic pills */}
            <div className="flex flex-wrap gap-2 pb-2">
              {['DeFi', 'Legal', 'Trading', 'Investments', 'Stablecoins', 'ETF', 'Mining', 'Web3', 'Layer 2', 'NFT', 'Gaming', 'Macro'].map(cat => (
                <Link key={cat} href={`/news?section=${cat.toLowerCase().replace(' ', '-')}`}
                  className="flex items-center justify-between gap-2 px-4 py-2 bg-card border border-border rounded hover:border-primary/50 hover:text-primary text-sm text-foreground transition-colors group">
                  {cat}
                  <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 4: MARKET MOVERS + MORE STORIES LIST ────────────────── */}
        <section className="px-4 pt-10 pb-0">
          <div className="mx-auto max-w-[1600px]">
            <div className="flex flex-col xl:flex-row gap-6">
              {/* Left: More articles list */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-bold text-foreground uppercase tracking-widest border-l-2 border-primary pl-3">Latest Stories</h2>
                  <Link href="/news" className="flex items-center gap-1 text-xs text-primary hover:underline">View all <ArrowRight className="h-3 w-3" /></Link>
                </div>
                <MoreStories />
              </div>
              {/* Right: Market Pulse */}
              <div className="xl:w-72 shrink-0">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-bold text-foreground uppercase tracking-widest border-l-2 border-primary pl-3">Market Pulse</h2>
                  <Link href="/markets" className="flex items-center gap-1 text-xs text-primary hover:underline">All coins <ArrowRight className="h-3 w-3" /></Link>
                </div>
                <MarketPulseSidebar />
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: TOP CRYPTO ASSETS TABLE ──────────────────────────── */}
        <section className="px-4 pt-10 pb-0">
          <div className="mx-auto max-w-[1600px]">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
                  <span className="text-primary text-xs font-bold">↑</span>
                </div>
                <h2 className="text-base font-bold text-foreground">Top Crypto Assets</h2>
              </div>
              <Link href="/markets" className="flex items-center gap-1 text-xs text-primary hover:underline">
                All coins <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <TopAssetsTable />
          </div>
        </section>

        {/* ── SECTION 6: NEWSLETTER BANNER ────────────────────────────────── */}
        <section className="px-4 pt-10 pb-0">
          <div className="mx-auto max-w-[1600px]">
            <NewsletterBanner />
          </div>
        </section>

        {/* ── SECTION 7: LATEST BY CATEGORY (OP-EDS / ANALYSIS / MACRO) ──── */}
        <section className="px-4 pt-10 pb-0">
          <div className="mx-auto max-w-[1600px]">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold">!</span>
              </div>
              <div>
                <p className="text-[10px] text-primary uppercase tracking-widest font-semibold">Deep Coverage</p>
                <h2 className="text-base font-bold text-foreground leading-tight">Voices That Shape the Market</h2>
              </div>
            </div>
            <LatestByCategory />
          </div>
        </section>

        {/* ── SECTION 8: SECOND MARKET MOVERS ROW ─────────────────────────── */}
        <section className="px-4 pt-10 pb-8">
          <div className="mx-auto max-w-[1600px]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-widest border-l-2 border-primary pl-3">Top Movers</h2>
              <Link href="/markets" className="flex items-center gap-1 text-xs text-primary hover:underline">Markets <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <TopMovers />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
