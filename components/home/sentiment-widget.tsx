"use client"

import { useNews } from "@/hooks/use-news"
import { useBatchSentiment } from "@/hooks/use-sentiment"
import { TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react"
import { useMemo } from "react"

// The AI reads the 10 newest headlines. Every headline also has a keyword
// score, which is what this shows if the AI call fails.
export function SentimentWidget() {
  const { articles } = useNews()

  const keyword = useMemo(() => {
    if (!articles.length) return null
    let positive = 0, negative = 0, neutral = 0
    articles.forEach(article => {
      if (article.sentiment === 'Positive') positive++
      else if (article.sentiment === 'Negative') negative++
      else neutral++
    })
    const total = articles.length
    const score = Math.round(((positive - negative) / total) * 100)
    return {
      score: Math.round((score + 100) / 2),
      positive: (positive / total) * 100,
      negative: (negative / total) * 100,
      neutral: (neutral / total) * 100,
      total,
      sentiment: score > 10 ? 'bullish' : score < -10 ? 'bearish' : 'neutral',
    }
  }, [articles])

  const headlines = useMemo(
    () => articles.slice(0, 10).map(a => ({ title: a.title })),
    [articles]
  )
  const { sentiment: ai, isLoading: aiLoading, isError: aiError } = useBatchSentiment(headlines)

  const usingAI = Boolean(ai)
  const sentimentScore = ai ? Math.round((ai.overallScore + 100) / 2) : keyword?.score ?? 50
  const breakdown = ai
    ? { positive: ai.bullishPercent, neutral: ai.neutralPercent, negative: ai.bearishPercent }
    : { positive: keyword?.positive ?? 0, neutral: keyword?.neutral ?? 0, negative: keyword?.negative ?? 0 }
  const overallSentiment = ai?.overallSentiment || keyword?.sentiment || 'neutral'

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Sentiment Score</h3>
        <div className="flex items-center gap-2">
          {aiLoading && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
          <span className="text-xs text-muted-foreground">LIVE</span>
          <span
            className={`text-xs font-medium px-1.5 py-0.5 rounded ${usingAI ? "text-primary bg-primary/10" : "text-muted-foreground bg-secondary"}`}
            title={usingAI ? "Scored by the AI model from the 10 newest headlines" : "Scored by keywords in each headline"}
          >
            {usingAI ? "AI" : "Keywords"}
          </span>
        </div>
      </div>

      {/* Main Score */}
      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-5xl font-bold text-foreground font-mono">{keyword || ai ? sentimentScore : "--"}</span>
        <div className={`flex items-center gap-1 ${
          overallSentiment === 'bullish' ? 'text-bullish' :
          overallSentiment === 'bearish' ? 'text-bearish' : 'text-muted-foreground'
        }`}>
          {overallSentiment === 'bullish' ? <TrendingUp className="h-4 w-4" /> :
           overallSentiment === 'bearish' ? <TrendingDown className="h-4 w-4" /> :
           <Minus className="h-4 w-4" />}
          <span className="text-sm font-medium uppercase">{overallSentiment}</span>
        </div>
      </div>

      {/* Market mood */}
      {ai?.marketMood && (
        <div className="text-xs text-muted-foreground mb-3">
          {ai.marketMood}
        </div>
      )}

      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              overallSentiment === 'bullish' ? 'bg-bullish' :
              overallSentiment === 'bearish' ? 'bg-bearish' : 'bg-muted-foreground'
            }`}
            style={{ width: `${sentimentScore}%` }}
          />
        </div>
      </div>

      {/* Scale */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-4 font-mono">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>

      {/* Breakdown */}
      <div className="flex items-center gap-4 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <TrendingDown className="h-3 w-3 text-bearish" />
          <span className="text-xs text-muted-foreground">NEG</span>
          <span className="text-xs font-medium text-bearish">{breakdown.negative.toFixed(0)}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Minus className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">NEU</span>
          <span className="text-xs font-medium text-foreground">{breakdown.neutral.toFixed(0)}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-3 w-3 text-bullish" />
          <span className="text-xs text-muted-foreground">POS</span>
          <span className="text-xs font-medium text-bullish">{breakdown.positive.toFixed(0)}%</span>
        </div>
      </div>

      {/* What was scored */}
      <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
        {usingAI
          ? `AI read the ${ai!.analyzed} newest headlines`
          : aiError
            ? `AI unavailable, showing keyword scores for ${keyword?.total ?? 0} stories`
            : `Keyword scores for ${keyword?.total ?? 0} stories`}
      </div>

      {/* Top themes */}
      {ai?.topThemes && ai.topThemes.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Top Themes</span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {ai.topThemes.slice(0, 4).map((theme, i) => (
              <span key={i} className="px-2 py-0.5 bg-secondary rounded text-xs text-foreground">
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
