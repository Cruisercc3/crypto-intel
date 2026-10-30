"use client"

import { TrendingUp, TrendingDown, FileText, Minus } from "lucide-react"
import { useNews } from "@/hooks/use-news"

export function OverallSentiment() {
  const { articles, isLoading } = useNews({ limit: 200 })

  const total = articles.length
  const bullish = articles.filter(a => a.sentiment === "Positive").length
  const bearish = articles.filter(a => a.sentiment === "Negative").length
  const neutral  = total - bullish - bearish

  const bullishPct = total > 0 ? Math.round((bullish / total) * 100) : 0
  const bearishPct = total > 0 ? Math.round((bearish / total) * 100) : 0
  const neutralPct = total > 0 ? 100 - bullishPct - bearishPct : 0

  // 50 means as many positive headlines as negative
  const score = total > 0 ? Math.round(((bullish - bearish) / total) * 50 + 50) : 50
  const sentiment = score >= 55 ? "BULLISH" : score <= 45 ? "BEARISH" : "NEUTRAL"
  const SentimentIcon = sentiment === "BULLISH" ? TrendingUp : sentiment === "BEARISH" ? TrendingDown : Minus
  const sentimentColor = sentiment === "BULLISH" ? "text-bullish" : sentiment === "BEARISH" ? "text-bearish" : "text-muted-foreground"

  return (
    <div className="bg-card border border-border rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">Overall Sentiment</h3>
        <span className="text-[10px] text-muted-foreground">Headline keywords · {total} stories</span>
      </div>

      {/* Main Score */}
      {isLoading && total === 0 ? (
        <div className="h-24 flex items-center">
          <div className="h-1 w-24 bg-secondary rounded animate-pulse" />
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl font-bold text-foreground font-mono">{score}</span>
            <div className={`flex items-center gap-1 ${sentimentColor}`}>
              <SentimentIcon className="h-4 w-4" />
              <span className="text-sm font-medium uppercase">{sentiment}</span>
            </div>
          </div>

          {/* Articles count */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <FileText className="h-3 w-3" />
            <span>{total} stories in the feed, scored by headline keywords</span>
          </div>

          {/* Sentiment Bar */}
          <div className="h-2 rounded-full overflow-hidden flex mb-3">
            <div className="bg-bullish transition-all duration-700" style={{ width: `${bullishPct}%` }} />
            <div className="bg-muted-foreground transition-all duration-700" style={{ width: `${neutralPct}%` }} />
            <div className="bg-bearish transition-all duration-700" style={{ width: `${bearishPct}%` }} />
          </div>

          {/* Legend */}
          <div className="space-y-2">
            {[
              { label: "Bullish",  pct: bullishPct,  dot: "bg-bullish" },
              { label: "Neutral",  pct: neutralPct,  dot: "bg-muted-foreground" },
              { label: "Bearish",  pct: bearishPct,  dot: "bg-bearish" },
            ].map(({ label, pct, dot }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className={`h-2 w-2 rounded-full ${dot}`} />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
                <span className="text-xs font-medium text-foreground">{pct}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
