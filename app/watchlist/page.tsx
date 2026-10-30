import { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { StatsBar } from "@/components/home/stats-bar"
import { Footer } from "@/components/footer"
import { WatchlistContent } from "@/components/watchlist/watchlist-content"

export const metadata: Metadata = {
  title: "Watchlist | CryptoIntel",
  description: "Track your favorite assets with price and news sentiment in one place",
}

export default function WatchlistPage() {
  return (
    <div className="min-h-screen bg-background">
      <StatsBar />
      <Navigation />
      <SidebarNav />

      <main className="xl:ml-16 px-4 py-6">
        <div className="mx-auto max-w-[1600px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Your Watchlist</h1>
              <p className="text-sm text-muted-foreground">Track favorite assets with price and sentiment</p>
            </div>
          </div>

          {/* Content */}
          <WatchlistContent />
        </div>
      </main>

      <Footer />
    </div>
  )
}
