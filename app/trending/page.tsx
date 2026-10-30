import { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { StatsBar } from "@/components/home/stats-bar"
import { PriceTicker } from "@/components/home/price-ticker"
import { Footer } from "@/components/footer"
import { TrendingTickersWrapper } from "@/components/trending/trending-tickers-wrapper"
import { SentimentShifts } from "@/components/trending/sentiment-shifts"
import { BreakingNews } from "@/components/trending/breaking-news"
import { MostRead } from "@/components/trending/most-read"
import { TrendingInNews } from "@/components/home/trending-in-news"
import { MarketPulseSidebar } from "@/components/home/market-pulse-sidebar"
import { MoreStories } from "@/components/home/more-stories"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Trending | CryptoIntel",
  description: "Most discussed assets, sentiment shifts, and breaking developments",
}

export default function TrendingPage() {
  return (
    <div className="min-h-screen bg-background">
      <StatsBar />
      <Navigation />
      <PriceTicker />
      <SidebarNav />

      <main className="xl:ml-16 px-4 py-6">
        <div className="mx-auto max-w-[1600px] space-y-10">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground uppercase tracking-wide">Trending</h1>
              <p className="text-xs text-muted-foreground font-mono">Most mentioned · Sentiment shifts · Latest news</p>
            </div>
          </div>

          {/* Row 1: Trending Tickers with time period selector */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-widest border-l-2 border-primary pl-3">Trending Tickers</h2>
              <Link href="/markets" className="flex items-center gap-1 text-xs text-primary hover:underline">View Markets <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <TrendingTickersWrapper />
          </section>

          {/* Row 2: Breaking + Sentiment side by side */}
          <section>
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-foreground uppercase tracking-widest border-l-2 border-primary pl-3">Breaking News</h2>
                  <Link href="/news" className="flex items-center gap-1 text-xs text-primary hover:underline">All news <ArrowRight className="h-3 w-3" /></Link>
                </div>
                <BreakingNews />
              </div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-foreground uppercase tracking-widest border-l-2 border-primary pl-3">Sentiment Shifts</h2>
                  <Link href="/analysis" className="flex items-center gap-1 text-xs text-primary hover:underline">Full analysis <ArrowRight className="h-3 w-3" /></Link>
                </div>
                <SentimentShifts />
              </div>
            </div>
          </section>

          {/* Row 3: Most read + Trending in news sidebar */}
          <section>
            <div className="flex flex-col xl:flex-row gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-foreground uppercase tracking-widest border-l-2 border-primary pl-3">Latest Headlines</h2>
                </div>
                <MostRead />
              </div>
              <div className="xl:w-72 shrink-0 space-y-4">
                <TrendingInNews />
                <MarketPulseSidebar />
              </div>
            </div>
          </section>

          {/* Row 4: More stories */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-widest border-l-2 border-primary pl-3">More Stories</h2>
              <Link href="/news" className="flex items-center gap-1 text-xs text-primary hover:underline">All stories <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <MoreStories />
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
