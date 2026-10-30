import { NextResponse } from 'next/server'
import { AI_MODEL, RSS_FEEDS } from '@/lib/site'

// Live checks of every upstream the site depends on. Nothing here is stored,
// so there's no uptime history, only what answered just now.

type Status = 'operational' | 'down' | 'not configured' | 'not checked'

interface ServiceStatus {
  name: string
  group: 'News feeds' | 'Market data' | 'AI'
  status: Status
  detail: string
}

let cached: { at: number; body: { checked: string; services: ServiceStatus[] } } | null = null
const CACHE_TTL = 60_000

async function checkFeed(name: string, url: string): Promise<ServiceStatus> {
  try {
    // Same request options as /api/news, so this shares its 5-minute cache.
    const res = await fetch(url, {
      next: { revalidate: 300 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CryptoIntel/1.0)' },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return { name, group: 'News feeds', status: 'down', detail: `HTTP ${res.status}` }
    const xml = await res.text()
    const items = (xml.match(/<item>/gi) || []).length
    return items > 0
      ? { name, group: 'News feeds', status: 'operational', detail: `${items} items in feed` }
      : { name, group: 'News feeds', status: 'down', detail: 'Feed answered with no items' }
  } catch (err) {
    return { name, group: 'News feeds', status: 'down', detail: (err as Error).name === 'TimeoutError' ? 'Timed out' : 'Request failed' }
  }
}

async function checkJSON(name: string, group: ServiceStatus['group'], url: string, revalidate: number, ok: (j: unknown) => string | null): Promise<ServiceStatus> {
  try {
    const res = await fetch(url, { next: { revalidate }, signal: AbortSignal.timeout(10_000) })
    if (!res.ok) return { name, group, status: 'down', detail: `HTTP ${res.status}` }
    const detail = ok(await res.json())
    return detail ? { name, group, status: 'operational', detail } : { name, group, status: 'down', detail: 'Unexpected response' }
  } catch {
    return { name, group, status: 'down', detail: 'Request failed' }
  }
}

async function checkGroq(): Promise<ServiceStatus> {
  const name = `Groq (${AI_MODEL})`
  const key = process.env.GROQ_API_KEY
  if (!key) return { name, group: 'AI', status: 'not configured', detail: 'No API key on this deployment' }
  try {
    // Lists models. This costs nothing and confirms the key and the model are both valid.
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: `Bearer ${key}` },
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return { name, group: 'AI', status: 'down', detail: `HTTP ${res.status}` }
    const json = await res.json()
    const found = Array.isArray(json.data) && json.data.some((m: { id: string }) => m.id === AI_MODEL)
    return found
      ? { name, group: 'AI', status: 'operational', detail: 'Key valid, model available' }
      : { name, group: 'AI', status: 'down', detail: 'Model not available to this key' }
  } catch {
    return { name, group: 'AI', status: 'down', detail: 'Request failed' }
  }
}

// Same request /api/news makes, so it shares that route's 2-minute cache
async function checkCryptoNews(key: string): Promise<ServiceStatus> {
  const name = 'CryptoNews API (optional)'
  try {
    const res = await fetch(`https://cryptonews-api.com/api/v1?tickers=${encodeURIComponent('BTC,ETH,SOL,XRP,ADA')}&items=3&page=1&token=${key}`, {
      next: { revalidate: 120 },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return { name, group: 'News feeds', status: 'down', detail: `HTTP ${res.status}. The other feeds cover for it` }
    const json = await res.json()
    const n = Array.isArray(json.data) ? json.data.length : 0
    return { name, group: 'News feeds', status: n > 0 ? 'operational' : 'down', detail: `${n} items` }
  } catch {
    return { name, group: 'News feeds', status: 'down', detail: 'Request failed' }
  }
}

export async function GET() {
  if (cached && Date.now() - cached.at < CACHE_TTL) {
    return NextResponse.json({ ...cached.body, cached: true })
  }

  const services = await Promise.all([
    ...RSS_FEEDS.map(f => checkFeed(f.name, f.url)),
    checkJSON('CoinGecko', 'Market data', 'https://api.coingecko.com/api/v3/ping', 60, j =>
      (j as { gecko_says?: string })?.gecko_says ? 'API answering' : null
    ),
    checkJSON('alternative.me Fear & Greed', 'Market data', 'https://api.alternative.me/fng/?limit=1', 300, j => {
      const v = (j as { data?: { value?: string }[] })?.data?.[0]?.value
      return v ? `Today's index: ${v}` : null
    }),
    checkGroq(),
  ])

  if (process.env.CRYPTONEWS_API_KEY) {
    services.splice(RSS_FEEDS.length, 0, await checkCryptoNews(process.env.CRYPTONEWS_API_KEY))
  }

  const body = { checked: new Date().toISOString(), services }
  cached = { at: Date.now(), body }
  return NextResponse.json(body)
}
