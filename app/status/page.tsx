import { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { Footer } from "@/components/footer"
import { StatusBoard } from "@/components/status/status-board"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "System Status | CryptoIntel",
  description: "Live checks of the news feeds, market data and AI service CryptoIntel depends on.",
}

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SidebarNav />

      <main className="xl:ml-16">
        <div className="mx-auto max-w-[1000px] px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <span className="text-xs font-mono text-primary uppercase tracking-widest">System Status</span>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Platform Health
            </h1>
            <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
              Every source the site reads from, checked from the server when this page loads.
            </p>
          </div>

          <StatusBoard />

          {/* Links */}
          <div className="mt-12 pt-8 border-t border-border flex flex-wrap items-center justify-center gap-6">
            <Link href="/architecture" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              System Architecture
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Development Log
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Report an Issue
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  )
}
