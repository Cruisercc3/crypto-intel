"use client"

import { useState } from "react"
import { TrendingTickers } from "./trending-tickers"

type TimePeriod = "24h" | "7d" | "30d"

export function TrendingTickersWrapper() {
  const [period, setPeriod] = useState<TimePeriod>("24h")

  return (
    <div className="space-y-4">
      {/* Time period selector */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setPeriod("24h")}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            period === "24h"
              ? "text-primary bg-primary/10 border border-primary/30"
              : "text-muted-foreground bg-secondary hover:text-foreground"
          }`}
        >
          24H
        </button>
        <button
          onClick={() => setPeriod("7d")}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            period === "7d"
              ? "text-primary bg-primary/10 border border-primary/30"
              : "text-muted-foreground bg-secondary hover:text-foreground"
          }`}
        >
          7D
        </button>
        <button
          onClick={() => setPeriod("30d")}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            period === "30d"
              ? "text-primary bg-primary/10 border border-primary/30"
              : "text-muted-foreground bg-secondary hover:text-foreground"
          }`}
        >
          30D
        </button>
      </div>

      <TrendingTickers period={period} />
    </div>
  )
}
