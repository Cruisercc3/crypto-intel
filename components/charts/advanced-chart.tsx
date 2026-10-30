"use client"

import { useEffect, useRef, memo } from "react"

interface AdvancedChartProps {
  symbol?: string
  height?: number
  className?: string
}

// Full TradingView advanced chart with all features
function AdvancedChartComponent({ 
  symbol = "BINANCE:BTCUSDT", 
  height = 400,
  className = ""
}: AdvancedChartProps) {
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
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: "60",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "rgba(0, 0, 0, 0)",
      gridColor: "rgba(255, 255, 255, 0.06)",
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: false,
      save_image: false,
      calendar: false,
      hide_volume: false,
      support_host: "https://www.tradingview.com",
      withdateranges: true,
      range: "1D",
      details: false,
      hotlist: false,
      show_popup_button: false,
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
      className={`overflow-hidden rounded-lg border border-border ${className}`}
      style={{ height: `${height}px` }}
    />
  )
}

export const AdvancedChart = memo(AdvancedChartComponent)
