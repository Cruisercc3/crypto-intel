"use client"

import { useState } from "react"
import useSWR from "swr"
import { Loader2 } from "lucide-react"
import { MiniCandlestickChart } from "@/components/charts/mini-candlestick-chart"

const timeframes = { "7D": 7, "14D": 14, "30D": 30 } as const
type Timeframe = keyof typeof timeframes

interface Point {
  date: string
  value: number
  label: string
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`)
  return json
}

function shortDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
}

// The site keeps no history of its own, so the trend line is the daily Crypto
// Fear & Greed Index from alternative.me, which is on the same 0-100 scale.
export function SentimentHistory() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>("7D")
  const { data: json, error, isLoading } = useSWR<{ points: Point[] }>("/api/fear-greed?days=30", fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 3_600_000,
  })

  const all = json?.points ?? []
  const data = all.slice(-timeframes[selectedTimeframe])
  const latest = data[data.length - 1]

  const width = 100
  const height = 50
  const padding = 2
  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(1, data.length - 1)) * (width - 2 * padding)
    // fixed 0-100 scale so the dashed line really is 50
    const y = height - padding - (d.value / 100) * (height - 2 * padding)
    return `${x},${y}`
  })
  const pathD = points.length > 1 ? `M ${points.join(" L ")}` : ""
  const areaD = pathD ? `${pathD} L ${width - padding},${height - padding} L ${padding},${height - padding} Z` : ""

  return (
    <div className="bg-card border border-border rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-1 gap-3">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">Sentiment History</h3>

        <div className="flex gap-0.5 bg-secondary rounded p-0.5">
          {(Object.keys(timeframes) as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-2 py-1 text-[10px] font-medium rounded transition-colors ${
                selectedTimeframe === tf
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground mb-4">
        Crypto Fear &amp; Greed Index, daily, from alternative.me
        {latest ? ` · today ${latest.value} (${latest.label})` : ""}
      </p>

      {/* Chart */}
      <div className="relative h-40 mb-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-[10px] text-muted-foreground py-1">
          <span>100</span>
          <span>50</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="absolute left-10 right-0 top-0 bottom-0">
          <div className="absolute inset-0 flex flex-col justify-between">
            <div className="border-t border-border" />
            <div className="border-t border-dashed border-primary/30" />
            <div className="border-t border-border" />
          </div>

          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : error || !pathD ? (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
              Fear &amp; Greed history is unavailable right now
            </div>
          ) : (
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox={`0 0 ${width} ${height}`}
              preserveAspectRatio="none"
              role="img"
              aria-label={`Fear and Greed Index over ${data.length} days`}
            >
              <path d={areaD} fill="currentColor" className="text-primary/10" />
              <path
                d={pathD}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          )}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between text-[10px] text-muted-foreground pl-10">
        {data.length > 1 && (
          <>
            <span>{shortDate(data[0].date)}</span>
            <span>{shortDate(data[data.length - 1].date)}</span>
          </>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center gap-4 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span>Index (0 extreme fear, 100 extreme greed)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-0.5 w-4 border-t border-dashed border-primary/50" />
          <span>Neutral (50)</span>
        </div>
      </div>

      {/* BTC Market Context */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">BTC Market Context</span>
          <span className="text-[10px] text-muted-foreground">TradingView</span>
        </div>
        <MiniCandlestickChart symbol="BINANCE:BTCUSDT" height={100} />
      </div>
    </div>
  )
}
