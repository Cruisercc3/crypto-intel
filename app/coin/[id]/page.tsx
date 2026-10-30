"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { 
  Star, ExternalLink, Copy, Check, TrendingUp, TrendingDown, 
  Globe, FileText, Github, MessageCircle, Newspaper, ChevronRight,
  Info, Loader2
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { PriceTicker } from "@/components/home/price-ticker"
import { Footer } from "@/components/footer"
import { AdvancedChart } from "@/components/charts/advanced-chart"
import { SparklineChart } from "@/components/charts/sparkline-chart"
import { getTradingViewSymbol, hasTradingViewPair } from "@/lib/tradingview"
import { useCoin } from "@/hooks/use-coins"
import { useNewsByTicker } from "@/hooks/use-news"
import { useWatchlist } from "@/hooks/use-watchlist"

function fmt(n: number) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
}

function fmtSupply(n: number) {
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(2)}K`
  return n.toLocaleString()
}

export default function CoinDetailPage() {
  const params = useParams()
  const coinId = params.id as string
  
  const { coin, isLoading: coinsLoading } = useCoin(coinId)

  const { articles, isLoading: newsLoading } = useNewsByTicker(coin?.symbol?.toUpperCase() || "", 10, coin?.name)
  const watchlist = useWatchlist()
  const watchlisted = coin ? watchlist.has(coin.id) : false

  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"about" | "news">("news")
  
  const copySymbol = () => {
    if (coin) {
      navigator.clipboard.writeText(coin.symbol.toUpperCase())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (coinsLoading && !coin) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <PriceTicker />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!coin) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <PriceTicker />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-foreground mb-2">Coin not found</p>
            <Link href="/markets" className="text-primary hover:underline">
              View all markets
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const change24h = coin.price_change_percentage_24h ?? 0
  const change7d = coin.price_change_percentage_7d_in_currency ?? 0
  const isPositive = change24h >= 0
  const tvPair = hasTradingViewPair(coin) ? getTradingViewSymbol(coin.symbol) : null

  // 24h range, only shown when CoinGecko sends both ends
  const low24 = coin.low_24h
  const high24 = coin.high_24h
  const hasRange = typeof low24 === "number" && typeof high24 === "number"
  const rangePercent = hasRange && high24 !== low24
    ? ((coin.current_price - low24) / (high24 - low24)) * 100
    : 50
  const priceDigits = (v: number) => ({ maximumFractionDigits: v >= 1 ? 2 : 8 })

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <PriceTicker />
      <SidebarNav />
      
      <main className="flex-1 xl:ml-16">
        <div className="max-w-[1600px] mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/markets" className="hover:text-foreground">Markets</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{coin.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Info Panel */}
            <div className="lg:col-span-4 xl:col-span-3 space-y-4">
              {/* Header */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                    {coin.image ? (
                      <img src={coin.image} alt={coin.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-mono font-bold text-foreground">{coin.symbol.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl font-bold text-foreground truncate">{coin.name}</h1>
                      <span className="text-xs bg-secondary text-muted-foreground px-1.5 py-0.5 rounded font-mono">
                        #{coin.market_cap_rank}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm text-muted-foreground font-mono">{coin.symbol.toUpperCase()}</span>
                      <button onClick={copySymbol} className="p-0.5 hover:bg-secondary rounded" title="Copy symbol">
                        {copied ? <Check className="h-3 w-3 text-bullish" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground font-mono">
                      ${coin.current_price?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: coin.current_price > 1 ? 2 : 6,
                      })}
                    </span>
                    <span className={`flex items-center gap-0.5 text-sm font-semibold ${isPositive ? "text-bullish" : "text-bearish"}`}>
                      {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {Math.abs(change24h).toFixed(2)}% (24h)
                    </span>
                  </div>
                </div>

                {/* 24h Range */}
                {hasRange && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>${low24.toLocaleString(undefined, priceDigits(low24))}</span>
                      <span className="text-foreground font-medium">24h Range</span>
                      <span>${high24.toLocaleString(undefined, priceDigits(high24))}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-bearish via-primary to-bullish rounded-full"
                        style={{ width: `${Math.min(100, Math.max(0, rangePercent))}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Watchlist button */}
                <button
                  onClick={() => watchlist.toggle(coin.id)}
                  aria-pressed={watchlisted}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-colors ${
                    watchlisted 
                      ? "bg-primary/10 border-primary text-primary" 
                      : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Star className={`h-4 w-4 ${watchlisted ? "fill-primary" : ""}`} />
                  {watchlisted ? "In Watchlist" : "Add to Watchlist"}
                </button>
              </div>

              {/* Market Data */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h2 className="text-sm font-semibold text-foreground mb-3">Market Data</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      Market Cap <Info className="h-3 w-3" />
                    </span>
                    <span className="text-sm font-mono text-foreground">{coin.market_cap ? fmt(coin.market_cap) : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      FDV <Info className="h-3 w-3" />
                    </span>
                    <span className="text-sm font-mono text-foreground">{coin.fully_diluted_valuation ? fmt(coin.fully_diluted_valuation) : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      24h Volume <Info className="h-3 w-3" />
                    </span>
                    <span className="text-sm font-mono text-foreground">{coin.total_volume ? fmt(coin.total_volume) : "—"}</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      Circulating Supply <Info className="h-3 w-3" />
                    </span>
                    <span className="text-sm font-mono text-foreground">{coin.circulating_supply ? fmtSupply(coin.circulating_supply) : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      Total Supply <Info className="h-3 w-3" />
                    </span>
                    <span className="text-sm font-mono text-foreground">{coin.total_supply ? fmtSupply(coin.total_supply) : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      Max Supply <Info className="h-3 w-3" />
                    </span>
                    <span className="text-sm font-mono text-foreground">{coin.max_supply ? fmtSupply(coin.max_supply) : "∞"}</span>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h2 className="text-sm font-semibold text-foreground mb-3">Info</h2>
                <div className="space-y-2">
                  <a 
                    href={`https://www.coingecko.com/en/coins/${coin.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between py-2 px-3 bg-secondary rounded hover:bg-secondary/80 transition-colors"
                  >
                    <span className="text-sm text-foreground flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      CoinGecko
                    </span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </a>
                  {tvPair && (
                    <a
                      href={`https://www.tradingview.com/symbols/${tvPair.replace(":", "-")}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between py-2 px-3 bg-secondary rounded hover:bg-secondary/80 transition-colors"
                    >
                      <span className="text-sm text-foreground flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        TradingView
                      </span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </a>
                  )}
                </div>
              </div>

              {/* Price Performance */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h2 className="text-sm font-semibold text-foreground mb-3">Price Performance</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary rounded p-2.5 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">24h</p>
                    <p className={`text-sm font-mono font-semibold ${change24h >= 0 ? "text-bullish" : "text-bearish"}`}>
                      {change24h >= 0 ? "+" : ""}{change24h.toFixed(2)}%
                    </p>
                  </div>
                  <div className="bg-secondary rounded p-2.5 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">7d</p>
                    <p className={`text-sm font-mono font-semibold ${change7d >= 0 ? "text-bullish" : "text-bearish"}`}>
                      {change7d >= 0 ? "+" : ""}{change7d.toFixed(2)}%
                    </p>
                  </div>
                  <div className="bg-secondary rounded p-2.5 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">ATH</p>
                    <p className="text-sm font-mono font-semibold text-foreground">
                      ${coin.ath?.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? "—"}
                    </p>
                  </div>
                  <div className="bg-secondary rounded p-2.5 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">ATH Change</p>
                    <p className={`text-sm font-mono font-semibold ${(coin.ath_change_percentage ?? 0) >= 0 ? "text-bullish" : "text-bearish"}`}>
                      {(coin.ath_change_percentage ?? 0).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Chart & News */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-4">
              {/* Chart */}
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h2 className="text-sm font-semibold text-foreground">
                    {tvPair ? `${coin.symbol.toUpperCase()}/USDT Chart` : `${coin.symbol.toUpperCase()} Price, 7 Days`}
                  </h2>
                </div>
                {tvPair ? (
                  <AdvancedChart
                    symbol={tvPair}
                    height={450}
                    className="border-0 rounded-none"
                  />
                ) : coin.sparkline_in_7d?.price?.length ? (
                  <SparklineChart
                    data={coin.sparkline_in_7d.price}
                    height={450}
                    coinName={coin.name}
                    currentPrice={coin.current_price}
                    priceChange={change7d}
                  />
                ) : (
                  <div className="h-[450px] flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <p className="text-sm">No chart data for this asset right now</p>
                    <a
                      href={`https://www.coingecko.com/en/coins/${coin.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      View on CoinGecko
                    </a>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="bg-card border border-border rounded-lg">
                <div className="flex border-b border-border">
                  <button
                    onClick={() => setActiveTab("news")}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "news"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Newspaper className="h-4 w-4" />
                    Recent News
                  </button>
                  <button
                    onClick={() => setActiveTab("about")}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "about"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Info className="h-4 w-4" />
                    About
                  </button>
                </div>

                <div className="p-4">
                  {activeTab === "news" && (
                    <div>
                      <h3 className="text-base font-semibold text-foreground mb-4">
                        Recently Happened to {coin.name}
                      </h3>
                      
                      {newsLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        </div>
                      ) : articles.length > 0 ? (
                        <div className="space-y-4">
                          {articles.map((article, i) => (
                            <a
                              key={`${article.news_url}-${i}`}
                              href={article.news_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-4 bg-secondary/50 rounded-lg border border-border hover:border-primary/40 transition-colors group"
                            >
                              <div className="flex gap-4">
                                {article.image_url && (
                                  <div className="w-24 h-16 rounded overflow-hidden shrink-0 bg-secondary">
                                    <img
                                      src={article.image_url}
                                      alt=""
                                      className="w-full h-full object-cover"
                                      onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none' }}
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                    {article.title}
                                  </h4>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <div className="w-4 h-4 rounded bg-secondary flex items-center justify-center">
                                        <FileText className="h-2.5 w-2.5" />
                                      </div>
                                      {article.source_name}
                                    </span>
                                    <span>{new Date(article.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                                  </div>
                                </div>
                                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                              </div>
                            </a>
                          ))}
                          
                          <Link
                            href={`/news?tickers=${coin.symbol.toUpperCase()}`}
                            className="flex items-center justify-center gap-2 py-3 text-sm text-primary hover:bg-secondary rounded-lg transition-colors"
                          >
                            View all {coin.name} news
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Newspaper className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No recent news found for {coin.name}</p>
                          <Link 
                            href={`/news?search=${encodeURIComponent(coin.name)}`}
                            className="text-sm text-primary hover:underline mt-2 inline-block"
                          >
                            Search all news
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "about" && (
                    <div>
                      <h3 className="text-base font-semibold text-foreground mb-4">
                        About {coin.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {coin.name} ({coin.symbol.toUpperCase()}) is currently ranked #{coin.market_cap_rank} by market capitalization. 
                        The current price is ${coin.current_price?.toLocaleString(undefined, { maximumFractionDigits: coin.current_price > 1 ? 2 : 6 })} 
                        with a 24-hour trading volume of {coin.total_volume ? fmt(coin.total_volume) : "N/A"}.
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {coin.circulating_supply 
                          ? `There are ${fmtSupply(coin.circulating_supply)} ${coin.symbol.toUpperCase()} coins currently in circulation${coin.max_supply ? ` out of a maximum supply of ${fmtSupply(coin.max_supply)}` : ""}.`
                          : "Supply information is not available."
                        }
                      </p>
                      
                      <div className="mt-6 p-4 bg-secondary/50 rounded-lg border border-border">
                        <p className="text-xs text-muted-foreground">
                          Data provided by the CoinGecko API, cached for up to 15 minutes.
                          This is not financial advice.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  )
}
