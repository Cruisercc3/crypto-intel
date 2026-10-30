import { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { StatsBar } from "@/components/home/stats-bar"
import { PriceTicker } from "@/components/home/price-ticker"
import { Footer } from "@/components/footer"
import { MarketTable } from "@/components/markets/market-table"
import { MarketPulseSidebar } from "@/components/home/market-pulse-sidebar"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { MAX_COINS } from "@/lib/site"

export const metadata: Metadata = {
  title: "Markets | CryptoIntel",
  description: "Prices for the top 500 coins from CoinGecko, with links to each coin's news",
}

export default function MarketsPage() {
  return (
    <div className="min-h-screen bg-background">
      <StatsBar />
      <Navigation />
      <PriceTicker />
      <SidebarNav />

      <main className="xl:ml-16 px-4 py-6">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-bold text-foreground uppercase tracking-wide">Markets</h1>
              <p className="text-xs text-muted-foreground font-mono">Top {MAX_COINS} coins by market cap via CoinGecko · refreshed every few minutes · star a coin to add it to your watchlist</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-bullish rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground font-mono">LIVE</span>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-6">
            {/* Main table */}
            <div className="flex-1 min-w-0 space-y-6">
              {/* Quick links to news by coin */}
              <div className="flex flex-wrap gap-2">
                {["BTC","ETH","SOL","XRP","BNB","ADA","DOGE","AVAX","LINK","DOT"].map(t => (
                  <Link key={t} href={`/news?tickers=${t}`}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-secondary border border-border rounded hover:border-primary/50 hover:text-primary transition-colors">
                    {t} news <ArrowRight className="h-2.5 w-2.5" />
                  </Link>
                ))}
              </div>
              <MarketTable />
            </div>
            {/* Sidebar */}
            <div className="xl:w-72 shrink-0">
              <MarketPulseSidebar />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
