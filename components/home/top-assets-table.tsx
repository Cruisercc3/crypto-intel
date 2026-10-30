"use client"

import { useCoins } from "@/hooks/use-coins"
import Link from "next/link"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useState } from "react"

const CATEGORIES = ["TOP 10", "TOP 20", "TOP 50"]

function fmt(n: number) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
}

export function TopAssetsTable() {
  const [activeCategory, setActiveCategory] = useState("TOP 10")
  const limit = activeCategory === "TOP 10" ? 10 : activeCategory === "TOP 20" ? 20 : 50
  const { coins, isLoading } = useCoins(50)

  const rows = coins.slice(0, limit)

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Category filter tabs */}
      <div className="flex items-center gap-1 p-3 border-b border-border">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 text-muted-foreground font-medium w-8">#</th>
              <th className="text-left py-2 px-3 text-muted-foreground font-medium">Name</th>
              <th className="text-right py-2 px-3 text-muted-foreground font-medium">Price</th>
              <th className="text-right py-2 px-3 text-muted-foreground font-medium">24h %</th>
              <th className="text-right py-2 px-3 text-muted-foreground font-medium hidden md:table-cell">7d %</th>
              <th className="text-right py-2 px-3 text-muted-foreground font-medium hidden lg:table-cell">Market Cap</th>
              <th className="text-right py-2 px-3 text-muted-foreground font-medium hidden lg:table-cell">24h Volume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading || rows.length === 0
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="py-3 px-3">
                        <div className="h-3 bg-secondary rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              : rows.map((coin, i) => {
                  const c24 = coin.price_change_percentage_24h ?? 0
                  const c7d = coin.price_change_percentage_7d_in_currency ?? 0
                  return (
                    <tr key={coin.id} className="table-row-hover">
                      <td className="py-2.5 px-3 text-muted-foreground font-mono">{i + 1}</td>
                      <td className="py-2.5 px-3">
                        <Link href={`/coin/${coin.id}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                          <div className="w-6 h-6 rounded-full bg-secondary shrink-0 overflow-hidden">
                            {coin.image && <img src={coin.image} alt={coin.name} className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">{coin.name}</span>
                            <span className="text-muted-foreground font-mono ml-1.5 text-[10px]">{coin.symbol?.toUpperCase()}</span>
                          </div>
                        </Link>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-foreground">
                        ${coin.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: coin.current_price > 1 ? 2 : 6 })}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        <span className={`inline-flex items-center gap-0.5 ${c24 >= 0 ? "text-bullish" : "text-bearish"}`}>
                          {c24 >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {Math.abs(c24).toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono hidden md:table-cell">
                        <span className={c7d >= 0 ? "text-bullish" : "text-bearish"}>
                          {c7d >= 0 ? "+" : ""}{c7d.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-muted-foreground hidden lg:table-cell">
                        {coin.market_cap ? fmt(coin.market_cap) : "—"}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-muted-foreground hidden lg:table-cell">
                        {coin.total_volume ? fmt(coin.total_volume) : "—"}
                      </td>
                    </tr>
                  )
                })}
          </tbody>
        </table>
      </div>
      <div className="px-3 py-2.5 border-t border-border">
        <Link href="/markets" className="text-xs text-primary hover:underline">View full market table →</Link>
      </div>
    </div>
  )
}
