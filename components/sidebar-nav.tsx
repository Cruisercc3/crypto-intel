"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Newspaper, TrendingUp, Brain, BarChart3, Star, Layers, FileText, Activity, HelpCircle, ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

const mainLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/analysis", label: "Analysis", icon: Brain },
  { href: "/markets", label: "Markets", icon: BarChart3 },
  { href: "/watchlist", label: "Watchlist", icon: Star },
]

const secondaryLinks = [
  { href: "/architecture", label: "Architecture", icon: Layers },
  { href: "/blog", label: "Dev Log", icon: FileText },
  { href: "/status", label: "Status", icon: Activity },
  { href: "/contact", label: "Contact", icon: HelpCircle },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <aside className="hidden xl:flex w-16 hover:w-48 flex-col bg-sidebar border-r border-border fixed left-0 top-14 bottom-0 z-40 transition-all duration-300 group overflow-hidden">
      <nav className="flex flex-col pt-6 pb-4 flex-1">
        {/* Main Links */}
        <div className="space-y-1 px-2">
          {mainLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded transition-colors whitespace-nowrap",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <link.icon className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {link.label}
                </span>
                {isActive && (
                  <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            )
          })}
        </div>

        {/* Divider */}
        <div className="h-px bg-border my-4 mx-4" />

        {/* Secondary Links */}
        <div className="space-y-1 px-2">
          {secondaryLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded transition-colors whitespace-nowrap",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <link.icon className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {link.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="px-2 pb-4">
        <Link href="/acquisition" className="block">
          <div className="px-3 py-3 bg-primary/10 rounded border border-primary/20 hover:bg-primary/15 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center shrink-0">
                <span className="text-primary-foreground font-mono font-bold text-xs">CI</span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-xs font-semibold text-foreground">Acquire</div>
                <div className="text-[10px] text-muted-foreground">Full platform</div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </aside>
  )
}
