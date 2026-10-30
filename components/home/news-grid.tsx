"use client"

import { useNews } from "@/hooks/use-news"
import { TrendingUp, TrendingDown, ExternalLink, Loader2 } from "lucide-react"

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

export function NewsGrid() {
  const { articles, isLoading } = useNews()
  const displayArticles = articles.slice(7, 13)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!displayArticles.length) {
    return null
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayArticles.map((article, idx) => (
        <a
          href={article.news_url}
          target="_blank"
          rel="noopener noreferrer"
          key={`${article.news_url}-${idx}`}
          className="group bg-card border border-border rounded-lg overflow-hidden card-hover"
        >
          {/* Image */}
          <div className="h-40 bg-gradient-to-br from-secondary to-muted relative overflow-hidden">
            {article.image_url ? (
              <img 
                src={article.image_url} 
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl font-bold text-primary/20">
                  {article.tickers?.[0] || 'CRYPTO'}
                </div>
              </div>
            )}
            <div className="absolute top-3 left-3">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium backdrop-blur-sm ${
                article.sentiment === 'Positive' 
                  ? 'bg-bullish/20 text-bullish border border-bullish/30' 
                  : article.sentiment === 'Negative'
                  ? 'bg-bearish/20 text-bearish border border-bearish/30'
                  : 'bg-muted/50 text-muted-foreground border border-border'
              }`}>
                {article.sentiment === 'Positive' ? <TrendingUp className="h-3 w-3" /> : 
                 article.sentiment === 'Negative' ? <TrendingDown className="h-3 w-3" /> : null}
                {article.sentiment?.toLowerCase() || 'neutral'}
              </span>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2 leading-snug">
              {article.title}
            </h3>
            
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {article.text}
            </p>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {article.tickers?.slice(0, 2).map(ticker => (
                  <span key={ticker} className="font-mono text-muted-foreground">
                    {ticker}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>{formatTimeAgo(article.date)}</span>
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}
