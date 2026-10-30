"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, SlidersHorizontal, X, Loader2, RefreshCw } from "lucide-react"
import { NewsCard } from "./news-card"
import { useNews } from "@/hooks/use-news"
import { SECTION_KEYWORDS, sectionLabel } from "@/lib/sections"

// Extended filter list for more crypto variety
const ASSET_FILTERS = ["All", "BTC", "ETH", "SOL", "XRP", "ADA", "DOGE", "AVAX", "BNB", "LINK", "DOT", "LTC", "SHIB", "ARB", "OP", "SUI", "PEPE"]
const SENTIMENT_FILTERS = ["all", "Positive", "Negative", "Neutral"] as const

export function NewsFeed() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const urlTicker = (searchParams.get("tickers") || "").toUpperCase()
  const urlSearch = searchParams.get("search") || ""
  const rawSection = (searchParams.get("section") || "").toLowerCase()
  const urlSection = SECTION_KEYWORDS[rawSection] ? rawSection : ""

  const [searchQuery, setSearchQuery] = useState(urlSearch)
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch)
  const [selectedAsset, setSelectedAsset] = useState(urlTicker || "All")
  const [selectedSentiment, setSelectedSentiment] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)

  // Debounce typing so the feed isn't refetched on every key
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Follow the URL when the header search or a ticker link changes it
  useEffect(() => {
    setSelectedAsset(urlTicker || "All")
    setPage(1)
  }, [urlTicker])

  useEffect(() => {
    setSearchQuery(urlSearch)
    setDebouncedSearch(urlSearch)
    setPage(1)
  }, [urlSearch])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, urlSection])

  // Search, ticker and category run on the server across the whole article pool.
  const { articles, total, isLoading, isError, totalPages, refresh } = useNews({
    page,
    tickers: selectedAsset !== "All" ? selectedAsset : "",
    search: debouncedSearch,
    section: urlSection,
  })

  // Sentiment narrows the current page
  const filteredArticles = useMemo(() => {
    if (selectedSentiment === "all") return articles
    return articles.filter(article => article.sentiment === selectedSentiment)
  }, [articles, selectedSentiment])

  const clearFilters = () => {
    setSearchQuery("")
    setDebouncedSearch("")
    setSelectedAsset("All")
    setSelectedSentiment("all")
    setPage(1)
    router.push("/news")
  }

  const hasActiveFilters = searchQuery || selectedAsset !== "All" || selectedSentiment !== "all" || urlSection

  const bannerParts = [
    urlTicker ? `Ticker: ${urlTicker}` : "",
    urlSection ? `Category: ${sectionLabel(urlSection)}` : "",
    urlSearch ? `Search: "${urlSearch}"` : "",
  ].filter(Boolean)

  return (
    <div className="space-y-4 min-w-0">
      {/* Active filter banner */}
      {bannerParts.length > 0 && (
        <div className="flex items-center justify-between gap-3 px-3 py-2 bg-primary/10 border border-primary/30 rounded-lg text-xs">
          <span className="text-primary font-medium min-w-0 truncate">
            Filtering: {bannerParts.join(" · ")}
          </span>
          <button onClick={clearFilters} className="text-primary hover:underline flex items-center gap-1 shrink-0">
            <X className="h-3 w-3" /> Clear
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search articles"
              className="w-full h-9 pl-9 pr-4 bg-secondary border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            className="lg:hidden flex items-center gap-2 px-3 h-9 bg-secondary border border-border rounded text-sm text-foreground"
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Show filters"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => refresh()}
            aria-label="Refresh feed"
            className="flex items-center gap-1.5 px-3 h-9 bg-secondary border border-border rounded text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        </div>

        <div className={`space-y-2 ${showFilters ? "block" : "hidden lg:block"}`}>
          {/* Asset filters */}
          <div className="flex flex-wrap gap-1.5">
            {ASSET_FILTERS.map(asset => (
              <button
                key={asset}
                onClick={() => { setSelectedAsset(asset); setPage(1) }}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  selectedAsset === asset
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {asset}
              </button>
            ))}
          </div>
          {/* Sentiment filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground shrink-0">Sentiment:</span>
            <div className="flex flex-wrap gap-1">
              {SENTIMENT_FILTERS.map(s => (
                <button key={s} onClick={() => setSelectedSentiment(s)}
                  className={`px-2 py-0.5 text-xs font-medium rounded capitalize transition-colors ${
                    selectedSentiment === s
                      ? s === "Positive" ? "bg-bullish/20 text-bullish"
                        : s === "Negative" ? "bg-bearish/20 text-bearish"
                        : s === "Neutral" ? "bg-muted text-muted-foreground"
                        : "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s === "all" ? "All" : s}
                </button>
              ))}
            </div>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {isLoading
            ? "Loading..."
            : selectedSentiment === "all"
              ? `${total} article${total === 1 ? "" : "s"}`
              : `${filteredArticles.length} ${selectedSentiment.toLowerCase()} on this page of ${total}`}
        </span>
        <span className="font-mono text-[10px]">Refreshes every minute</span>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <p className="text-muted-foreground text-sm">Failed to load articles</p>
          <button onClick={() => refresh()} className="text-primary text-xs mt-2 hover:underline">Try again</button>
        </div>
      )}

      {/* Articles */}
      {!isLoading && !isError && (
        <div className="space-y-3">
          {filteredArticles.map((article, idx) => (
            <NewsCard key={`${article.news_url}-${idx}`} article={article} />
          ))}
          {filteredArticles.length === 0 && (
            <div className="text-center py-12 bg-card border border-border rounded-lg">
              <p className="text-muted-foreground text-sm">No articles match your filters</p>
              <button onClick={clearFilters} className="text-primary text-xs mt-2 hover:underline">Clear filters</button>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1.5 text-xs bg-secondary border border-border rounded disabled:opacity-40 hover:bg-muted transition-colors">
            Previous
          </button>
          <span className="text-xs text-muted-foreground font-mono">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 text-xs bg-secondary border border-border rounded disabled:opacity-40 hover:bg-muted transition-colors">
            Next
          </button>
        </div>
      )}
    </div>
  )
}
