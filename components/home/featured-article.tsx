"use client"

import { useNews } from "@/hooks/use-news"
import { Clock, TrendingUp, TrendingDown, ChevronDown, Loader2 } from "lucide-react"
import Link from "next/link"

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export function FeaturedArticle() {
  const { articles, isLoading } = useNews()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!articles.length) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground">
        No articles available
      </div>
    )
  }

  const featured = articles[0]
  const relatedArticles = articles.slice(1, 7) // 0-6 here, 7-12 in the grid, 13-28 in Latest Stories

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main Featured Card */}
      <div className="lg:w-[55%]">
        <a 
          href={featured.news_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block border-2 border-primary rounded-lg p-6 bg-card card-hover"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-primary font-semibold text-sm uppercase tracking-wide">Featured</span>
            <span className="text-muted-foreground text-xs flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTimeAgo(featured.date)}
            </span>
          </div>
          
          {/* Image or Branding Box */}
          {featured.image_url ? (
            <div className="rounded-lg mb-5 overflow-hidden aspect-video bg-secondary">
              <img 
                src={featured.image_url} 
                alt={featured.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          ) : (
            <div className="border-2 border-primary rounded-lg p-6 mb-5 flex items-center justify-center">
              <span className="text-primary text-4xl md:text-5xl font-bold tracking-tight">CryptoIntel</span>
            </div>
          )}
          
          <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3 leading-tight">
            {featured.title}
          </h2>
          
          <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">
            {featured.text}
          </p>
          
          <div className="flex items-center gap-3 flex-wrap">
            {featured.tickers?.slice(0, 1).map(ticker => (
              <div key={ticker} className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${
                featured.sentiment === 'Positive' 
                  ? 'bg-bullish/15 text-bullish' 
                  : featured.sentiment === 'Negative'
                  ? 'bg-bearish/15 text-bearish'
                  : 'bg-secondary text-muted-foreground'
              }`}>
                {featured.sentiment === 'Positive' ? <TrendingUp className="h-3 w-3" /> : 
                 featured.sentiment === 'Negative' ? <TrendingDown className="h-3 w-3" /> : null}
                {ticker}
              </div>
            ))}
            {featured.tickers && featured.tickers.length > 1 && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-secondary text-xs text-muted-foreground">
                {featured.tickers.length - 1} more <ChevronDown className="h-3 w-3" />
              </span>
            )}
            <span className="text-xs text-muted-foreground ml-auto">{featured.source_name}</span>
          </div>
        </a>
      </div>

      {/* Sidebar Articles */}
      <div className="lg:w-[45%] flex flex-col gap-3">
        {relatedArticles.map((article, idx) => (
          <a
            href={article.news_url}
            target="_blank"
            rel="noopener noreferrer"
            key={`${article.news_url}-${idx}`}
            className="flex gap-4 p-3 bg-card rounded-lg border border-border hover:border-primary/50 card-hover group"
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                {article.title}
              </h3>
              
              <div className="flex items-center gap-2 flex-wrap">
                {article.tickers?.slice(0, 1).map(ticker => (
                  <span key={ticker} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                    article.sentiment === 'Positive' 
                      ? 'bg-bullish/15 text-bullish' 
                      : article.sentiment === 'Negative'
                      ? 'bg-bearish/15 text-bearish'
                      : 'bg-secondary text-muted-foreground'
                  }`}>
                    {ticker}
                  </span>
                ))}
                {article.tickers && article.tickers.length > 1 && (
                  <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 bg-secondary rounded">
                    +{article.tickers.length - 1} more
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span>{article.source_name}</span>
                <span>·</span>
                <span>{formatTimeAgo(article.date)}</span>
              </div>
            </div>
            
            {article.image_url && (
              <div className="shrink-0 w-20 h-16 rounded overflow-hidden bg-secondary">
                <img 
                  src={article.image_url} 
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.parentElement!.style.display = 'none'
                  }}
                />
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}
