import { Suspense } from "react"
import { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { StatsBar } from "@/components/home/stats-bar"
import { PriceTicker } from "@/components/home/price-ticker"
import { Footer } from "@/components/footer"
import { NewsFeed } from "@/components/news/news-feed"
import { NewsSidebar } from "@/components/news/news-sidebar"
import { Loader2 } from "lucide-react"
import { FEED_COUNT } from "@/lib/site"

export const metadata: Metadata = {
  title: "News Feed | CryptoIntel",
  description: "Crypto news from seven public feeds with headline sentiment and on-demand AI analysis",
}

function NewsFeedLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <span className="ml-2 text-sm text-muted-foreground">Loading news feed...</span>
    </div>
  )
}

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-background">
      <StatsBar />
      <Navigation />
      <PriceTicker />
      <SidebarNav />

      <main className="xl:ml-16 px-4 py-6">
        <div className="mx-auto max-w-[1600px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-bold text-foreground uppercase tracking-wide">News Feed</h1>
              <p className="text-xs text-muted-foreground font-mono">{FEED_COUNT} public feeds · keyword sentiment on every story · AI analysis on request</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-bullish rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground font-mono">LIVE</span>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-[1fr_300px] gap-6">
            <Suspense fallback={<NewsFeedLoading />}>
              <NewsFeed />
            </Suspense>
            <aside className="hidden lg:block space-y-4">
              <NewsSidebar />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
