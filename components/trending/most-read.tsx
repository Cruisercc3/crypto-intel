"use client"

import Link from "next/link"
import { Newspaper, Loader2 } from "lucide-react"
import { useNews } from "@/hooks/use-news"

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

// The site doesn't track reads, so this lists the next newest stories after
// Breaking News instead of ranking by views.
export function MostRead() {
  const { articles, isLoading } = useNews()
  const items = articles.slice(5, 13)

  if (isLoading && articles.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg">
        <div className="flex items-center gap-2 p-4 border-b border-border">
          <Newspaper className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">Latest Headlines</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <Newspaper className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">Latest Headlines</h3>
      </div>

      <div className="divide-y divide-border">
        {items.map((article, index) => (
          <div
            key={`${article.news_url}-${index}`}
            className="group flex items-start gap-3 p-3 hover:bg-secondary/30 transition-colors"
          >
            <span className="text-lg font-bold text-muted-foreground/40 w-6 text-center shrink-0 font-mono">
              {index + 1}
            </span>

            <div className="flex-1 min-w-0">
              <a
                href={article.news_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1 leading-snug">
                  {article.title}
                </h4>
              </a>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span>{article.source_name}</span>
                <span>·</span>
                <span>{timeAgo(article.date)}</span>
              </div>
            </div>

            {article.tickers && article.tickers[0] && (
              <Link
                href={`/news?tickers=${article.tickers[0].toUpperCase()}`}
                className="px-1.5 py-0.5 bg-secondary text-muted-foreground hover:text-foreground text-[10px] font-medium rounded shrink-0 transition-colors"
              >
                {article.tickers[0].toUpperCase()}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
