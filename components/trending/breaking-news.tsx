"use client"

import Link from "next/link"
import { Zap, ExternalLink, TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react"
import { useNews } from "@/hooks/use-news"

const sentimentConfig = {
  Positive: { icon: TrendingUp, color: "bg-bullish/15 text-bullish" },
  Negative: { icon: TrendingDown, color: "bg-bearish/15 text-bearish" },
  Neutral:  { icon: Minus, color: "bg-muted text-muted-foreground" },
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function BreakingNews() {
  const { articles, isLoading } = useNews()

  if (isLoading && articles.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-4 h-full">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">Breaking News</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">Breaking News</h3>
      </div>

      <div className="space-y-3">
        {articles.slice(0, 5).map((article, idx) => {
          const sentiment = article.sentiment || "Neutral"
          const config = sentimentConfig[sentiment as keyof typeof sentimentConfig] ?? sentimentConfig.Neutral
          const SentimentIcon = config.icon

          return (
            <div
              key={idx}
              className="group p-3 bg-secondary/30 rounded-lg border border-border hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <a
                  href={article.news_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-0"
                >
                  <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h4>
                </a>
                <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">{article.source_name}</span>
                  <span className="text-[10px] text-muted-foreground">·</span>
                  <span className="text-[10px] text-muted-foreground">{timeAgo(article.date)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {article.tickers && article.tickers[0] && (
                    <Link
                      href={`/news?tickers=${article.tickers[0].toUpperCase()}`}
                      className="px-1.5 py-0.5 bg-secondary text-muted-foreground hover:text-foreground text-[9px] font-mono rounded transition-colors"
                    >
                      {article.tickers[0].toUpperCase()}
                    </Link>
                  )}
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded ${config.color}`}>
                    <SentimentIcon className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
