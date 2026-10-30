"use client"

import { useNews } from "@/hooks/use-news"

// Shows when the news data on the page was last fetched by the server
export function UpdatedAt() {
  const { updated } = useNews({ limit: 200 })
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="w-2 h-2 bg-bullish rounded-full animate-pulse" />
      <span className="font-mono">
        {updated
          ? `Updated ${new Date(updated).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`
          : "Loading..."}
      </span>
    </div>
  )
}
