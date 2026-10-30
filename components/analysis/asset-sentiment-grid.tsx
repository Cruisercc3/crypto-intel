"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Minus, FileText, Sparkles, ChevronDown, ChevronUp, BarChart2, Loader2 } from "lucide-react"
import { useCoins } from "@/hooks/use-coins"
import { useNewsByTicker } from "@/hooks/use-news"
import { useAssetAnalysis } from "@/hooks/use-sentiment"
import { MiniCandlestickChart } from "@/components/charts/mini-candlestick-chart"
import { getTradingViewSymbol } from "@/lib/tradingview"

const TRACKED = [
  { symbol: "BTC", id: "bitcoin", name: "Bitcoin" },
  { symbol: "ETH", id: "ethereum", name: "Ethereum" },
  { symbol: "SOL", id: "solana", name: "Solana" },
  { symbol: "XRP", id: "ripple", name: "XRP" },
  { symbol: "LINK", id: "chainlink", name: "Chainlink" },
  { symbol: "DOGE", id: "dogecoin", name: "Dogecoin" },
]

type Mood = "bullish" | "bearish" | "neutral"

function deriveSentiment(pct: number): Mood {
  if (pct >= 55) return "bullish"
  if (pct <= 45) return "bearish"
  return "neutral"
}

const sentimentConfig = {
  bullish: { icon: TrendingUp,   color: "text-bullish",           bg: "bg-bullish/15"   },
  bearish: { icon: TrendingDown, color: "text-bearish",           bg: "bg-bearish/15"   },
  neutral: { icon: Minus,        color: "text-muted-foreground",  bg: "bg-muted"        },
}

function AssetCard({ tracked, coin }: {
  tracked: typeof TRACKED[0]
  coin?: { current_price: number; image: string; name: string; price_change_percentage_24h: number }
}) {
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [showChart, setShowChart] = useState(false)
  const { articles, total, isLoading: newsLoading } = useNewsByTicker(tracked.symbol, 15)
  const ai = useAssetAnalysis()

  // Keyword score: 50 means as many positive headlines as negative
  const positive = articles.filter(a => a.sentiment === "Positive").length
  const negative = articles.filter(a => a.sentiment === "Negative").length
  const pct = articles.length > 0 ? Math.round(((positive - negative) / articles.length) * 50 + 50) : 50
  const sentiment = deriveSentiment(pct)
  const { icon: Icon, color, bg } = sentimentConfig[sentiment]

  const runAnalysis = () => {
    const next = !showAnalysis
    setShowAnalysis(next)
    if (next && !ai.analysis && !ai.isAnalyzing && articles.length > 0) {
      ai.analyze(tracked.name, articles.map(a => a.title))
    }
  }

  const aiMood = ai.analysis?.overallSentiment ?? "neutral"
  const AiIcon = sentimentConfig[aiMood].icon

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:border-primary/40 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
            {coin?.image ? (
              <img src={coin.image} alt={tracked.symbol} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px] font-mono font-bold text-foreground">{tracked.symbol.slice(0, 2)}</span>
            )}
          </div>
          <div>
            <span className="text-sm font-medium text-foreground">{tracked.symbol}</span>
            <span className={`ml-2 inline-flex items-center gap-1 text-xs ${color}`} title="Keyword score, 0 to 100">
              <Icon className="h-3 w-3" />
              {newsLoading ? "—" : articles.length === 0 ? "no stories" : pct}
            </span>
          </div>
        </div>
        <span className="text-sm font-mono text-foreground">
          {coin ? `$${coin.current_price?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: coin.current_price > 1 ? 2 : 6,
          })}` : "—"}
        </span>
      </div>

      {/* Sentiment Score Bar */}
      <div className="mb-3">
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-700 ${sentiment === "bullish" ? "bg-bullish" : sentiment === "bearish" ? "bg-bearish" : "bg-muted-foreground"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Article count */}
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-3">
        <FileText className="h-3 w-3" />
        <span>
          {newsLoading ? "…" : `${total} ${total === 1 ? "story" : "stories"} in the feed`}
          {!newsLoading && articles.length < total ? `, scoring the newest ${articles.length}` : ""}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          className={`flex-1 flex items-center justify-between p-2 rounded ${bg} ${color} text-xs font-medium hover:opacity-80 transition-opacity disabled:opacity-50`}
          onClick={runAnalysis}
          disabled={!newsLoading && articles.length === 0}
          aria-expanded={showAnalysis}
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" />
            AI Analysis
          </span>
          {ai.isAnalyzing ? <Loader2 className="h-3 w-3 animate-spin" /> : showAnalysis ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
        <button
          className={`p-2 rounded bg-secondary text-muted-foreground hover:text-foreground text-xs font-medium transition-colors ${showChart ? "ring-1 ring-primary" : ""}`}
          onClick={() => setShowChart(!showChart)}
          aria-label="Toggle chart"
          aria-pressed={showChart}
        >
          <BarChart2 className="h-3 w-3" />
        </button>
      </div>

      {showChart && (
        <div className="mt-3 rounded border border-border overflow-hidden">
          <MiniCandlestickChart symbol={getTradingViewSymbol(tracked.symbol)} height={100} />
        </div>
      )}

      {showAnalysis && (
        <div className="mt-3 p-3 bg-secondary/50 rounded border border-border text-xs">
          {ai.isAnalyzing ? (
            <p className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" /> Reading {articles.length} headlines...
            </p>
          ) : ai.error ? (
            <div className="space-y-2" role="alert">
              <p className="text-bearish">AI analysis failed: {ai.error}</p>
              <button onClick={() => ai.analyze(tracked.name, articles.map(a => a.title))} className="text-primary hover:underline">
                Try again
              </button>
            </div>
          ) : ai.analysis ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 font-medium ${sentimentConfig[aiMood].color}`}>
                  <AiIcon className="h-3 w-3" />
                  AI: {aiMood.toUpperCase()} ({ai.analysis.overallScore > 0 ? "+" : ""}{ai.analysis.overallScore})
                </span>
                <span className="text-muted-foreground">{ai.analysis.analyzed} headlines</span>
              </div>
              {ai.analysis.marketMood && <p className="text-muted-foreground">{ai.analysis.marketMood}</p>}
              {ai.analysis.topThemes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ai.analysis.topThemes.map(t => (
                    <span key={t} className="px-1.5 py-0.5 bg-secondary rounded text-foreground">{t}</span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">No {tracked.symbol} stories in the feed to analyze.</p>
          )}
        </div>
      )}
    </div>
  )
}

export function AssetSentimentGrid() {
  const { coins } = useCoins(50)

  const coinMap = Object.fromEntries(coins.map(c => [c.id, c]))

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-xs font-semibold text-foreground mb-1 uppercase tracking-wide">Per-Asset Sentiment</h3>
      <p className="text-[10px] text-muted-foreground mb-4">
        Keyword score from each asset&apos;s headlines. AI Analysis sends those headlines to the model and shows what it reads.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TRACKED.map(tracked => (
          <AssetCard key={tracked.symbol} tracked={tracked} coin={coinMap[tracked.id]} />
        ))}
      </div>
    </div>
  )
}
