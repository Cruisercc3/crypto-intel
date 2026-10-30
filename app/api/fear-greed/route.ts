import { NextResponse } from 'next/server'

// Daily Crypto Fear & Greed Index from alternative.me, oldest first.
// Free, no key, updated once a day.

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const days = Math.min(90, Math.max(2, parseInt(searchParams.get('days') || '30', 10) || 30))

  try {
    const res = await fetch(`https://api.alternative.me/fng/?limit=${days}`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) {
      return NextResponse.json({ error: `Fear & Greed source returned HTTP ${res.status}` }, { status: 502 })
    }
    const json = await res.json()
    const points = (json.data || [])
      .map((d: { value: string; value_classification: string; timestamp: string }) => ({
        date: new Date(parseInt(d.timestamp, 10) * 1000).toISOString().slice(0, 10),
        value: parseInt(d.value, 10),
        label: d.value_classification,
      }))
      .filter((p: { value: number }) => Number.isFinite(p.value))
      .reverse()

    return NextResponse.json({ points, source: 'alternative.me' })
  } catch (error) {
    console.error('[fear-greed] fetch failed:', error)
    return NextResponse.json({ error: 'Fear & Greed history is unavailable right now' }, { status: 502 })
  }
}
