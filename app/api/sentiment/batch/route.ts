import { NextResponse } from 'next/server'
import { AIError, groqJSON } from '@/lib/groq'

interface BatchAnalysis {
  overallSentiment: 'bullish' | 'bearish' | 'neutral'
  overallScore: number
  bullishPercent: number
  bearishPercent: number
  neutralPercent: number
  topThemes: string[]
  marketMood: string
  articles: { index: number; sentiment: string; score: number }[]
}

const SYSTEM = `You are a crypto market sentiment analyst. Analyze the given news headlines and return ONLY a raw JSON object, no markdown and no code fences. The JSON must have exactly these keys:
- overallSentiment: "bullish" | "bearish" | "neutral"
- overallScore: integer from -100 to 100
- bullishPercent: integer 0-100
- bearishPercent: integer 0-100
- neutralPercent: integer 0-100 (bullish + bearish + neutral must equal 100)
- topThemes: array of 3-5 short theme strings taken from the headlines
- marketMood: short phrase (max 5 words)
- articles: array of { index: number, sentiment: "bullish"|"bearish"|"neutral", score: number }`

// The home page asks for the same headline set from every visitor, so answers
// are kept for 10 minutes per instance instead of calling the model each time.
const CACHE_TTL = 600_000
const cache = new Map<string, { at: number; value: BatchAnalysis & { analyzed: number } }>()

const num = (n: unknown, fallback = 0) => {
  const v = Math.round(Number(n))
  return Number.isFinite(v) ? v : fallback
}

export async function POST(request: Request) {
  let body: { articles?: { title?: string }[]; focus?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Send JSON with an articles array.' }, { status: 400 })
  }

  const { articles } = body
  if (!articles || !Array.isArray(articles) || articles.length === 0) {
    return NextResponse.json({ error: 'No articles provided' }, { status: 400 })
  }

  const limitedArticles = articles
    .map(a => (a?.title || '').toString().slice(0, 300))
    .filter(Boolean)
    .slice(0, 15)
  if (limitedArticles.length === 0) {
    return NextResponse.json({ error: 'No article titles provided' }, { status: 400 })
  }

  const focus = (body.focus || '').toString().slice(0, 40)
  const list = limitedArticles.map((t, i) => `${i + 1}. ${t}`).join('\n')
  const user = focus
    ? `These ${limitedArticles.length} headlines mention ${focus}. Judge the sentiment toward ${focus}:\n\n${list}`
    : `Analyze these ${limitedArticles.length} crypto news headlines:\n\n${list}`

  const cacheKey = user
  const hit = cache.get(cacheKey)
  if (hit && Date.now() - hit.at < CACHE_TTL) {
    return NextResponse.json({ ...hit.value, cached: true })
  }

  try {
    const raw = await groqJSON<Partial<BatchAnalysis>>(SYSTEM, user, 2000)

    let bullish = Math.max(0, num(raw.bullishPercent))
    let bearish = Math.max(0, num(raw.bearishPercent))
    let neutral = Math.max(0, num(raw.neutralPercent))
    const total = bullish + bearish + neutral
    if (total === 0) throw new AIError("The model's answer had no breakdown. Try again.")
    if (total !== 100) {
      bullish = Math.round((bullish / total) * 100)
      bearish = Math.round((bearish / total) * 100)
      neutral = 100 - bullish - bearish
    }

    const analysis: BatchAnalysis = {
      overallSentiment: ['bullish', 'bearish', 'neutral'].includes(raw.overallSentiment as string) ? raw.overallSentiment! : 'neutral',
      overallScore: Math.min(100, Math.max(-100, num(raw.overallScore))),
      bullishPercent: bullish,
      bearishPercent: bearish,
      neutralPercent: neutral,
      topThemes: Array.isArray(raw.topThemes) ? raw.topThemes.map(String).slice(0, 5) : [],
      marketMood: typeof raw.marketMood === 'string' ? raw.marketMood : '',
      articles: Array.isArray(raw.articles) ? raw.articles.slice(0, 15) : [],
    }
    const value = { ...analysis, analyzed: limitedArticles.length }
    cache.set(cacheKey, { at: Date.now(), value })
    if (cache.size > 50) cache.delete(cache.keys().next().value as string)
    return NextResponse.json(value)
  } catch (error) {
    const status = error instanceof AIError ? error.status : 500
    const message = error instanceof AIError ? error.message : 'AI analysis failed.'
    if (!(error instanceof AIError)) console.error('[ai] Batch sentiment error:', error)
    return NextResponse.json({ error: message }, { status })
  }
}
