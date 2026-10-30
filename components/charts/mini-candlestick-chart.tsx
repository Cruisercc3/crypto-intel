"use client"

import { useEffect, useRef, memo } from "react"

interface MiniCandlestickChartProps {
  symbol?: string
  height?: number
  className?: string
}

// Lightweight TradingView widget for mini candlestick charts
function MiniCandlestickChartComponent({ 
  symbol = "BINANCE:BTCUSDT", 
  height = 120,
  className = ""
}: MiniCandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clean up any existing widget
    if (widgetRef.current) {
      widgetRef.current.remove()
    }

    // Create widget container
    const widgetContainer = document.createElement("div")
    widgetContainer.className = "tradingview-widget-container"
    widgetContainer.style.height = `${height}px`
    widgetContainer.style.width = "100%"
    
    const widgetDiv = document.createElement("div")
    widgetDiv.className = "tradingview-widget-container__widget"
    widgetDiv.style.height = "100%"
    widgetDiv.style.width = "100%"
    
    widgetContainer.appendChild(widgetDiv)
    containerRef.current.appendChild(widgetContainer)
    widgetRef.current = widgetContainer

    // Create and load the TradingView script
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: "100%",
      height: height,
      locale: "en",
      dateRange: "1D",
      colorTheme: "dark",
      isTransparent: true,
      autosize: true,
      largeChartUrl: "",
      chartOnly: true,
      noTimeScale: false,
    })

    widgetContainer.appendChild(script)

    return () => {
      if (widgetRef.current && containerRef.current?.contains(widgetRef.current)) {
        widgetRef.current.remove()
      }
    }
  }, [symbol, height])

  return (
    <div 
      ref={containerRef} 
      className={`overflow-hidden rounded ${className}`}
      style={{ height: `${height}px` }}
    />
  )
}

export const MiniCandlestickChart = memo(MiniCandlestickChartComponent)
