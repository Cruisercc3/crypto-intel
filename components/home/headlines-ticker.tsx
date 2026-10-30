"use client"

import { useNews } from "@/hooks/use-news"
import { Zap } from "lucide-react"

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${Math.floor(diffHours / 24)}d ago`
}

export function HeadlinesTicker() {
  const { articles } = useNews()
  const headlines = articles.slice(0, 10)
  const doubledHeadlines = [...headlines, ...headlines]

  if (!headlines.length) {
    return null
  }

  return (
    <div className="bg-secondary/50 border-b border-border overflow-hidden">
      <div className="flex items-center">
        <div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground">
          <Zap className="h-3.5 w-3.5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Headlines</span>
        </div>
        
        <div className="overflow-hidden flex-1">
          <div className="flex animate-marquee">
            {doubledHeadlines.map((article, i) => (
              <a
                key={`${article.news_url}-${i}`}
                href={article.news_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-2 shrink-0 hover:text-primary transition-colors"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${
                  article.sentiment === 'Positive' ? 'bg-bullish' : 
                  article.sentiment === 'Negative' ? 'bg-bearish' : 'bg-muted-foreground'
                }`} />
                <span className="text-sm text-foreground whitespace-nowrap">
                  {article.title}
                </span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatTimeAgo(article.date)}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
