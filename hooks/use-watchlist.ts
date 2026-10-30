"use client"

import { useCallback, useSyncExternalStore } from "react"

// One watchlist for the whole site, saved in this browser's localStorage under
// the same key the watchlist page has always used. Every star and button reads
// and writes it, and other tabs pick up changes through the storage event.

const STORAGE_KEY = "cryptointel-watchlist-v2"
const EMPTY: string[] = []
const listeners = new Set<() => void>()
let cache: string[] | null = null

function read(): string[] {
  if (cache) return cache
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    cache = Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : []
  } catch {
    cache = []
  }
  return cache
}

function write(ids: string[]) {
  cache = ids
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // Storage can be full or blocked. The list still works for this visit.
  }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null
      listener()
    }
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

export function useWatchlist() {
  const ids = useSyncExternalStore(subscribe, read, () => EMPTY)
  // false during server render and the first client pass, so pages don't flash "empty"
  const ready = useSyncExternalStore(subscribe, () => true, () => false)

  const has = useCallback((id: string) => ids.includes(id), [ids])
  const add = useCallback((id: string) => {
    const current = read()
    if (!current.includes(id)) write([...current, id])
  }, [])
  const remove = useCallback((id: string) => {
    write(read().filter((x) => x !== id))
  }, [])
  const toggle = useCallback((id: string) => {
    const current = read()
    write(current.includes(id) ? current.filter((x) => x !== id) : [...current, id])
  }, [])

  return { ids, ready, has, add, remove, toggle }
}
