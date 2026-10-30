"use client"

import useSWR from 'swr'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { useNews } from '@/hooks/use-news'

interface MarketStats {
  totalMarketCap: number
  totalVolume24h: number
  btcDominance: number
  ethDominance: number
  activeCryptos: number
  markets: number
  fearGreedIndex: number | null
  fearGreedLabel: string | null
  marketCapChange24h: number
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`)
  return json
}

function formatLargeNumber(num: number): string {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
  return `$${(num / 1e6).toFixed(2)}M`
}

export function StatsBar() {
  const { data, error, isLoading } = useSWR<MarketStats>('/api/market-stats', fetcher, {
    refreshInterval: 60000, // Refresh every minute
    revalidateOnFocus: false,
  })
  const { sources } = useNews()
  const liveFeeds = sources.filter(s => s.ok).length

  if (error && !data) {
    return (
      <div className="bg-background border-b border-border">
        <div className="mx-auto max-w-[1800px] px-4">
          <div className="flex items-center h-8 gap-2 text-xs font-mono text-muted-foreground">
            Market data is unavailable right now.
            <Link href="/status" className="text-primary hover:underline">Status</Link>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading || !data) {
    return (
      <div className="bg-background border-b border-border">
        <div className="mx-auto max-w-[1800px] px-4">
          <div className="flex items-center h-8 gap-6 text-xs font-mono">
            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">Loading market data...</span>
          </div>
        </div>
      </div>
    )
  }

  const getFearGreedColor = (value: number) => {
    if (value >= 75) return 'text-bullish'
    if (value >= 55) return 'text-bullish/80'
    if (value >= 45) return 'text-muted-foreground'
    if (value >= 25) return 'text-bearish/80'
    return 'text-bearish'
  }

  const stats: { label: string; value: string; change?: number; extra?: string; extraColor?: string; href?: string }[] = [
    { label: "Coins", value: data.activeCryptos.toLocaleString() },
    ...(sources.length > 0
      ? [{ label: "Feeds", value: `${liveFeeds} of ${sources.length} live`, href: "/status" }]
      : []),
    { label: "Market Cap", value: formatLargeNumber(data.totalMarketCap), change: data.marketCapChange24h },
    { label: "24h Vol", value: formatLargeNumber(data.totalVolume24h) },
    { label: "BTC Dom", value: `${data.btcDominance.toFixed(1)}%` },
    { label: "ETH Dom", value: `${data.ethDominance.toFixed(1)}%` },
    data.fearGreedIndex !== null
      ? { label: "Fear/Greed", value: data.fearGreedIndex.toString(), extra: data.fearGreedLabel ?? undefined, extraColor: getFearGreedColor(data.fearGreedIndex) }
      : { label: "Fear/Greed", value: "n/a" },
  ]

  return (
    <div className="bg-background border-b border-border">
      <div className="mx-auto max-w-[1800px] px-4">
        <div className="flex items-center h-8 gap-6 overflow-x-auto text-xs font-mono">
          {stats.map((stat, i) => {
            const body = (
              <>
                <span className="text-muted-foreground">{stat.label}:</span>
                <span className="text-foreground font-medium">{stat.value}</span>
                {stat.change !== undefined && (
                  <span className={stat.change >= 0 ? 'text-bullish' : 'text-bearish'}>
                    {stat.change >= 0 ? '+' : ''}{stat.change.toFixed(1)}%
                  </span>
                )}
                {stat.extra && (
                  <span className={stat.extraColor || 'text-bullish'}>{stat.extra}</span>
                )}
                {i < stats.length - 1 && (
                  <span className="ml-4 text-border">|</span>
                )}
              </>
            )
            return stat.href ? (
              <Link key={stat.label} href={stat.href} className="flex items-center gap-1.5 shrink-0 hover:underline">
                {body}
              </Link>
            ) : (
              <div key={stat.label} className="flex items-center gap-1.5 shrink-0">
                {body}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
