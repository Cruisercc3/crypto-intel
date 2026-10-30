"use client"

import { memo, useId, useMemo } from "react"

// Charts drawn from CoinGecko's 7-day sparkline (one price every 2 hours).
// Used where TradingView has no matching pair and for the small ticker lines.

function pathFor(data: number[], width: number, height: number, pad = 2) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = pad + (1 - (v - min) / range) * (height - pad * 2)
    return [x, y] as const
  })
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ")
  return { line, area: `${line} L${width},${height} L0,${height} Z`, last: pts[pts.length - 1], min, max }
}

function fmtPrice(v: number) {
  if (v >= 1000) return `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  if (v >= 1) return `$${v.toFixed(2)}`
  if (v >= 0.01) return `$${v.toFixed(4)}`
  return `$${v.toPrecision(3)}`
}

// Small line for tickers and cards
export function Sparkline({
  data,
  positive,
  className = "",
  width = 72,
  height = 24,
}: {
  data?: number[]
  positive: boolean
  className?: string
  width?: number
  height?: number
}) {
  const gid = useId()
  const shape = useMemo(() => (data && data.length > 1 ? pathFor(data, 100, 32) : null), [data])
  if (!shape) return <div style={{ width, height }} className={className} aria-hidden />
  const color = positive ? "text-bullish" : "text-bearish"
  return (
    <svg width={width} height={height} viewBox="0 0 100 32" preserveAspectRatio="none" className={`shrink-0 ${color} ${className}`} aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={shape.area} fill={`url(#${gid})`} />
      <path d={shape.line} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

interface SparklineChartProps {
  data: number[]
  height?: number
  className?: string
  coinName?: string
  currentPrice?: number
  priceChange?: number
}

// Full-width 7-day chart for the coin page
function SparklineChartComponent({ data, height = 400, className = "", coinName, currentPrice, priceChange = 0 }: SparklineChartProps) {
  const gid = useId()
  const shape = useMemo(() => (data && data.length > 1 ? pathFor(data, 1000, 300, 6) : null), [data])

  const days = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const d = new Date(Date.now() - (7 - i) * 86_400_000)
      return d.toLocaleDateString("en-US", { weekday: "short" })
    })
  }, [])

  if (!shape) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-muted-foreground text-sm">No chart data available</p>
      </div>
    )
  }

  const positive = priceChange >= 0
  const color = positive ? "text-bullish" : "text-bearish"
  const levels = [shape.max, (shape.max + shape.min) / 2, shape.min]

  return (
    <div className={`flex flex-col ${className}`} style={{ height }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-3 min-w-0">
          {coinName && <span className="text-sm font-medium text-foreground truncate">{coinName}</span>}
          <span className="text-xs text-muted-foreground">7 days, CoinGecko</span>
        </div>
        {currentPrice !== undefined && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm font-mono font-medium text-foreground">{fmtPrice(currentPrice)}</span>
            <span className={`text-xs font-mono ${color}`}>
              {positive ? "+" : ""}{priceChange.toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      <div className="relative flex-1 min-h-0 px-4 pt-4 pb-7">
        <div className="relative h-full mr-16">
          {levels.map((v, i) => (
            <div key={i} className="absolute left-0 right-0 border-t border-border/40" style={{ top: `${i * 50}%` }}>
              <span className="absolute -right-16 -translate-y-1/2 w-14 text-[10px] font-mono text-muted-foreground">{fmtPrice(v)}</span>
            </div>
          ))}
          <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className={`absolute inset-0 w-full h-full ${color}`}>
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={shape.area} fill={`url(#${gid})`} />
            <path d={shape.line} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="absolute left-0 right-0 -bottom-6 flex justify-between text-[10px] text-muted-foreground">
            {days.map((d, i) => <span key={i}>{d}</span>)}
          </div>
        </div>
      </div>
    </div>
  )
}

export const SparklineChart = memo(SparklineChartComponent)
