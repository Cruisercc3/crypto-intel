"use client"

import useSWR from "swr"
import { CheckCircle2, AlertTriangle, Loader2, RefreshCw } from "lucide-react"

interface ServiceStatus {
  name: string
  group: string
  status: "operational" | "down" | "not configured" | "not checked"
  detail: string
}

interface StatusResponse {
  checked: string
  services: ServiceStatus[]
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Status check failed (HTTP ${res.status})`)
  return res.json()
}

const dot: Record<ServiceStatus["status"], string> = {
  operational: "bg-bullish",
  down: "bg-bearish",
  "not configured": "bg-yellow-500",
  "not checked": "bg-muted-foreground",
}

const pill: Record<ServiceStatus["status"], string> = {
  operational: "bg-bullish/10 text-bullish",
  down: "bg-bearish/10 text-bearish",
  "not configured": "bg-yellow-500/10 text-yellow-500",
  "not checked": "bg-secondary text-muted-foreground",
}

export function StatusBoard() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<StatusResponse>("/api/status", fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-muted-foreground gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        Checking each service...
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-6 rounded-lg border bg-bearish/5 border-bearish/20 text-sm text-bearish">
        The status check itself failed. {error instanceof Error ? error.message : ""}
      </div>
    )
  }

  const checked = data.services.filter(s => s.status === "operational" || s.status === "down")
  const down = data.services.filter(s => s.status === "down")
  const allUp = down.length === 0
  const groups = [...new Set(data.services.map(s => s.group))]

  return (
    <div>
      {/* Overall Status Banner */}
      <div className={`mb-8 p-6 rounded-lg border ${allUp ? "bg-bullish/5 border-bullish/20" : "bg-yellow-500/5 border-yellow-500/20"}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {allUp ? <CheckCircle2 className="w-6 h-6 text-bullish shrink-0" /> : <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0" />}
            <div>
              <h2 className={`font-semibold ${allUp ? "text-bullish" : "text-yellow-500"}`}>
                {allUp
                  ? `All ${checked.length} checked services are answering`
                  : `${down.length} of ${checked.length} checked services ${down.length === 1 ? "is" : "are"} down`}
              </h2>
              <p className="text-sm text-muted-foreground">
                Checked {new Date(data.checked).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}. Rechecks every minute.
              </p>
            </div>
          </div>
          <button
            onClick={() => mutate()}
            disabled={isValidating}
            aria-label="Check again"
            className="p-2 rounded bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isValidating ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {groups.map(group => (
        <section key={group} className="mb-8">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{group}</h3>
          <div className="space-y-3">
            {data.services.filter(s => s.group === group).map(service => (
              <div key={service.name} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-3 h-3 rounded-full shrink-0 ${dot[service.status]}`} />
                  <div className="min-w-0">
                    <h4 className="font-medium text-foreground truncate">{service.name}</h4>
                    <p className="text-xs text-muted-foreground">{service.detail}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 text-xs font-medium rounded capitalize shrink-0 ${pill[service.status]}`}>
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      ))}

      <p className="text-xs text-muted-foreground">
        These are live checks from the server, not a history. Uptime and incidents aren&apos;t recorded.
      </p>
    </div>
  )
}
