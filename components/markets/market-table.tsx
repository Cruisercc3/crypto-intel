"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, ChevronUp, ChevronDown, Star, Loader2, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { useAllCoins } from "@/hooks/use-coins"
import { useWatchlist } from "@/hooks/use-watchlist"
import { MAX_COINS } from "@/lib/site"

const categories = ["All", "Watchlist", "Large Cap", "Mid Cap", "Small Cap", "DeFi", "Layer 1", "Layer 2", "Gaming", "AI", "Meme", "Stablecoins"]
const ROWS_PER_PAGE_OPTIONS = [50, 100, 250, 500]

type SortKey = "rank" | "name" | "price" | "change24h" | "change7d" | "marketCap" | "volume"
type SortDirection = "asc" | "desc"

// Category mapping by market_cap_rank and known categorization
const COIN_CATEGORIES: Record<string, string[]> = {
  // Large Cap
  bitcoin: ["largecap"], ethereum: ["largecap", "layer1"], binancecoin: ["largecap"],
  ripple: ["largecap"], 
  // Stablecoins
  tether: ["stablecoins"], "usd-coin": ["stablecoins"], dai: ["stablecoins", "defi"], 
  "true-usd": ["stablecoins"], "first-digital-usd": ["stablecoins"], usdd: ["stablecoins"],
  // Layer 1
  solana: ["layer1"], cardano: ["layer1"], avalanche: ["layer1"], polkadot: ["layer1"],
  near: ["layer1"], cosmos: ["layer1"], tron: ["layer1"], toncoin: ["layer1"], algorand: ["layer1"],
  fantom: ["layer1"], aptos: ["layer1"], sui: ["layer1"], sei: ["layer1"], injective: ["layer1"],
  // Layer 2
  "polygon-ecosystem-token": ["layer2"], "matic-network": ["layer2"], arbitrum: ["layer2"],
  optimism: ["layer2"], "immutable-x": ["layer2", "gaming"], starknet: ["layer2"], 
  "mantle-mnt": ["layer2"], base: ["layer2"], "zksync-era": ["layer2"],
  // DeFi
  uniswap: ["defi"], aave: ["defi"], chainlink: ["defi"], "lido-dao": ["defi"],
  "wrapped-bitcoin": ["defi"], "the-graph": ["defi"], maker: ["defi"], 
  compound: ["defi"], curve: ["defi"], "1inch": ["defi"], pancakeswap: ["defi"],
  // Gaming
  "axie-infinity": ["gaming"], "the-sandbox": ["gaming"], decentraland: ["gaming"], 
  gala: ["gaming"], enjincoin: ["gaming"], "illuvium": ["gaming"], "stepn": ["gaming"],
  ronin: ["gaming", "layer2"], "beam-2": ["gaming"],
  // AI
  "fetch-ai": ["ai"], render: ["ai"], "ocean-protocol": ["ai"], singularitynet: ["ai"],
  "bittensor": ["ai"], akash: ["ai"], "worldcoin-wld": ["ai"],
  // Meme
  dogecoin: ["meme"], "shiba-inu": ["meme"], pepe: ["meme"], "bonk-inu": ["meme"], floki: ["meme"],
  "dogwifhat": ["meme"], "book-of-meme": ["meme"], "brett": ["meme"], "mog": ["meme"],
}

function getCoinCategory(id: string, rank: number): string[] {
  if (COIN_CATEGORIES[id]) return COIN_CATEGORIES[id]
  // Classify by market cap rank
  if (rank <= 20) return ["largecap"]
  if (rank <= 100) return ["midcap"]
  if (rank <= 300) return ["smallcap"]
  return ["smallcap"]
}

function fmt(n: number) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
}

export function MarketTable() {
  const { coins, total, isLoading } = useAllCoins()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortKey, setSortKey] = useState<SortKey>("rank")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const watchlist = useWatchlist()
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(100)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection(key === "rank" ? "asc" : "desc")
    }
    setCurrentPage(1) // Reset to first page on sort change
  }

  const toggleWatchlist = (id: string) => {
    watchlist.toggle(id)
  }

  const filteredAssets = useMemo(() => {
    let result = coins.map(c => ({
      ...c,
      categories: getCoinCategory(c.id, c.market_cap_rank),
    }))

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        c => c.symbol.toLowerCase().includes(query) || c.name.toLowerCase().includes(query)
      )
    }

    if (selectedCategory === "Watchlist") {
      result = result.filter(c => watchlist.ids.includes(c.id))
    } else if (selectedCategory !== "All") {
      const categoryMap: Record<string, string> = {
        "Large Cap": "largecap", "Mid Cap": "midcap", "Small Cap": "smallcap",
        "DeFi": "defi", "Layer 1": "layer1", "Layer 2": "layer2", 
        "Gaming": "gaming", "AI": "ai", "Meme": "meme", "Stablecoins": "stablecoins",
      }
      const cat = categoryMap[selectedCategory]
      if (cat) result = result.filter(c => c.categories.includes(cat))
    }

    result.sort((a, b) => {
      let comparison = 0
      switch (sortKey) {
        case "rank": comparison = (a.market_cap_rank ?? 9999) - (b.market_cap_rank ?? 9999); break
        case "name": comparison = a.name.localeCompare(b.name); break
        case "price": comparison = a.current_price - b.current_price; break
        case "change24h": comparison = (a.price_change_percentage_24h ?? 0) - (b.price_change_percentage_24h ?? 0); break
        case "change7d": comparison = (a.price_change_percentage_7d_in_currency ?? 0) - (b.price_change_percentage_7d_in_currency ?? 0); break
        case "marketCap": comparison = (a.market_cap ?? 0) - (b.market_cap ?? 0); break
        case "volume": comparison = (a.total_volume ?? 0) - (b.total_volume ?? 0); break
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

    return result
  }, [coins, searchQuery, selectedCategory, sortKey, sortDirection, watchlist.ids])

  // Pagination
  const totalPages = Math.ceil(filteredAssets.length / rowsPerPage)
  const paginatedAssets = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return filteredAssets.slice(start, start + rowsPerPage)
  }, [filteredAssets, currentPage, rowsPerPage])

  // Reset to page 1 when filters change
  const handleFilterChange = (setter: (v: string) => void, value: string) => {
    setter(value)
    setCurrentPage(1)
  }

  const SortHeader = ({ label, sortKeyProp, className }: { label: string; sortKeyProp: SortKey; className?: string }) => (
    <button
      onClick={() => handleSort(sortKeyProp)}
      className={`flex items-center gap-1 hover:text-foreground transition-colors group ${className ?? ""}`}
    >
      {label}
      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
        {sortKey === sortKeyProp ? (
          sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3 text-muted-foreground/40" />
        )}
      </span>
      {sortKey === sortKeyProp && (
        <span className="opacity-100">
          {sortDirection === "asc" ? <ChevronUp className="h-3 w-3 text-primary" /> : <ChevronDown className="h-3 w-3 text-primary" />}
        </span>
      )}
    </button>
  )

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Filters */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          {/* Search */}
          <div className="relative max-w-sm flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder={`Search ${(total || MAX_COINS).toLocaleString()} assets...`}
              aria-label="Search assets"
              value={searchQuery}
              onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
              className="w-full h-9 pl-9 pr-4 bg-secondary border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Rows per page */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Rows:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1) }}
              className="h-8 px-2 bg-secondary border border-border rounded text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {ROWS_PER_PAGE_OPTIONS.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleFilterChange(setSelectedCategory, category)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && coins.length === 0 && (
        <div className="h-[400px] flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground text-sm">Loading the top {MAX_COINS} cryptocurrencies...</span>
        </div>
      )}

      {/* Table */}
      {(!isLoading || coins.length > 0) && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-3 py-2.5 text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider w-8" />
                <th className="px-2 py-2.5 text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider w-10">
                  <SortHeader label="#" sortKeyProp="rank" />
                </th>
                <th className="px-3 py-2.5 text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  <SortHeader label="Asset" sortKeyProp="name" />
                </th>
                <th className="px-3 py-2.5 text-right text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  <div className="flex justify-end"><SortHeader label="Price" sortKeyProp="price" /></div>
                </th>
                <th className="px-3 py-2.5 text-right text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  <div className="flex justify-end"><SortHeader label="24h" sortKeyProp="change24h" /></div>
                </th>
                <th className="px-3 py-2.5 text-right text-[10px] font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                  <div className="flex justify-end"><SortHeader label="7d" sortKeyProp="change7d" /></div>
                </th>
                <th className="px-3 py-2.5 text-right text-[10px] font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                  <div className="flex justify-end"><SortHeader label="Mkt Cap" sortKeyProp="marketCap" /></div>
                </th>
                <th className="px-3 py-2.5 text-right text-[10px] font-medium text-muted-foreground uppercase tracking-wider hidden xl:table-cell">
                  <div className="flex justify-end"><SortHeader label="24h Vol" sortKeyProp="volume" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedAssets.map((coin) => {
                const c24 = coin.price_change_percentage_24h ?? 0
                const c7d = coin.price_change_percentage_7d_in_currency ?? 0
                const inWatchlist = watchlist.has(coin.id)
                return (
                  <tr key={coin.id} className="table-row-hover group">
                    <td className="px-3 py-2.5">
                      <button
                        onClick={() => toggleWatchlist(coin.id)}
                        className="p-1 rounded transition-colors"
                        aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                        aria-pressed={inWatchlist}
                      >
                        <Star className={`h-4 w-4 transition-colors ${inWatchlist ? "fill-primary text-primary" : "text-muted-foreground/40 hover:text-muted-foreground"}`} />
                      </button>
                    </td>
                    <td className="px-2 py-2.5">
                      <span className="text-xs font-mono text-muted-foreground">{coin.market_cap_rank ?? "—"}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <Link href={`/coin/${coin.id}`} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                          {coin.image ? (
                            <img src={coin.image} alt={coin.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[9px] font-mono font-bold text-foreground">{coin.symbol.slice(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground leading-tight hover:text-primary transition-colors">{coin.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{coin.symbol.toUpperCase()}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <p className="text-sm font-mono text-foreground">
                        ${coin.current_price?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: coin.current_price > 1 ? 2 : 6,
                        })}
                      </p>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span className={`inline-flex items-center gap-0.5 text-sm font-mono ${c24 >= 0 ? "text-bullish" : "text-bearish"}`}>
                        {c24 >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(c24).toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right hidden md:table-cell">
                      <span className={`text-sm font-mono ${c7d >= 0 ? "text-bullish" : "text-bearish"}`}>
                        {c7d >= 0 ? "+" : ""}{c7d.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right hidden lg:table-cell">
                      <p className="text-sm font-mono text-muted-foreground">{coin.market_cap ? fmt(coin.market_cap) : "—"}</p>
                    </td>
                    <td className="px-3 py-2.5 text-right hidden xl:table-cell">
                      <p className="text-sm font-mono text-muted-foreground">{coin.total_volume ? fmt(coin.total_volume) : "—"}</p>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {filteredAssets.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">
            {selectedCategory === "Watchlist" && !searchQuery
              ? "No starred coins yet. Tap the star next to any coin to add it."
              : "No assets match your search"}
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="px-4 py-3 border-t border-border flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground font-mono">
          {filteredAssets.length === 0 ? "No assets" : `Showing ${((currentPage - 1) * rowsPerPage) + 1}-${Math.min(currentPage * rowsPerPage, filteredAssets.length)} of ${filteredAssets.length.toLocaleString()} assets`}
          {total > 0 && ` (${total.toLocaleString()} total loaded)`}
        </p>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <span className="px-3 text-xs font-mono text-foreground">
            Page {currentPage} of {totalPages || 1}
          </span>
          
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-bullish animate-pulse" />
          <span className="text-[10px] text-muted-foreground font-mono">LIVE</span>
        </div>
      </div>
    </div>
  )
}
