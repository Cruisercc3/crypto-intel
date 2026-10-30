"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Minus, Sparkles, ChevronDown, ChevronUp, ExternalLink, Loader2 } from "lucide-react"
import { useSentimentAnalysis } from "@/hooks/use-sentiment"
import type { NewsArticle } from "@/hooks/use-news"

interface NewsCardProps {
  article: NewsArticle
}

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

export function NewsCard({ article }: NewsCardProps) {
  const [showAiSummary, setShowAiSummary] = useState(false)
  const { analyze, analysis, isAnalyzing, error } = useSentimentAnalysis()

  const handleAiAnalysis = async () => {
    setShowAiSummary(!showAiSummary)
    if (!showAiSummary && !analysis && !isAnalyzing) {
      await analyze(article.title, article.text)
    }
  }

  const SentimentIcon = article.sentiment === "Positive" 
    ? TrendingUp 
    : article.sentiment === "Negative" 
      ? TrendingDown 
      : Minus

  const sentimentColors: Record<string, string> = {
    Positive: "bg-bullish/15 text-bullish",
    Negative: "bg-bearish/15 text-bearish",
    Neutral: "bg-muted text-muted-foreground",
  }

  return (
    <article className="bg-card border border-border rounded-lg hover:border-primary/40 transition-colors card-hover">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-secondary flex items-center justify-center">
              <span className="text-[9px] font-bold text-muted-foreground">
                {article.source_name?.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{article.source_name}</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{formatTimeAgo(article.date)}</span>
          </div>
          
          {/* Sentiment Badge */}
          <span
            title="Keyword score from the headline"
            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded ${sentimentColors[article.sentiment] || sentimentColors.Neutral}`}
          >
            <SentimentIcon className="h-3 w-3" />
            <span className="capitalize">{article.sentiment?.toLowerCase()}</span>
          </span>
        </div>

        {/* Title */}
        <a
          href={article.news_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block mb-2"
        >
          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
            {article.title}
            <ExternalLink className="inline-block ml-1.5 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
        </a>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
          {article.text}
        </p>

        {/* Tags & Topics */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Tickers */}
            {article.tickers?.slice(0, 3).map((ticker) => (
              <span
                key={ticker}
                className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded"
              >
                {ticker}
              </span>
            ))}
            {article.tickers && article.tickers.length > 3 && (
              <span className="text-[10px] text-muted-foreground">
                +{article.tickers.length - 3} more
              </span>
            )}
            
            {/* Topics if no tickers */}
            {(!article.tickers || article.tickers.length === 0) && article.topics?.slice(0, 2).map((topic) => (
              <span
                key={topic}
                className="px-1.5 py-0.5 bg-secondary text-muted-foreground text-[10px] font-medium rounded capitalize"
              >
                {topic}
              </span>
            ))}
          </div>

          {/* Image thumbnail if available */}
          {article.image_url && (
            <div className="w-16 h-10 rounded overflow-hidden bg-secondary shrink-0">
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
        </div>
      </div>

      {/* AI Summary Toggle */}
      <div className="border-t border-border">
        <button
          className="w-full flex items-center justify-between px-4 py-2 text-xs text-primary hover:bg-primary/5 transition-colors"
          onClick={handleAiAnalysis}
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" />
            AI Deep Analysis
          </span>
          {isAnalyzing ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : showAiSummary ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>

        {showAiSummary && (
          <div className="px-4 pb-3 pt-1">
            {isAnalyzing ? (
              <div className="p-3 bg-primary/5 border border-primary/20 rounded text-xs text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Analyzing with AI...
              </div>
            ) : analysis ? (
              <div className="p-3 bg-primary/5 border border-primary/20 rounded text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${
                    analysis.sentiment === 'bullish' ? 'text-bullish' :
                    analysis.sentiment === 'bearish' ? 'text-bearish' : 'text-muted-foreground'
                  }`}>
                    AI: {analysis.sentiment.toUpperCase()} ({analysis.score > 0 ? '+' : ''}{analysis.score})
                  </span>
                  <span className="text-muted-foreground">
                    {analysis.confidence}% confidence
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {analysis.summary}
                </p>
                {analysis.impactedAssets.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                    <span className="text-muted-foreground">Impacted:</span>
                    {analysis.impactedAssets.map(asset => (
                      <span key={asset} className="px-1.5 py-0.5 bg-secondary rounded text-foreground">
                        {asset}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between pt-1 text-muted-foreground">
                  <span>Market Impact: <span className={
                    analysis.marketImpact === 'high' ? 'text-primary font-medium' :
                    analysis.marketImpact === 'medium' ? 'text-foreground' : ''
                  }>{analysis.marketImpact}</span></span>
                </div>
              </div>
            ) : error ? (
              <div className="p-3 bg-bearish/5 border border-bearish/30 rounded text-xs space-y-2" role="alert">
                <p className="text-bearish">AI analysis failed: {error}</p>
                <button
                  onClick={() => analyze(article.title, article.text)}
                  className="text-primary hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </article>
  )
}
