"use client"

import { usePrices, formatPrice } from "@/hooks/use-prices"
import { useWatchlist } from "@/hooks/use-watchlist"
import { TrendingUp, TrendingDown, Star, Loader2 } from "lucide-react"
import Link from "next/link"

const ALL_SYMBOLS = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA', 'AVAX', 'DOT', 'LINK', 'DOGE', 'NEAR', 'ATOM', 'UNI', 'AAVE', 'POL', 'ARB', 'OP', 'FET', 'RENDER', 'LTC']

const CRYPTO_NAMES: Record<string, string> = {
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  SOL: 'Solana',
  BNB: 'BNB',
  XRP: 'XRP',
  ADA: 'Cardano',
  AVAX: 'Avalanche',
  DOT: 'Polkadot',
  LINK: 'Chainlink',
  DOGE: 'Dogecoin',
  NEAR: 'NEAR Protocol',
  ATOM: 'Cosmos',
  UNI: 'Uniswap',
  AAVE: 'Aave',
  POL: 'Polygon',
  ARB: 'Arbitrum',
  OP: 'Optimism',
  FET: 'Fetch.ai',
  RENDER: 'Render',
  LTC: 'Litecoin',
}

const SYMBOL_TO_ID: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  BNB: 'binancecoin',
  XRP: 'ripple',
  ADA: 'cardano',
  AVAX: 'avalanche-2',
  DOT: 'polkadot',
  LINK: 'chainlink',
  DOGE: 'dogecoin',
  NEAR: 'near',
  ATOM: 'cosmos',
  UNI: 'uniswap',
  AAVE: 'aave',
  POL: 'polygon-ecosystem-token',
  ARB: 'arbitrum',
  OP: 'optimism',
  FET: 'fetch-ai',
  RENDER: 'render-token',
  LTC: 'litecoin',
}

type Price = { symbol: string; price: number; change24h: number }

function MoverRow({ asset, rank }: { asset: Price; rank: number }) {
  const watchlist = useWatchlist()
  const id = SYMBOL_TO_ID[asset.symbol] || asset.symbol.toLowerCase()
  const starred = watchlist.has(id)
  const up = asset.change24h >= 0

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 table-row-hover">
      <Link href={`/coin/${id}`} className="flex flex-1 min-w-0 items-center gap-3">
        <span className="text-xs text-muted-foreground w-4 font-mono">{rank}</span>
        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0">
          <span className="text-[10px] font-mono font-semibold text-foreground">
            {asset.symbol.slice(0, 2)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-foreground">{asset.symbol}</span>
            <span className="text-xs text-muted-foreground truncate">{CRYPTO_NAMES[asset.symbol] || asset.symbol}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-sm text-foreground">{formatPrice(asset.price)}</div>
          <div className={`font-mono text-xs ${up ? "text-bullish" : "text-bearish"}`}>
            {up ? "+" : ""}{asset.change24h.toFixed(2)}%
          </div>
        </div>
      </Link>
      <button
        onClick={() => watchlist.toggle(id)}
        aria-label={starred ? `Remove ${asset.symbol} from watchlist` : `Add ${asset.symbol} to watchlist`}
        aria-pressed={starred}
        className="p-1 text-muted-foreground hover:text-primary"
      >
        <Star className={`h-4 w-4 ${starred ? "fill-primary text-primary" : ""}`} />
      </button>
    </div>
  )
}

export function TopMovers() {
  const { prices, isLoading } = usePrices(ALL_SYMBOLS)

  if (isLoading && prices.length === 0) {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {[0, 1].map(i => (
          <div key={i} className="bg-card border border-border rounded-lg h-[300px] flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ))}
      </div>
    )
  }

  const sorted = [...prices].sort((a, b) => b.change24h - a.change24h)
  const gainers = sorted.slice(0, 5)
  const losers = [...sorted].reverse().slice(0, 5)

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Top Gainers */}
      <div className="bg-card border border-border rounded-lg">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-bullish" />
            Top Gainers
          </h3>
          <span className="text-xs text-muted-foreground">24h · {prices.length} large caps</span>
        </div>
        <div className="divide-y divide-border">
          {gainers.map((asset, i) => <MoverRow key={asset.symbol} asset={asset} rank={i + 1} />)}
        </div>
      </div>

      {/* Top Losers */}
      <div className="bg-card border border-border rounded-lg">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-bearish" />
            Top Losers
          </h3>
          <span className="text-xs text-muted-foreground">24h · {prices.length} large caps</span>
        </div>
        <div className="divide-y divide-border">
          {losers.map((asset, i) => <MoverRow key={asset.symbol} asset={asset} rank={i + 1} />)}
        </div>
      </div>
    </div>
  )
}
