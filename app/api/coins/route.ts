import { NextResponse } from 'next/server'
import { MAX_COINS } from '@/lib/site'

type Coin = Record<string, unknown> & {
  id: string
  sparkline_in_7d?: { price: number[] }
}

// In-memory cache so repeated renders within the same server instance reuse data
let cachedCoins: Coin[] = []
let cacheTime = 0
const CACHE_TTL = 900_000 // 15 minutes (aggressive caching to stay within free tier limits)

// CoinGecko free tier: max 250 per page, ~10-30 calls/min.
// 500 coins = 2 pages of 250 (a third page consistently rate-limits).
const PAGE_SIZE = 250
const MAX_PAGES = Math.ceil(MAX_COINS / PAGE_SIZE)

// Rate limit tracking
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 5000 // 5 seconds between requests
let isFetching = false // Prevent concurrent fetches
let lastFailure = 0
const RETRY_AFTER = 60_000

// CoinGecko sends 168 hourly prices for the 7-day sparkline. Every second point
// (84, one per 2 hours) is plenty for a sparkline and halves the payload.
function slimSparkline(prices: unknown): number[] | undefined {
  if (!Array.isArray(prices) || prices.length < 2) return undefined
  const out: number[] = []
  for (let i = 0; i < prices.length; i += 2) {
    const v = Number(prices[i])
    if (Number.isFinite(v)) out.push(Number(v.toPrecision(6)))
  }
  const last = Number(prices[prices.length - 1])
  if (prices.length % 2 === 0 && Number.isFinite(last)) out.push(Number(last.toPrecision(6)))
  return out.length >= 2 ? out : undefined
}

async function fetchPage(page: number, retries = 3): Promise<Coin[]> {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(r => setTimeout(r, MIN_REQUEST_INTERVAL - timeSinceLastRequest))
  }
  lastRequestTime = Date.now()

  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${PAGE_SIZE}&page=${page}&sparkline=true&price_change_percentage=24h,7d,30d`

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 900 },
      })

      if (res.status === 429) {
        const waitTime = Math.min(2000 * Math.pow(2, attempt + 1), 30000)
        console.warn(`[coins] Rate limited on page ${page}, waiting ${waitTime}ms (attempt ${attempt + 1}/${retries})`)
        await new Promise(r => setTimeout(r, waitTime))
        continue
      }

      if (!res.ok) {
        console.error(`[coins] Error fetching page ${page}: ${res.status}`)
        return []
      }

      const data = await res.json()
      if (!Array.isArray(data)) return []
      return data.map((c: Coin) => ({
        ...c,
        sparkline_in_7d: c.sparkline_in_7d ? { price: slimSparkline(c.sparkline_in_7d.price) ?? [] } : undefined,
      }))
    } catch (err) {
      console.error(`[coins] Fetch error on page ${page}:`, err)
      if (attempt < retries - 1) {
        await new Promise(r => setTimeout(r, 2000 * (attempt + 1)))
      }
    }
  }

  return []
}

async function fetchAllCoins(): Promise<Coin[]> {
  const allCoins: Coin[] = []
  for (let page = 1; page <= MAX_PAGES; page++) {
    const pageCoins = await fetchPage(page)
    if (pageCoins.length === 0) {
      console.warn(`[coins] Stopped at page ${page} due to empty response or rate limit`)
      break
    }
    allCoins.push(...pageCoins)
    console.log(`[coins] Fetched page ${page}/${MAX_PAGES}, total: ${allCoins.length}`)
  }
  return allCoins
}

function respond(coins: Coin[], searchParams: URLSearchParams, extra: Record<string, unknown> = {}) {
  const requested = parseInt(searchParams.get('per_page') || '100', 10)
  const requestedCount = Math.min(Number.isNaN(requested) ? 100 : Math.max(1, requested), MAX_COINS)
  const withSparkline = searchParams.get('sparkline') === '1'
  const id = searchParams.get('id')

  const pick = (c: Coin) => {
    if (withSparkline) return c
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { sparkline_in_7d, ...rest } = c
    return rest
  }

  if (id) {
    const coin = coins.find(c => c.id === id)
    return NextResponse.json(
      { coin: coin ? pick(coin) : null, total: coins.length, timestamp: cacheTime, ...extra },
      { status: coin ? 200 : 404 }
    )
  }

  return NextResponse.json({
    coins: coins.slice(0, requestedCount).map(pick),
    total: coins.length,
    timestamp: cacheTime,
    ...extra,
  })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Return cached data if fresh
  if (cachedCoins.length > 0 && Date.now() - cacheTime < CACHE_TTL) {
    return respond(cachedCoins, searchParams, { cached: true })
  }

  // Prevent concurrent fetches - return stale cache if currently fetching
  if (isFetching && cachedCoins.length > 0) {
    return respond(cachedCoins, searchParams, { cached: true, fetching: true })
  }

  // After a fetch that got nothing, wait a minute before trying CoinGecko again
  if (Date.now() - lastFailure < RETRY_AFTER) {
    if (cachedCoins.length > 0) return respond(cachedCoins, searchParams, { cached: true, stale: true })
    return NextResponse.json({ coins: [], total: 0, error: 'Unable to fetch coins data' }, { status: 503 })
  }

  try {
    isFetching = true
    const coins = await fetchAllCoins()
    isFetching = false

    if (coins.length > 0) {
      cachedCoins = coins
      cacheTime = Date.now()
      console.log(`[coins] Cache updated with ${coins.length} coins`)
      return respond(coins, searchParams)
    }

    lastFailure = Date.now()
    if (cachedCoins.length > 0) {
      console.log('[coins] Fetch failed, using stale cache')
      return respond(cachedCoins, searchParams, { cached: true, stale: true })
    }

    return NextResponse.json({ coins: [], total: 0, error: 'Unable to fetch coins data' }, { status: 503 })
  } catch (err) {
    isFetching = false
    lastFailure = Date.now()
    console.error('[coins] fetch error:', err)
    if (cachedCoins.length > 0) {
      return respond(cachedCoins, searchParams, { cached: true, stale: true })
    }
    return NextResponse.json({ coins: [], total: 0, error: 'Failed to fetch coins' }, { status: 500 })
  }
}
