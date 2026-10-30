import { NextResponse } from 'next/server'
import { AIError, groqJSON } from '@/lib/groq'

interface Analysis {
  sentiment: 'bullish' | 'bearish' | 'neutral'
  score: number
  confidence: number
  summary: string
  impactedAssets: string[]
  marketImpact: 'high' | 'medium' | 'low'
}

const SYSTEM = `You are a crypto market sentiment analyst. Analyze the given news and return ONLY a raw JSON object, no markdown and no code fences. The JSON must have exactly these keys:
- sentiment: "bullish" | "bearish" | "neutral"
- score: integer from -100 to 100
- confidence: integer from 0 to 100
- summary: 1-2 sentence analysis
- impactedAssets: array of ticker strings
- marketImpact: "high" | "medium" | "low"`

const clamp = (n: unknown, lo: number, hi: number, fallback: number) => {
  const v = Math.round(Number(n))
  return Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : fallback
}

export async function POST(request: Request) {
  let body: { title?: string; text?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Send JSON with a title.' }, { status: 400 })
  }

  const title = (body.title || '').toString().slice(0, 500)
  if (!title) {
    return NextResponse.json({ error: 'No title provided' }, { status: 400 })
  }
  const text = (body.text || '').toString().slice(0, 1500)

  try {
    const raw = await groqJSON<Partial<Analysis>>(SYSTEM, `Title: ${title}\n\nContent: ${text}`)
    const sentiment = ['bullish', 'bearish', 'neutral'].includes(raw.sentiment as string) ? raw.sentiment! : 'neutral'
    const analysis: Analysis = {
      sentiment,
      score: clamp(raw.score, -100, 100, 0),
      confidence: clamp(raw.confidence, 0, 100, 50),
      summary: typeof raw.summary === 'string' ? raw.summary : '',
      impactedAssets: Array.isArray(raw.impactedAssets) ? raw.impactedAssets.map(String).slice(0, 8) : [],
      marketImpact: ['high', 'medium', 'low'].includes(raw.marketImpact as string) ? raw.marketImpact! : 'low',
    }
    if (!analysis.summary) throw new AIError("The model's answer had no summary. Try again.")
    return NextResponse.json(analysis)
  } catch (error) {
    const status = error instanceof AIError ? error.status : 500
    const message = error instanceof AIError ? error.message : 'AI analysis failed.'
    if (!(error instanceof AIError)) console.error('[ai] Sentiment analysis error:', error)
    return NextResponse.json({ error: message }, { status })
  }
}
