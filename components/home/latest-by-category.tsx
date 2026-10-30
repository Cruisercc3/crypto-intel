"use client"

import { useNews } from "@/hooks/use-news"
import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const h = Math.floor(diff / 3600000)
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const COLUMNS = [
  { label: "Analysis", section: "analysis" },
  { label: "Macro", section: "macro" },
  { label: "Regulation", section: "regulation" },
]

function CategoryColumn({ label, section }: { label: string; section: string }) {
  const href = `/news?section=${section}`
  const { articles: colArticles, isLoading } = useNews({ section, limit: 5 })

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Column header with featured image */}
      {!isLoading && colArticles[0]?.image_url && (
        <a href={colArticles[0].news_url} target="_blank" rel="noopener noreferrer" className="block relative h-44 overflow-hidden">
          <img src={colArticles[0].image_url} alt="" className="w-full h-full object-cover" onError={e => { (e.currentTarget.parentElement as HTMLElement).style.display = "none" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <span className="text-[10px] text-primary font-semibold uppercase tracking-wider">{label}</span>
            <p className="text-xs font-semibold text-foreground line-clamp-2 leading-snug mt-0.5">{colArticles[0].title}</p>
          </div>
        </a>
      )}
      {(isLoading || !colArticles[0]?.image_url) && (
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">{label}</span>
          <Link href={href} className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1">
            All {label} <ArrowRight className="h-2.5 w-2.5" />
          </Link>
        </div>
      )}

      {/* Sub-articles */}
      <div className="divide-y divide-border">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-3 space-y-1">
                <div className="h-3.5 bg-secondary rounded animate-pulse w-4/5" />
                <div className="h-2.5 bg-secondary rounded animate-pulse w-1/3" />
              </div>
            ))
          : colArticles.slice(colArticles[0]?.image_url ? 1 : 0, 5).map((a, i) => (
              <a key={`${a.news_url}-${i}`} href={a.news_url} target="_blank" rel="noopener noreferrer"
                className="flex gap-3 p-3 hover:bg-secondary/50 transition-colors group">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-1">
                    {a.title}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Clock className="h-2.5 w-2.5" />
                    <span>{timeAgo(a.date)}</span>
                    <span>·</span>
                    <span>{a.source_name}</span>
                  </div>
                </div>
                {a.image_url && (
                  <div className="w-12 h-10 rounded overflow-hidden bg-secondary shrink-0">
                    <img src={a.image_url} alt="" className="w-full h-full object-cover"
                      onError={e => { (e.currentTarget.parentElement as HTMLElement).style.display = "none" }} />
                  </div>
                )}
              </a>
            ))}
        {!isLoading && colArticles.length === 0 && (
          <p className="p-4 text-xs text-muted-foreground">No articles in this category yet</p>
        )}
      </div>
      <div className="px-4 py-2.5 border-t border-border">
        <Link href={href} className="flex items-center gap-1 text-xs text-primary hover:underline">
          All {label} articles <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}

export function LatestByCategory() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {COLUMNS.map(c => <CategoryColumn key={c.section} {...c} />)}
    </div>
  )
}
