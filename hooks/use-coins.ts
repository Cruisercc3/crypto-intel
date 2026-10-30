import useSWR from 'swr'
import { MAX_COINS } from '@/lib/site'

export interface CoinData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation?: number | null
  total_volume: number
  price_change_percentage_24h: number
  price_change_percentage_7d_in_currency?: number
  price_change_percentage_30d_in_currency?: number
  high_24h: number
  low_24h: number
  circulating_supply: number
  total_supply?: number | null
  max_supply?: number | null
  ath: number
  ath_change_percentage: number
  // 7 days of prices, one every 2 hours (only when asked for with sparkline)
  sparkline_in_7d?: {
    price: number[]
  }
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const json = await res.json()
  if (!res.ok && !json?.coin) throw new Error(json?.error || `Request failed: ${res.status}`)
  return json
}

export function useCoins(perPage = 50, options: { sparkline?: boolean } = {}) {
  const url = `/api/coins?per_page=${perPage}${options.sparkline ? '&sparkline=1' : ''}`
  const { data, error, isLoading } = useSWR<{ coins: CoinData[]; total: number; timestamp: number }>(
    url,
    fetcher,
    {
      refreshInterval: 120000, // 2 min refresh for large datasets
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Dedupe requests within 1 min
    }
  )

  return {
    coins: data?.coins || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
  }
}

// Every coin the server has loaded (the top 500 by market cap)
export function useAllCoins() {
  const { data, error, isLoading } = useSWR<{ coins: CoinData[]; total: number; timestamp: number }>(
    `/api/coins?per_page=${MAX_COINS}`,
    fetcher,
    {
      refreshInterval: 300000, // 5 min refresh to reduce API calls
      revalidateOnFocus: false,
      dedupingInterval: 180000,
    }
  )

  return {
    coins: data?.coins || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
  }
}

// One coin by its CoinGecko id, with its 7-day sparkline
export function useCoin(id: string) {
  const { data, error, isLoading } = useSWR<{ coin: CoinData | null; total: number }>(
    id ? `/api/coins?id=${encodeURIComponent(id)}&sparkline=1` : null,
    fetcher,
    {
      refreshInterval: 120000,
      revalidateOnFocus: false,
    }
  )

  return {
    coin: data?.coin ?? null,
    isLoading,
    isError: error,
  }
}
