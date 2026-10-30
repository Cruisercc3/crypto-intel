"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { TrendingUp, TrendingDown, Minus, MessageSquare, Loader2, BarChart2 } from "lucide-react"
import { useCoins } from "@/hooks/use-coins"
import { useNews } from "@/hooks/use-news"
import { MiniCandlestickChart } from "@/components/charts/mini-candlestick-chart"
import { Sparkline } from "@/components/charts/sparkline-chart"
import { getTradingViewSymbol } from "@/lib/tradingview"

type Sentiment = "bullish" | "bearish" | "neutral"
type TimePeriod = "24h" | "7d" | "30d"

function deriveSentiment(change: number): Sentiment {
  if (change > 1) return "bullish"
  if (change < -1) return "bearish"
  return "neutral"
}

function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  const config = {
    bullish: { icon: TrendingUp, color: "bg-bullish/15 text-bullish" },
    bearish: { icon: TrendingDown, color: "bg-bearish/15 text-bearish" },
    neutral: { icon: Minus, color: "bg-muted text-muted-foreground" },
  }
  const { icon: Icon, color } = config[sentiment]
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded ${color}`}>
      <Icon className="h-3 w-3" />
      <span className="capitalize">{sentiment}</span>
    </span>
  )
}

interface TickerCardProps {
  coin: {
    id: string
    symbol: string
    name: string
    image: string
    current_price: number
    price_change_percentage_24h: number
    price_change_percentage_7d_in_currency?: number
    price_change_percentage_30d_in_currency?: number
    sparkline_in_7d?: { price: number[] }
  }
  mentions: number
  period: TimePeriod
}

function TickerCard({ coin, mentions, period }: TickerCardProps) {
  const [showChart, setShowChart] = useState(false)
  
  // Select change based on period
  const change = period === "7d" 
    ? (coin.price_change_percentage_7d_in_currency ?? coin.price_change_percentage_24h ?? 0)
    : period === "30d"
    ? (coin.price_change_percentage_30d_in_currency ?? coin.price_change_percentage_24h ?? 0)
    : (coin.price_change_percentage_24h ?? 0)
  
  const sentiment = deriveSentiment(change)
  
  // Real prices from CoinGecko's 7-day sparkline (one point every 2 hours)
  const spark = coin.sparkline_in_7d?.price
  const sparkData = period === "24h" ? spark?.slice(-13) : spark
  const sparkLabel = period === "24h" ? "Price, last 24h" : period === "7d" ? "Price, last 7d" : "Line shows the last 7d"

  return (
    <div className="flex-shrink-0 w-52 lg:w-auto p-4 bg-secondary/30 border border-border rounded-lg hover:border-primary/40 transition-colors">
      <Link href={`/news?tickers=${coin.symbol.toUpperCase()}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0">
              {coin.image ? (
                <img src={coin.image} alt={coin.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] font-mono font-bold text-foreground">{coin.symbol.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <span className="text-sm font-medium text-foreground">{coin.symbol.toUpperCase()}</span>
          </div>
          <SentimentBadge sentiment={sentiment} />
        </div>

        <div className="mb-3">
          <p className="text-lg font-bold text-foreground font-mono">
            ${coin.current_price?.toLocaleString(undefined, { maximumFractionDigits: coin.current_price > 1 ? 2 : 6 })}
          </p>
          <p className={`text-xs font-mono ${change >= 0 ? "text-bullish" : "text-bearish"}`}>
            {change >= 0 ? "+" : ""}{change.toFixed(2)}%
          </p>
        </div>
      </Link>

      {/* Chart section - more detailed sparkline */}
      {showChart ? (
        <div className="mb-3 rounded overflow-hidden border border-border/50">
          <MiniCandlestickChart symbol={getTradingViewSymbol(coin.symbol)} height={80} />
        </div>
      ) : (
        <div className="mb-3">
          <Sparkline data={sparkData} positive={(sparkData && sparkData.length > 1 ? sparkData[sparkData.length - 1] - sparkData[0] : change) >= 0} width={200} height={40} className="w-full" />
          <p className="text-[10px] text-muted-foreground mt-1">{sparkLabel}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MessageSquare className="h-3 w-3" />
          <span>{mentions === 1 ? "1 mention" : `${mentions} mentions`}</span>
        </div>
        <button
          onClick={(e) => { e.preventDefault(); setShowChart(!showChart) }}
          className={`p-1 rounded text-muted-foreground hover:text-foreground transition-colors ${showChart ? "bg-primary/20 text-primary" : ""}`}
          title="Toggle TradingView chart"
        >
          <BarChart2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

interface TrendingTickersProps {
  period?: TimePeriod
}

export function TrendingTickers({ period = "24h" }: TrendingTickersProps) {
  const { coins, isLoading } = useCoins(20, { sparkline: true })
  const { articles } = useNews({ limit: 200 })

  // Count article mentions per ticker symbol
  const mentionCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const article of articles) {
      for (const ticker of article.tickers || []) {
        counts[ticker.toUpperCase()] = (counts[ticker.toUpperCase()] || 0) + 1
      }
    }
    return counts
  }, [articles])

  // Pick top 8 coins by the appropriate metric for the period
  const topTickers = useMemo(() => {
    return [...coins]
      .sort((a, b) => {
        if (period === "7d") {
          return Math.abs(b.price_change_percentage_7d_in_currency || 0) - Math.abs(a.price_change_percentage_7d_in_currency || 0)
        }
        if (period === "30d") {
          return Math.abs(b.price_change_percentage_30d_in_currency || 0) - Math.abs(a.price_change_percentage_30d_in_currency || 0)
        }
        return b.total_volume - a.total_volume
      })
      .slice(0, 8)
  }, [coins, period])

  if (isLoading && coins.length === 0) {
    return (
      <section className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      </section>
    )
  }

  return (
    <section className="bg-card border border-border rounded-lg p-4">
      <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Trending Tickers</h2>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible">
        {topTickers.map((coin) => (
          <TickerCard
            key={coin.id}
            coin={coin}
            mentions={mentionCounts[coin.symbol.toUpperCase()] ?? 0}
            period={period}
          />
        ))}
      </div>
    </section>
  )
}
