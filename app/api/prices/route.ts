import { NextResponse } from 'next/server'

// CoinGecko free API for real-time prices
const COINGECKO_API = 'https://api.coingecko.com/api/v3'

// Map common symbols to CoinGecko IDs
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
  ATOM: 'cosmos',
  UNI: 'uniswap',
  AAVE: 'aave',
  NEAR: 'near',
  MATIC: 'polygon-ecosystem-token',
  POL: 'polygon-ecosystem-token',
  OP: 'optimism',
  ARB: 'arbitrum',
  DOGE: 'dogecoin',
  SHIB: 'shiba-inu',
  FET: 'fetch-ai',
  RENDER: 'render-token',
  IMX: 'immutable-x',
  LTC: 'litecoin',
  BCH: 'bitcoin-cash',
  TRX: 'tron',
  TON: 'the-open-network',
  PEPE: 'pepe',
  USDT: 'tether',
  USDC: 'usd-coin',
}

type Quote = { usd: number; usd_24h_change: number; usd_market_cap: number }

// In-memory cache per coin, so a request for 20 symbols isn't answered from a
// cache that only holds the 10 another component asked for.
const cache = new Map<string, { at: number; quote: Quote }>()
const CACHE_TTL = 300_000 // 5 minutes
let lastFetch = 0
let lastFailure = 0

function build(symbols: string[]) {
  return symbols
    .map(symbol => {
      const id = SYMBOL_TO_ID[symbol]
      const q = id ? cache.get(id)?.quote : undefined
      return { symbol, price: q?.usd || 0, change24h: q?.usd_24h_change || 0, marketCap: q?.usd_market_cap || 0 }
    })
    .filter(p => p.price > 0)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbolsParam = searchParams.get('symbols') || 'BTC,ETH,SOL,BNB,XRP,ADA,AVAX,DOT,LINK,DOGE'

  const symbols = symbolsParam.split(',').map(s => s.trim().toUpperCase()).filter(Boolean).slice(0, 50)
  const ids = [...new Set(symbols.map(s => SYMBOL_TO_ID[s]).filter(Boolean))]
  const now = Date.now()
  const missing = ids.filter(id => {
    const hit = cache.get(id)
    return !hit || now - hit.at > CACHE_TTL
  })

  // After a failed call, wait a minute before asking CoinGecko again
  if (missing.length === 0 || now - lastFailure < 60_000) {
    const prices = build(symbols)
    if (prices.length === 0) return NextResponse.json({ error: 'Failed to fetch prices', prices: [] }, { status: 503 })
    return NextResponse.json({ prices, timestamp: lastFetch, cached: true })
  }

  try {
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${missing.join(',')}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`,
      {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 300 },
      }
    )

    if (response.status === 429) {
      lastFailure = now
      console.warn('[prices] CoinGecko rate limited (429), returning cached data')
    } else if (!response.ok) {
      lastFailure = now
      console.error('[prices] CoinGecko API error:', response.status)
    } else {
      const data: Record<string, Quote> = await response.json()
      for (const [id, quote] of Object.entries(data)) {
        if (quote && typeof quote.usd === 'number') cache.set(id, { at: now, quote })
      }
      lastFetch = now
    }
  } catch (error) {
    lastFailure = now
    console.error('[prices] Error fetching prices:', error)
  }

  const prices = build(symbols)
  if (prices.length === 0) {
    return NextResponse.json({ error: 'Failed to fetch prices', prices: [] }, { status: 503 })
  }
  return NextResponse.json({ prices, timestamp: lastFetch })
}
