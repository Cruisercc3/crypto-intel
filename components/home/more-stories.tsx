"use client"

import { useNews } from "@/hooks/use-news"
import { TrendingUp, TrendingDown, Minus, Clock } from "lucide-react"
import Link from "next/link"

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const h = Math.floor(diff / 3600000)
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function MoreStories() {
  const { articles, isLoading } = useNews()
  const items = articles.slice(13, 29)

  if (isLoading) {
    return (
      <div className="divide-y divide-border border border-border rounded-lg overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="p-4 flex gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-secondary rounded animate-pulse w-4/5" />
              <div className="h-3 bg-secondary rounded animate-pulse w-2/3" />
              <div className="h-3 bg-secondary rounded animate-pulse w-1/3" />
            </div>
            <div className="w-20 h-14 bg-secondary rounded animate-pulse shrink-0" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="divide-y divide-border border border-border rounded-lg overflow-hidden">
      {items.map((a, i) => {
        const SIcon = a.sentiment === "Positive" ? TrendingUp : a.sentiment === "Negative" ? TrendingDown : Minus
        const sColor = a.sentiment === "Positive" ? "text-bullish" : a.sentiment === "Negative" ? "text-bearish" : "text-muted-foreground"

        return (
          <div key={`${a.news_url || a.title}-${i}`} className="flex gap-4 p-4 hover:bg-secondary/30 transition-colors group">
            <div className="flex-1 min-w-0">
              {/* Category / ticker */}
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                {a.tickers?.filter(t => !!t).slice(0, 2).map(t => (
                  <Link key={t} href={`/news?tickers=${encodeURIComponent(t)}`}
                    className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded hover:bg-primary/20 transition-colors">
                    {t}
                  </Link>
                ))}
                <span className={`inline-flex items-center gap-0.5 text-[10px] ${sColor}`}>
                  <SIcon className="h-2.5 w-2.5" />
                  {a.sentiment}
                </span>
              </div>

              <a href={a.news_url || "#"} target={a.news_url ? "_blank" : undefined} rel="noopener noreferrer">
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-1.5">
                  {a.title}
                </h3>
              </a>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2 leading-relaxed">{a.text}</p>

              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <Clock className="h-2.5 w-2.5" />
                <span>{timeAgo(a.date)}</span>
                <span>·</span>
                <span>{a.source_name}</span>
              </div>
            </div>

            {a.image_url && (
              <div className="shrink-0 w-24 h-16 rounded overflow-hidden bg-secondary">
                <img src={a.image_url} alt="" className="w-full h-full object-cover"
                  onError={e => { (e.currentTarget.parentElement as HTMLElement).style.display = "none" }} />
              </div>
            )}
          </div>
        )
      })}

      {items.length === 0 && (
        <div className="p-8 text-center text-sm text-muted-foreground">No articles available</div>
      )}
    </div>
  )
}
