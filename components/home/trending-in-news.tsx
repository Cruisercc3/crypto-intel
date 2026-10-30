"use client"

import { useNews } from "@/hooks/use-news"
import { TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

const NAMES: Record<string, string> = {
  BTC: "Bitcoin", ETH: "Ethereum", SOL: "Solana", XRP: "XRP", DOGE: "Dogecoin", AVAX: "Avalanche",
  LINK: "Chainlink", BNB: "BNB", ADA: "Cardano", DOT: "Polkadot", TRX: "Tron", TON: "Toncoin",
  SUI: "Sui", HYPE: "Hyperliquid", LTC: "Litecoin", AAVE: "Aave", UNI: "Uniswap", ARB: "Arbitrum",
  OP: "Optimism", SHIB: "Shiba Inu", PEPE: "Pepe", NEAR: "NEAR", ATOM: "Cosmos", POL: "Polygon",
}

export function TrendingInNews() {
  const { articles } = useNews({ limit: 200 })

  // Counts every story in the feed that the news route tagged with each ticker
  const counts: Record<string, { mentions: number; positive: number; negative: number }> = {}
  for (const a of articles) {
    for (const symbol of a.tickers || []) {
      counts[symbol] ??= { mentions: 0, positive: 0, negative: 0 }
      counts[symbol].mentions++
      if (a.sentiment === "Positive") counts[symbol].positive++
      if (a.sentiment === "Negative") counts[symbol].negative++
    }
  }
  const tickers = Object.entries(counts)
    .map(([symbol, c]) => ({
      symbol,
      name: NAMES[symbol] || "",
      mentions: c.mentions,
      sentiment: c.positive > c.negative ? "bullish" : c.negative > c.positive ? "bearish" : "neutral",
    }))
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, 8)

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-xs font-bold text-foreground uppercase tracking-widest mb-3">Trending in News</h3>
      <div className="space-y-1">
        {tickers.length === 0 ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-7 bg-secondary rounded animate-pulse" />
          ))
        ) : (
          tickers.map((t, i) => (
            <Link
              key={t.symbol}
              href={`/news?tickers=${t.symbol}`}
              className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-secondary transition-colors group"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground font-mono w-4 shrink-0">{i + 1}</span>
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{t.symbol}</span>
                <span className="text-[10px] text-muted-foreground hidden sm:inline">{t.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground font-mono">{t.mentions === 1 ? "1 story" : `${t.mentions} stories`}</span>
                {t.sentiment === "bullish" ? (
                  <TrendingUp className="h-3 w-3 text-bullish" />
                ) : t.sentiment === "bearish" ? (
                  <TrendingDown className="h-3 w-3 text-bearish" />
                ) : (
                  <span className="h-3 w-3 inline-flex items-center justify-center text-[8px] text-muted-foreground">—</span>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
