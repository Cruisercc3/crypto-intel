import { NextResponse } from 'next/server'

// CoinGecko free API for global market data
const COINGECKO_API = 'https://api.coingecko.com/api/v3'

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
  updated: string
}

// In-memory cache to absorb repeated calls
let cachedStats: MarketStats | null = null
let statsCacheTime = 0
const STATS_CACHE_TTL = 600_000 // 10 minutes

async function fearAndGreed(): Promise<{ value: number | null; label: string | null }> {
  try {
    const fgResponse = await fetch('https://api.alternative.me/fng/?limit=1', {
      next: { revalidate: 300 },
    })
    if (!fgResponse.ok) return { value: null, label: null }
    const fgData = await fgResponse.json()
    const value = parseInt(fgData.data?.[0]?.value ?? '', 10)
    return Number.isFinite(value)
      ? { value, label: fgData.data?.[0]?.value_classification || null }
      : { value: null, label: null }
  } catch (e) {
    console.error('[market-stats] Fear & Greed API error:', e)
    return { value: null, label: null }
  }
}

function unavailable() {
  // No made-up numbers: with no live data and no cache, say so.
  return NextResponse.json({ error: 'Market data is unavailable right now' }, { status: 503 })
}

// After a failed call, wait a minute before asking CoinGecko again
let lastFailure = 0
const RETRY_AFTER = 60_000

export async function GET() {
  if (cachedStats && Date.now() - statsCacheTime < STATS_CACHE_TTL) {
    return NextResponse.json({ ...cachedStats, cached: true })
  }
  if (Date.now() - lastFailure < RETRY_AFTER) {
    return cachedStats ? NextResponse.json({ ...cachedStats, cached: true, stale: true }) : unavailable()
  }

  try {
    const response = await fetch(`${COINGECKO_API}/global`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 600 },
    })

    if (!response.ok) {
      lastFailure = Date.now()
      console.warn(`[market-stats] CoinGecko global returned ${response.status}, serving cache if there is one`)
      if (cachedStats) return NextResponse.json({ ...cachedStats, cached: true, stale: true })
      return unavailable()
    }

    const globalData = await response.json()
    const data = globalData.data
    const fg = await fearAndGreed()

    const stats: MarketStats = {
      totalMarketCap: data.total_market_cap?.usd || 0,
      totalVolume24h: data.total_volume?.usd || 0,
      btcDominance: data.market_cap_percentage?.btc || 0,
      ethDominance: data.market_cap_percentage?.eth || 0,
      activeCryptos: data.active_cryptocurrencies || 0,
      markets: data.markets || 0,
      fearGreedIndex: fg.value,
      fearGreedLabel: fg.label,
      marketCapChange24h: data.market_cap_change_percentage_24h_usd || 0,
      updated: new Date().toISOString(),
    }

    cachedStats = stats
    statsCacheTime = Date.now()

    return NextResponse.json(stats)
  } catch (error) {
    lastFailure = Date.now()
    console.error('[market-stats] Error fetching market stats:', error)
    if (cachedStats) return NextResponse.json({ ...cachedStats, cached: true, stale: true })
    return unavailable()
  }
}
