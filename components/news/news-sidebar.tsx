"use client"

import { useNews } from "@/hooks/use-news"
import { TrendingUp, TrendingDown, Minus, Loader2, ExternalLink } from "lucide-react"
import { useMemo } from "react"
import Link from "next/link"

export function NewsSidebar() {
  const { articles, isLoading } = useNews({ limit: 200 })

  // Calculate live sentiment from real data
  const sentimentData = useMemo(() => {
    if (!articles.length) return null
    
    let positive = 0, negative = 0, neutral = 0
    articles.forEach(article => {
      if (article.sentiment === 'Positive') positive++
      else if (article.sentiment === 'Negative') negative++
      else neutral++
    })
    
    const total = articles.length
    return {
      positive: Math.round((positive / total) * 100),
      negative: Math.round((negative / total) * 100),
      neutral: Math.round((neutral / total) * 100),
      score: Math.round(((positive - negative) / total) * 100),
      total
    }
  }, [articles])

  // Get trending tickers from recent articles - show top 10
  const trendingTickers = useMemo(() => {
    const tickerCounts: Record<string, number> = {}
    articles.forEach(article => {
      article.tickers?.forEach(ticker => {
        tickerCounts[ticker] = (tickerCounts[ticker] || 0) + 1
      })
    })
    return Object.entries(tickerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([ticker, count]) => ({ ticker, count }))
  }, [articles])

  // Get top sources
  const topSources = useMemo(() => {
    const sourceCounts: Record<string, number> = {}
    articles.forEach(article => {
      sourceCounts[article.source_name] = (sourceCounts[article.source_name] || 0) + 1
    })
    return Object.entries(sourceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([source, count]) => ({ source, count }))
  }, [articles])

  if (isLoading) {
    return (
      <div className="space-y-4 sticky top-20">
        <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-center h-48">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sticky top-20">
      {/* Trending Tickers */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
          Trending in News
        </h3>
        <div className="space-y-2">
          {trendingTickers.map(({ ticker, count }, i) => (
            <div
              key={ticker}
              className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground font-mono w-3">{i + 1}</span>
                <span className="text-sm font-medium text-foreground">{ticker}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">
                {count === 1 ? "1 story" : `${count} stories`}
              </span>
            </div>
          ))}
          {trendingTickers.length === 0 && (
            <span className="text-xs text-muted-foreground">No tickers found</span>
          )}
        </div>
      </div>

      {/* Sentiment Overview */}
      {sentimentData && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
            Headline Sentiment
          </h3>
          
          {/* Sentiment Bar */}
          <div className="h-2 rounded-full overflow-hidden flex mb-3">
            <div className="bg-bullish transition-all" style={{ width: `${sentimentData.positive}%` }} />
            <div className="bg-muted-foreground transition-all" style={{ width: `${sentimentData.neutral}%` }} />
            <div className="bg-bearish transition-all" style={{ width: `${sentimentData.negative}%` }} />
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-bullish" />
              <span className="text-muted-foreground">Bullish</span>
              <span className="font-medium text-foreground">{sentimentData.positive}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-muted-foreground" />
              <span className="text-muted-foreground">Neutral</span>
              <span className="font-medium text-foreground">{sentimentData.neutral}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-bearish" />
              <span className="text-muted-foreground">Bearish</span>
              <span className="font-medium text-foreground">{sentimentData.negative}%</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-border text-[10px] text-muted-foreground">
            Keyword scores across {sentimentData.total} stories in the feed
          </div>
        </div>
      )}

      {/* Top Sources */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
          Top Sources
        </h3>
        <div className="space-y-2">
          {topSources.map(({ source, count }) => (
            <div key={source} className="flex items-center justify-between py-1 text-xs">
              <span className="text-foreground truncate">{source}</span>
              <span className="text-muted-foreground font-mono">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Enterprise CTA */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-1">Enterprise API</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Access real-time news feeds and sentiment data via our REST API.
        </p>
        <Link 
          href="/acquisition"
          className="block w-full h-8 bg-primary text-primary-foreground text-xs font-medium rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5"
        >
          Learn More
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}
