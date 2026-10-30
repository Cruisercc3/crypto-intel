import useSWR from 'swr'

interface PriceData {
  symbol: string
  price: number
  change24h: number
  marketCap: number
}

interface PricesResponse {
  prices: PriceData[]
  timestamp: number
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function usePrices(symbols: string[] = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA', 'AVAX', 'DOT', 'LINK', 'DOGE']) {
  const { data, error, isLoading } = useSWR<PricesResponse>(
    `/api/prices?symbols=${symbols.join(',')}`,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      dedupingInterval: 10000,
    }
  )

  return {
    prices: data?.prices || [],
    timestamp: data?.timestamp,
    isLoading,
    isError: error,
  }
}

export function usePrice(symbol: string) {
  const { prices, isLoading, isError } = usePrices([symbol])
  
  return {
    price: prices[0] || null,
    isLoading,
    isError,
  }
}

export function formatPrice(price: number): string {
  if (price >= 1000) {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  } else if (price >= 1) {
    return `$${price.toFixed(2)}`
  } else if (price >= 0.01) {
    return `$${price.toFixed(4)}`
  } else {
    return `$${price.toFixed(8)}`
  }
}

export function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`
  } else {
    return `$${(marketCap / 1e6).toFixed(2)}M`
  }
}
