"use client"

import { useNews } from "@/hooks/use-news"
import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"

interface CategoryNewsRowProps {
  category: string
  section: string
  href: string
  accentClass: string
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const h = Math.floor(diff / 3600000)
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function CategoryNewsRow({ category, section, href, accentClass }: CategoryNewsRowProps) {
  const { articles, isLoading } = useNews({ section, limit: 4 })

  const items = articles.slice(0, 4)

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className={`text-xs font-bold uppercase tracking-wider ${accentClass}`}>{category}</span>
        <Link href={href} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors">
          All {category} <ArrowRight className="h-2.5 w-2.5" />
        </Link>
      </div>
      <div className="divide-y divide-border">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-3 space-y-1.5">
                <div className="h-4 bg-secondary rounded animate-pulse w-3/4" />
                <div className="h-3 bg-secondary rounded animate-pulse w-1/3" />
              </div>
            ))
          : items.map((a, i) => (
              <a
                key={`${a.news_url}-${i}`}
                href={a.news_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 hover:bg-secondary/50 transition-colors group"
              >
                <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-1">
                  {a.title}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Clock className="h-2.5 w-2.5" />
                  <span>{timeAgo(a.date)}</span>
                  <span className="text-border">·</span>
                  <span>{a.source_name}</span>
                </div>
              </a>
            ))}
        {!isLoading && items.length === 0 && (
          <p className="p-4 text-xs text-muted-foreground">No {category} stories in the feed right now</p>
        )}
      </div>
    </div>
  )
}
