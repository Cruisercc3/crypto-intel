"use client"

import Link from "next/link"
import { Loader2 } from "lucide-react"
import { useCoins } from "@/hooks/use-coins"
import { Sparkline } from "@/components/charts/sparkline-chart"

const TICKER_IDS = [
  "bitcoin","ethereum","solana","binancecoin","ripple",
  "cardano","avalanche-2","polkadot","chainlink","dogecoin",
  "near","cosmos","uniswap","aave","tron","the-open-network",
]

export function PriceTicker() {
  const { coins, isLoading } = useCoins(50, { sparkline: true })

  const tickers = coins.filter(c => TICKER_IDS.includes(c.id))
  const extended = [...tickers, ...tickers]

  if (isLoading && tickers.length === 0) {
    return (
      <div className="bg-card border-b border-border h-[52px] flex items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin text-primary mr-2" />
        <span className="text-xs text-muted-foreground">Loading live prices...</span>
      </div>
    )
  }

  if (tickers.length === 0) return null

  return (
    <div className="bg-card border-b border-border overflow-hidden">
      <div className="flex animate-ticker">
        {extended.map((coin, i) => {
          const change = coin.price_change_percentage_24h ?? 0
          return (
            <Link
              key={`${coin.id}-${i}`}
              href={`/coin/${coin.id}`}
              className="flex items-center gap-3 px-5 py-2.5 border-r border-border shrink-0 hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                  {coin.image ? (
                    <img src={coin.image} alt={coin.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] font-mono font-semibold text-foreground">
                      {coin.symbol.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-sm text-foreground">{coin.symbol.toUpperCase()}</span>
                  <span className="text-[10px] text-muted-foreground">{coin.name}</span>
                </div>
              </div>

              {/* Last 24 hours of CoinGecko's 7-day sparkline */}
              <Sparkline data={coin.sparkline_in_7d?.price?.slice(-13)} positive={change >= 0} />

              <div className="flex flex-col items-end">
                <span className="font-mono text-sm text-foreground">
                  ${coin.current_price?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: coin.current_price > 1 ? 2 : 6,
                  })}
                </span>
                <span className={`font-mono text-xs ${change >= 0 ? "text-bullish" : "text-bearish"}`}>
                  {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
