"use client"

import { useCoins } from "@/hooks/use-coins"
import Link from "next/link"
import { TrendingUp, TrendingDown } from "lucide-react"

export function MarketPulseSidebar() {
  const { coins, isLoading } = useCoins(30)

  const sorted = [...coins].sort((a, b) => (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0))
  const gainers = sorted.slice(0, 5)
  const losers = sorted.slice(-5).reverse()

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-6 bg-secondary rounded animate-pulse" />
        ))}
      </div>
    )
  }

  const CoinRow = ({ coin }: { coin: typeof coins[0] }) => {
    const chg = coin.price_change_percentage_24h ?? 0
    return (
      <Link href={`/coin/${coin.id}`} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-secondary transition-colors group">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-secondary shrink-0 overflow-hidden">
            {coin.image && <img src={coin.image} alt={coin.name} className="w-full h-full object-cover" />}
          </div>
          <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">{coin.name}</span>
          <span className="text-[10px] text-muted-foreground font-mono">{coin.symbol?.toUpperCase()}</span>
        </div>
        <span className={`text-xs font-mono font-semibold flex items-center gap-0.5 ${chg >= 0 ? "text-bullish" : "text-bearish"}`}>
          {chg >= 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
          {Math.abs(chg).toFixed(2)}%
        </span>
      </Link>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Market Pulse</span>
        <h3 className="text-sm font-bold text-foreground">Top Movers</h3>
      </div>

      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center gap-1.5 mb-1">
          <TrendingUp className="h-3 w-3 text-bullish" />
          <span className="text-[10px] text-bullish uppercase tracking-wider font-semibold">Biggest Gainers (24H)</span>
        </div>
        {gainers.map(c => <CoinRow key={c.id} coin={c} />)}
      </div>

      <div className="mx-4 border-t border-border" />

      <div className="px-4 py-1 pb-3">
        <div className="flex items-center gap-1.5 mt-2 mb-1">
          <TrendingDown className="h-3 w-3 text-bearish" />
          <span className="text-[10px] text-bearish uppercase tracking-wider font-semibold">Biggest Losers (24H)</span>
        </div>
        {losers.map(c => <CoinRow key={c.id} coin={c} />)}
      </div>

      <div className="px-4 py-2 border-t border-border">
        <Link href="/markets" className="text-xs text-primary hover:underline">View full market table →</Link>
      </div>
    </div>
  )
}
