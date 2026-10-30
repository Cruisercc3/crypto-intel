"use client"

import { useMemo } from "react"
import Link from "next/link"
import { ArrowRight, TrendingUp, Minus, TrendingDown, Loader2 } from "lucide-react"
import { useNews } from "@/hooks/use-news"

type Mood = "bullish" | "bearish" | "neutral"

const sentimentConfig = {
  bullish: { icon: TrendingUp, color: "text-bullish" },
  bearish: { icon: TrendingDown, color: "text-bearish" },
  neutral: { icon: Minus, color: "text-muted-foreground" },
}

const WINDOW_HOURS = 24
const MIN_ARTICLES = 2

// Share of positive headlines in a set of articles, as a 0-100 score where 50
// means as many positive as negative.
function score(articles: { sentiment: string }[]) {
  const pos = articles.filter(a => a.sentiment === "Positive").length
  const neg = articles.filter(a => a.sentiment === "Negative").length
  return Math.round(((pos - neg) / articles.length) * 50 + 50)
}

function mood(s: number): Mood {
  return s >= 55 ? "bullish" : s <= 45 ? "bearish" : "neutral"
}

// Compares each asset's keyword sentiment in the last 24 hours with the stories
// before that, using every article currently in the feed.
export function SentimentShifts() {
  const { articles, isLoading } = useNews({ limit: 200 })

  const shifts = useMemo(() => {
    const cutoff = Date.now() - WINDOW_HOURS * 3_600_000
    const byTicker: Record<string, { recent: typeof articles; earlier: typeof articles }> = {}
    for (const a of articles) {
      const t = new Date(a.date).getTime()
      for (const ticker of a.tickers || []) {
        byTicker[ticker] ??= { recent: [], earlier: [] }
        ;(t >= cutoff ? byTicker[ticker].recent : byTicker[ticker].earlier).push(a)
      }
    }
    return Object.entries(byTicker)
      .filter(([, v]) => v.recent.length >= MIN_ARTICLES && v.earlier.length >= MIN_ARTICLES)
      .map(([symbol, v]) => {
        const from = score(v.earlier)
        const to = score(v.recent)
        return { symbol, from, to, delta: to - from, recentCount: v.recent.length, earlierCount: v.earlier.length }
      })
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
      .slice(0, 5)
  }, [articles])

  return (
    <div className="bg-card border border-border rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-1 gap-2">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">Sentiment Shifts</h3>
        <span className="text-[10px] text-muted-foreground">Before vs last {WINDOW_HOURS}h</span>
      </div>
      <p className="text-[10px] text-muted-foreground mb-4">
        Keyword score per asset, 0 to 100, from the stories in the feed right now.
      </p>

      {isLoading && articles.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : shifts.length === 0 ? (
        <p className="text-xs text-muted-foreground py-6 text-center">
          No asset has at least {MIN_ARTICLES} stories on both sides of the last {WINDOW_HOURS} hours yet.
        </p>
      ) : (
        <div className="space-y-3">
          {shifts.map((shift) => {
            const fromMood = mood(shift.from)
            const toMood = mood(shift.to)
            const FromIcon = sentimentConfig[fromMood].icon
            const ToIcon = sentimentConfig[toMood].icon
            return (
              <Link
                key={shift.symbol}
                href={`/news?tickers=${shift.symbol}`}
                className="flex items-center justify-between gap-2 p-3 bg-secondary/30 rounded-lg border border-border hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-mono font-bold text-foreground">{shift.symbol.slice(0, 2)}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{shift.symbol}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <FromIcon className={`h-3 w-3 ${sentimentConfig[fromMood].color}`} />
                    <span className={`text-xs font-mono ${sentimentConfig[fromMood].color}`}>{shift.from}</span>
                  </div>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <div className="flex items-center gap-1">
                    <ToIcon className={`h-3 w-3 ${sentimentConfig[toMood].color}`} />
                    <span className={`text-xs font-mono ${sentimentConfig[toMood].color}`}>{shift.to}</span>
                  </div>
                </div>

                <span className="text-[10px] text-muted-foreground shrink-0">
                  {shift.earlierCount} → {shift.recentCount} stories
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
