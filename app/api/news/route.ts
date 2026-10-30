import { NextResponse } from 'next/server'
import { RSS_FEEDS } from '@/lib/site'
import { SECTION_KEYWORDS } from '@/lib/sections'
import { buildWordMatcher, countWordMatches, decodeHtmlEntities } from '@/lib/text'

const CRYPTONEWS_API_KEY = process.env.CRYPTONEWS_API_KEY

interface NormalizedArticle {
  news_url: string
  image_url: string
  title: string
  text: string
  source_name: string
  date: string
  topics: string[]
  sentiment: string
  type: string
  tickers: string[]
}

interface FeedStatus {
  name: string
  ok: boolean
  count: number
  error?: string
}

// Extract text content from an XML tag (handles CDATA and plain text)
function extractTag(xml: string, tag: string): string {
  const cdataMatch = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i'))
  if (cdataMatch) return cdataMatch[1].trim()
  const plainMatch = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))
  if (plainMatch) return plainMatch[1].trim()
  return ''
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, 'i'))
  return match ? match[1] : ''
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

// Keyword sentiment on the headline. It's a first pass that runs on every
// article for free. The AI analysis runs on request.
const BULLISH = ['surge', 'soar', 'rally', 'rallies', 'gain', 'rise', 'rising', 'bull*', 'high', 'highs', 'record', 'pump', 'boost', 'growth', 'adoption', 'launch', 'breakout', 'milestone', 'beat', 'approv*', 'inflow', 'up', 'jump', 'climb*']
const BEARISH = ['crash', 'drop*', 'fall', 'falling', 'fell', 'plunge', 'bear*', 'low', 'lows', 'hack*', 'exploit*', 'ban', 'dump', 'loss', 'losses', 'fear', 'warning', 'warn', 'risk', 'concern', 'collapse', 'liquidat*', 'fraud', 'scam', 'down', 'outflow', 'sell-off', 'selloff', 'slump', 'tumble', 'lawsuit']

function guessSentiment(title: string): string {
  const b = countWordMatches(title, BULLISH)
  const br = countWordMatches(title, BEARISH)
  return b > br ? 'Positive' : br > b ? 'Negative' : 'Neutral'
}

// Each ticker is found by its project name (any case) or its symbol written in
// capitals ("LINK", "NEAR"). Lower-case symbols are skipped because words like
// "link", "near" and "dot" are ordinary English.
const TICKER_NAMES: Record<string, string[]> = {
  BTC: ['bitcoin'],
  ETH: ['ethereum', 'ether'],
  SOL: ['solana'],
  XRP: ['xrp', 'ripple'],
  ADA: ['cardano'],
  DOGE: ['dogecoin'],
  AVAX: ['avalanche'],
  DOT: ['polkadot'],
  LINK: ['chainlink'],
  POL: ['polygon'],
  MATIC: ['matic'],
  BNB: ['bnb chain'],
  ATOM: ['cosmos'],
  UNI: ['uniswap'],
  NEAR: ['near protocol'],
  LTC: ['litecoin'],
  SHIB: ['shiba inu'],
  TRX: ['tron'],
  TON: ['toncoin'],
  ARB: ['arbitrum'],
  OP: ['optimism'],
  APT: ['aptos'],
  SUI: ['sui'],
  FIL: ['filecoin'],
  AAVE: ['aave'],
  MKR: ['makerdao'],
  INJ: ['injective'],
  FET: ['fetch.ai'],
  RENDER: ['render network'],
  TAO: ['bittensor'],
  PEPE: ['pepe'],
  WIF: ['dogwifhat'],
  HYPE: ['hyperliquid'],
}

const TICKER_MATCHERS = Object.entries(TICKER_NAMES).map(([ticker, names]) => ({
  ticker,
  byName: buildWordMatcher(names),
  bySymbol: new RegExp(`(?:^|[^A-Za-z0-9$])\\$?${ticker}(?![A-Za-z0-9])`),
}))

function detectTickers(text: string): string[] {
  return TICKER_MATCHERS
    .filter(({ byName, bySymbol }) => byName.test(text) || bySymbol.test(text))
    .map(({ ticker }) => ticker)
    .slice(0, 6)
}

const SECTION_MATCHERS: Record<string, RegExp> = Object.fromEntries(
  Object.entries(SECTION_KEYWORDS).map(([slug, words]) => [slug, buildWordMatcher(words)])
)

function parseRSS(xml: string, sourceName: string): NormalizedArticle[] {
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  const items: NormalizedArticle[] = []
  let match

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]
    const title = decodeHtmlEntities(stripTags(extractTag(block, 'title')))
    if (!title) continue

    // link tag in RSS is often plain text between tags, not an attribute
    let link = extractTag(block, 'link')
    if (!link) link = extractAttr(block, 'link', 'href')

    const pubDate = extractTag(block, 'pubDate') || extractTag(block, 'dc:date') || extractTag(block, 'published')
    const description = extractTag(block, 'description') || extractTag(block, 'content:encoded') || extractTag(block, 'summary')

    let image = extractAttr(block, 'media:content', 'url') ||
      extractAttr(block, 'media:thumbnail', 'url') ||
      extractAttr(block, 'enclosure', 'url') ||
      ''
    if (!image) {
      const imgMatch = description.match(/<img[^>]+src="([^"]+)"/)
      if (imgMatch) image = imgMatch[1]
    }

    const text = decodeHtmlEntities(stripTags(description)).slice(0, 400)
    const tickers = detectTickers(title + ' ' + text)

    let parsedDate = new Date().toISOString()
    const d = pubDate ? new Date(pubDate) : null
    if (d && !isNaN(d.getTime())) parsedDate = d.toISOString()

    items.push({
      news_url: decodeHtmlEntities(link),
      image_url: decodeHtmlEntities(image),
      title,
      text,
      source_name: sourceName,
      date: parsedDate,
      topics: ['news'],
      sentiment: guessSentiment(title),
      type: 'article',
      tickers,
    })
  }

  return items
}

function normalizeCryptoNews(item: Record<string, unknown>): NormalizedArticle {
  const title = decodeHtmlEntities((item.title as string) || '')
  const text = decodeHtmlEntities((item.text as string) || '')
  const date = new Date((item.date as string) || '')
  return {
    news_url: (item.news_url as string) || '',
    image_url: (item.image_url as string) || '',
    title,
    text,
    source_name: (item.source_name as string) || 'CryptoNews',
    date: isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString(),
    topics: (item.topics as string[]) || [],
    sentiment: (item.sentiment as string) || guessSentiment(title),
    type: 'article',
    tickers: (item.tickers as string[]) || detectTickers(title + ' ' + text),
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') || '30', 10) || 30))
  const filterTicker = (searchParams.get('tickers') || '').toUpperCase().trim()
  const filterName = (searchParams.get('name') || '').trim()
  const search = (searchParams.get('search') || '').toLowerCase().trim()
  const section = (searchParams.get('section') || '').toLowerCase().trim()

  const allArticles: NormalizedArticle[] = []
  const sources: FeedStatus[] = []

  // 1. Public RSS feeds, fetched in parallel. One failing feed only costs its own articles.
  const rssResults = await Promise.allSettled(
    RSS_FEEDS.map(async ({ url, name }) => {
      const res = await fetch(url, {
        next: { revalidate: 300 },
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CryptoIntel/1.0)' },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const xml = await res.text()
      return parseRSS(xml, name)
    })
  )

  rssResults.forEach((result, i) => {
    const name = RSS_FEEDS[i].name
    if (result.status === 'fulfilled') {
      allArticles.push(...result.value)
      sources.push({ name, ok: result.value.length > 0, count: result.value.length })
    } else {
      const error = (result.reason as Error)?.message || 'failed'
      console.error(`[news] RSS feed failed: ${name}: ${error}`)
      sources.push({ name, ok: false, count: 0, error })
    }
  })

  // 2. CryptoNews API, optional. The trial key is capped at 3 items.
  if (CRYPTONEWS_API_KEY) {
    try {
      const tickerParam = filterTicker || 'BTC,ETH,SOL,XRP,ADA'
      const cnUrl = `https://cryptonews-api.com/api/v1?tickers=${encodeURIComponent(tickerParam)}&items=3&page=1&token=${CRYPTONEWS_API_KEY}`
      const cnRes = await fetch(cnUrl, { next: { revalidate: 120 } })
      if (cnRes.ok) {
        const cnData = await cnRes.json()
        const normalized: NormalizedArticle[] = (cnData.data || []).map(normalizeCryptoNews)
        const existingTitles = new Set(allArticles.map(a => a.title.toLowerCase()))
        let added = 0
        for (const article of normalized) {
          if (article.title && !existingTitles.has(article.title.toLowerCase())) {
            allArticles.unshift(article)
            added++
          }
        }
        sources.push({ name: 'CryptoNews API', ok: added > 0, count: added })
      } else {
        sources.push({ name: 'CryptoNews API', ok: false, count: 0, error: `HTTP ${cnRes.status}` })
      }
    } catch (err) {
      console.error('[news] CryptoNews error:', err)
      sources.push({ name: 'CryptoNews API', ok: false, count: 0, error: 'failed' })
    }
  }

  // Sort newest first
  allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  let filtered = allArticles

  if (filterTicker) {
    const known = TICKER_NAMES[filterTicker]
    const symbolRe = new RegExp(`(?:^|[^A-Za-z0-9$])\\$?${filterTicker.replace(/[^A-Z0-9]/g, '')}(?![A-Za-z0-9])`)
    const nameRe = filterName ? buildWordMatcher([filterName]) : null
    filtered = filtered.filter(a => {
      if (a.tickers.includes(filterTicker)) return true
      if (known) return false
      // Coins outside the ticker map: match the capitalised symbol or the coin's name.
      const body = a.title + ' ' + a.text
      return symbolRe.test(body) || (nameRe ? nameRe.test(body) : false)
    })
  }

  if (section && SECTION_MATCHERS[section]) {
    const re = SECTION_MATCHERS[section]
    filtered = filtered.filter(a => re.test(a.title + ' ' + a.text))
  }

  if (search) {
    filtered = filtered.filter(a =>
      a.title.toLowerCase().includes(search) || a.text.toLowerCase().includes(search)
    )
  }

  const start = (page - 1) * limit
  const paginated = filtered.slice(start, start + limit)

  console.log(`[news] pool=${allArticles.length} filtered=${filtered.length} page=${page} returning=${paginated.length}`)

  return NextResponse.json({
    data: paginated,
    total: filtered.length,
    total_pages: Math.max(1, Math.ceil(filtered.length / limit)),
    pool: allArticles.length,
    sources,
    updated: new Date().toISOString(),
  })
}
