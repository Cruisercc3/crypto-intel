import useSWR from 'swr'

export interface NewsArticle {
  news_url: string
  image_url: string
  title: string
  text: string
  source_name: string
  date: string
  topics: string[]
  sentiment: string
  type: string
  tickers?: string[]
}

export interface FeedStatus {
  name: string
  ok: boolean
  count: number
  error?: string
}

interface NewsResponse {
  data: NewsArticle[]
  total: number
  total_pages: number
  pool: number
  sources: FeedStatus[]
  updated: string
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || `Request failed: ${res.status}`)
  return json
}

export interface NewsOptions {
  page?: number
  limit?: number
  tickers?: string
  name?: string
  search?: string
  section?: string
}

// Builds the same URL for the same options, so components asking for the
// default first page share one request.
export function newsUrl({ page = 1, limit, tickers, name, search, section }: NewsOptions = {}) {
  const params = new URLSearchParams()
  if (page > 1) params.set('page', String(page))
  if (limit && limit !== 30) params.set('limit', String(limit))
  if (tickers) params.set('tickers', tickers)
  if (name) params.set('name', name)
  if (search) params.set('search', search)
  if (section) params.set('section', section)
  const qs = params.toString()
  return qs ? `/api/news?${qs}` : '/api/news'
}

export function useNews(options: NewsOptions = {}) {
  const { data, error, isLoading, mutate } = useSWR<NewsResponse>(
    newsUrl(options),
    fetcher,
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  )

  return {
    articles: data?.data || [],
    total: data?.total ?? 0,
    totalPages: data?.total_pages || 1,
    pool: data?.pool ?? 0,
    sources: data?.sources || [],
    updated: data?.updated,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

export function useNewsByTicker(ticker: string, limit: number = 10, name?: string) {
  const { data, error, isLoading } = useSWR<NewsResponse>(
    ticker ? newsUrl({ tickers: ticker, limit, name }) : null,
    fetcher,
    {
      refreshInterval: 120000,
      revalidateOnFocus: false,
    }
  )

  return {
    articles: data?.data || [],
    total: data?.total ?? 0,
    isLoading,
    isError: error,
  }
}
