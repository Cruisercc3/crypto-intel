"use client"

import { useState } from "react"
import { CheckCircle, Loader2 } from "lucide-react"
import { submitForm } from "@/lib/forms"

// The digest isn't sending yet. This collects emails for the first issue
// through the same form service the contact page uses.
export function NewsletterBanner() {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle")
  const [error, setError] = useState("")

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState("sending")
    setError("")
    try {
      await submitForm({ email, _subject: "Newsletter waitlist", list: "daily-digest" })
      setState("done")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send that")
      setState("error")
    }
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Left: form */}
        <div className="flex-1 p-6 sm:p-8 bg-card">
          <p className="text-[10px] uppercase tracking-widest text-primary font-semibold mb-2">CryptoIntel Digest</p>
          <h2 className="text-2xl font-bold text-foreground mb-1">Daily signals. Zero noise.</h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-md">
            A short daily email with the day&apos;s top headlines, their sentiment and the biggest market moves.
            It isn&apos;t sending yet. Join the list and you&apos;ll get the first issue.
          </p>
          <div className="flex gap-2 flex-wrap mb-4">
            {["Top headlines", "Sentiment read", "Market movers"].map(t => (
              <span key={t} className="flex items-center gap-1 text-[11px] text-muted-foreground border border-border rounded-full px-2.5 py-1">
                <span className="text-primary">✦</span> {t}
              </span>
            ))}
          </div>

          {state === "done" ? (
            <div className="flex items-center gap-2 text-bullish text-sm">
              <CheckCircle className="h-4 w-4" />
              You&apos;re on the list.
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2 max-w-sm">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Email address"
                required
                className="flex-1 min-w-0 h-10 px-3 bg-secondary border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={state === "sending"}
                className="h-10 px-5 bg-primary text-primary-foreground text-sm font-semibold rounded hover:bg-primary/90 transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
                {state === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
                Join the list
              </button>
            </form>
          )}
          {state === "error" && (
            <p className="text-xs text-bearish mt-2" role="alert">Couldn&apos;t add you: {error}. Try again in a minute.</p>
          )}
          <p className="text-[10px] text-muted-foreground mt-2">Your email is only used for the digest and never shared.</p>
        </div>

        {/* Right: what it will contain */}
        <div className="lg:w-80 p-6 sm:p-8 bg-secondary/40 border-t lg:border-t-0 lg:border-l border-border flex flex-col justify-center">
          <h3 className="text-sm font-bold text-foreground mb-4">What each issue will have</h3>
          <ul className="space-y-3">
            {[
              "The day's top stories from the feeds the site reads",
              "The AI sentiment read on those headlines",
              "The biggest 24h movers in the top 500 coins",
              "The Fear & Greed reading",
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="text-primary mt-0.5 shrink-0">✦</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
