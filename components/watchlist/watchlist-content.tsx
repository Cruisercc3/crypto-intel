"use client"

import { useState } from "react"
import Link from "next/link"
import { Star, Plus, Trash2, TrendingUp, TrendingDown, Minus, ExternalLink, Search, X, Loader2 } from "lucide-react"
import { useAllCoins, type CoinData } from "@/hooks/use-coins"
import { useWatchlist } from "@/hooks/use-watchlist"
import { useNewsByTicker } from "@/hooks/use-news"

// Derives a simple bullish/bearish/neutral from 24h change
function deriveSentiment(change: number): "bullish" | "bearish" | "neutral" {
  if (change > 1) return "bullish"
  if (change < -1) return "bearish"
  return "neutral"
}

const sentimentConfig = {
  bullish:  { icon: TrendingUp,   color: "text-bullish",        bg: "bg-bullish/15"  },
  bearish:  { icon: TrendingDown, color: "text-bearish",        bg: "bg-bearish/15"  },
  neutral:  { icon: Minus,        color: "text-muted-foreground", bg: "bg-muted"      },
}

function SentimentBadge({ sentiment }: { sentiment: "bullish" | "bearish" | "neutral" }) {
  const { icon: Icon, color, bg } = sentimentConfig[sentiment]
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded ${bg} ${color}`}>
      <Icon className="h-3 w-3" />
      <span className="capitalize">{sentiment}</span>
    </span>
  )
}

// Single watched asset card — fetches its own news headline
function WatchedCoinCard({ coin, onRemove }: { coin: CoinData; onRemove: () => void }) {
  const { articles } = useNewsByTicker(coin.symbol.toUpperCase(), 1, coin.name)
  const change = coin.price_change_percentage_24h ?? 0
  const change7d = coin.price_change_percentage_7d_in_currency ?? 0
  const sentiment = deriveSentiment(change)

  return (
    <div className="p-4 bg-card border border-border rounded-lg hover:border-primary/40 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
            {coin.image ? (
              <img src={coin.image} alt={coin.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-mono font-bold text-foreground">{coin.symbol.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{coin.name}</h3>
            <p className="text-[10px] text-muted-foreground font-mono">{coin.symbol.toUpperCase()}</p>
          </div>
        </div>
        <button
          className="p-1.5 text-muted-foreground hover:text-bearish transition-colors"
          onClick={onRemove}
          aria-label="Remove from watchlist"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Price */}
      <div className="mb-3">
        <p className="text-xl font-bold text-foreground font-mono">
          ${coin.current_price?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: coin.current_price > 1 ? 2 : 6,
          })}
        </p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className={`text-xs font-mono ${change >= 0 ? "text-bullish" : "text-bearish"}`}>
            {change >= 0 ? "+" : ""}{change.toFixed(2)}% 24h
          </span>
          <span className={`text-xs font-mono ${change7d >= 0 ? "text-bullish" : "text-bearish"}`}>
            {change7d >= 0 ? "+" : ""}{change7d.toFixed(2)}% 7d
          </span>
        </div>
      </div>

      {/* Market cap */}
      <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground font-mono">
        <span>MCap: ${coin.market_cap >= 1e9 ? `${(coin.market_cap / 1e9).toFixed(1)}B` : `${(coin.market_cap / 1e6).toFixed(0)}M`}</span>
        <span>Rank #{coin.market_cap_rank}</span>
      </div>

      {/* 24h price trend */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground">24h trend</span>
        <SentimentBadge sentiment={sentiment} />
      </div>

      {/* Latest headline */}
      {articles[0] && (
        <a
          href={articles[0].news_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-2.5 bg-secondary/50 rounded border border-border hover:border-primary/30 transition-colors"
        >
          <p className="text-xs text-muted-foreground line-clamp-2 hover:text-foreground transition-colors">
            {articles[0].title}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">{articles[0].source_name}</p>
        </a>
      )}

      {/* Link to news */}
      <Link
        href={`/news?tickers=${coin.symbol.toUpperCase()}`}
        className="inline-flex items-center gap-1 mt-3 text-xs text-primary hover:underline"
      >
        View {coin.symbol.toUpperCase()} news
        <ExternalLink className="h-3 w-3" />
      </Link>
    </div>
  )
}

// Add modal — lets you search from live coins
function AddModal({ coins, watchlistIds, onAdd, onClose }: {
  coins: CoinData[]
  watchlistIds: string[]
  onAdd: (id: string) => void
  onClose: () => void
}) {
  const [query, setQuery] = useState("")

  const available = coins.filter(c =>
    !watchlistIds.includes(c.id) &&
    (c.symbol.toLowerCase().includes(query.toLowerCase()) ||
     c.name.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-card border border-border rounded-lg shadow-xl">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Add to Watchlist</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search coins..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 bg-secondary border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
          </div>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {available.slice(0, 20).map(coin => (
              <button
                key={coin.id}
                onClick={() => { onAdd(coin.id); onClose() }}
                className="w-full flex items-center justify-between p-2 rounded hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                    {coin.image ? (
                      <img src={coin.image} alt={coin.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[9px] font-mono font-bold">{coin.symbol.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{coin.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{coin.symbol.toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-foreground">${coin.current_price?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  <p className={`text-[10px] font-mono ${(coin.price_change_percentage_24h ?? 0) >= 0 ? "text-bullish" : "text-bearish"}`}>
                    {(coin.price_change_percentage_24h ?? 0) >= 0 ? "+" : ""}{(coin.price_change_percentage_24h ?? 0).toFixed(2)}%
                  </p>
                </div>
              </button>
            ))}
            {available.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">
                {query ? "No matching coins" : "All coins added"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function WatchlistContent() {
  const [showModal, setShowModal] = useState(false)
  const { ids: watchlistIds, ready: isLoaded, add: addCoin, remove: removeCoin } = useWatchlist()
  const { coins, isLoading } = useAllCoins()

  // Keep the order coins were added in
  const watchedCoins = watchlistIds
    .map(id => coins.find(c => c.id === id))
    .filter((c): c is CoinData => Boolean(c))

  if (!isLoaded || (isLoading && coins.length === 0)) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-mono">
          {watchedCoins.length} asset{watchedCoins.length !== 1 ? "s" : ""} tracked · CoinGecko prices · saved in this browser
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 h-8 px-4 bg-primary text-primary-foreground text-xs font-medium rounded hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Asset
        </button>
      </div>

      {watchlistIds.length === 0 && (
        <div className="text-center py-16 bg-card border border-border rounded-lg">
          <Star className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-base font-semibold text-foreground mb-1">Your watchlist is empty</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
            Track live prices, 7d performance, and the latest news for any coin. Stars on the Markets page and coin pages land here too. The list is saved in this browser.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 h-8 px-4 bg-primary text-primary-foreground text-xs font-medium rounded hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Your First Asset
          </button>
        </div>
      )}

      {watchedCoins.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchedCoins.map(coin => (
            <WatchedCoinCard key={coin.id} coin={coin} onRemove={() => removeCoin(coin.id)} />
          ))}
        </div>
      )}

      {showModal && (
        <AddModal
          coins={coins}
          watchlistIds={watchlistIds}
          onAdd={addCoin}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
