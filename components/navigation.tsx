"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Menu, X, Search, Newspaper, TrendingUp, Brain, BarChart3, Star, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCoins } from "@/hooks/use-coins"
import { useNews } from "@/hooks/use-news"

export function Navigation() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [mobileQuery, setMobileQuery] = useState("")
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { coins } = useCoins(100)
  const { articles } = useNews()

  // Filter coins and articles based on search
  const filteredCoins = searchQuery.length > 0 
    ? coins.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : []
  
  const filteredArticles = searchQuery.length > 0
    ? articles.filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : []

  const showDropdown = searchFocused && searchQuery.length > 0 && (filteredCoins.length > 0 || filteredArticles.length > 0)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // "/" jumps to the search box, as the hint in the box says
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (target && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return
      e.preventDefault()
      inputRef.current?.focus()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/news?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchFocused(false)
      setSearchQuery("")
    }
  }

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (mobileQuery.trim()) {
      router.push(`/news?search=${encodeURIComponent(mobileQuery.trim())}`)
      setMobileQuery("")
      setMobileMenuOpen(false)
    }
  }

  const navLinks = [
    { href: "/news", label: "News", icon: Newspaper },
    { href: "/trending", label: "Trending", icon: TrendingUp },
    { href: "/analysis", label: "Analysis", icon: Brain },
    { href: "/markets", label: "Markets", icon: BarChart3 },
    { href: "/watchlist", label: "Watchlist", icon: Star },
  ]

  return (
    <header className="sticky top-0 z-50 bg-sidebar border-b border-border">
      <nav className="mx-auto max-w-[1800px] px-4">
        <div className="flex h-14 items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-primary">
              <span className="text-primary-foreground font-mono font-semibold text-sm">CI</span>
            </div>
            <span className="text-base font-semibold text-foreground tracking-tight">CryptoIntel</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                aria-label="Search news and assets"
                placeholder="Search news, assets, topics..."
                className="w-full h-9 pl-9 pr-4 bg-secondary border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">/</span>
              
              {/* Search Dropdown Preview */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50">
                  {/* Coins Results */}
                  {filteredCoins.length > 0 && (
                    <div className="border-b border-border">
                      <div className="px-3 py-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wide bg-secondary/50">
                        Assets
                      </div>
                      {filteredCoins.map(coin => (
                        <Link
                          key={coin.id}
                          href={`/coin/${coin.id}`}
                          onClick={() => { setSearchFocused(false); setSearchQuery("") }}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-secondary transition-colors"
                        >
                          <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                            {coin.image ? (
                              <img src={coin.image} alt={coin.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[9px] font-mono font-bold">{coin.symbol.slice(0, 2).toUpperCase()}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{coin.name}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{coin.symbol.toUpperCase()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-mono text-foreground">
                              ${coin.current_price?.toLocaleString(undefined, { maximumFractionDigits: coin.current_price > 1 ? 2 : 6 })}
                            </p>
                            <p className={`text-[10px] font-mono ${(coin.price_change_percentage_24h ?? 0) >= 0 ? "text-bullish" : "text-bearish"}`}>
                              {(coin.price_change_percentage_24h ?? 0) >= 0 ? "+" : ""}{(coin.price_change_percentage_24h ?? 0).toFixed(2)}%
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  {/* News Results */}
                  {filteredArticles.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wide bg-secondary/50">
                        News
                      </div>
                      {filteredArticles.map((article, i) => {
                        const articleHref = article.news_url || "#"
                        return (
                          <a
                            key={i}
                            href={articleHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => { setSearchFocused(false); setSearchQuery("") }}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-secondary transition-colors"
                          >
                            {article.image_url ? (
                              <div className="w-10 h-8 rounded overflow-hidden bg-secondary shrink-0">
                                <img src={article.image_url} alt="" className="w-full h-full object-cover"
                                  onError={e => { (e.currentTarget.parentElement as HTMLElement).style.display = "none" }} />
                              </div>
                            ) : (
                              <Newspaper className="w-4 h-4 text-muted-foreground shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground truncate">{article.title}</p>
                              <p className="text-[10px] text-muted-foreground">{article.source_name}</p>
                            </div>
                          </a>
                        )
                      })}
                    </div>
                  )}
                  
                  {/* View All */}
                  <Link
                    href={`/news?search=${encodeURIComponent(searchQuery)}`}
                    onClick={() => { setSearchFocused(false); setSearchQuery("") }}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 bg-secondary/50 text-sm text-primary hover:bg-secondary transition-colors"
                  >
                    <Search className="w-4 h-4" />
                    View all results for "{searchQuery}"
                  </Link>
                </div>
              )}
            </form>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link 
              href="/enterprise" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Enterprise
            </Link>
            <Link 
              href="/api-docs" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              API
            </Link>
            <Link href="/request-access">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-4 text-sm font-medium">
                Request Access
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between px-3 py-2.5 text-foreground hover:bg-secondary rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    <link.icon className="h-4 w-4 text-muted-foreground" />
                    {link.label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
              <div className="h-px bg-border my-2" />
              <Link
                href="/enterprise"
                className="flex items-center justify-between px-3 py-2.5 text-foreground hover:bg-secondary rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Enterprise</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link
                href="/api-docs"
                className="flex items-center justify-between px-3 py-2.5 text-foreground hover:bg-secondary rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>API</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <div className="px-3 pt-2 flex flex-col gap-2">
                <form onSubmit={handleMobileSearch}>
                  <input
                    type="search"
                    value={mobileQuery}
                    onChange={(e) => setMobileQuery(e.target.value)}
                    placeholder="Search news..."
                    aria-label="Search news"
                    className="w-full h-10 px-4 bg-secondary border border-border rounded text-sm"
                  />
                </form>
                <Link href="/request-access" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-primary text-primary-foreground">
                    Request Access
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
