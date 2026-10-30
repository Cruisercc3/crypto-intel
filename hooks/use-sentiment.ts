import useSWR from 'swr'
import { useState, useCallback } from 'react'

export interface SentimentAnalysis {
  sentiment: 'bullish' | 'bearish' | 'neutral'
  score: number
  confidence: number
  summary: string
  impactedAssets: string[]
  marketImpact: 'high' | 'medium' | 'low'
}

export interface BatchSentimentAnalysis {
  overallSentiment: 'bullish' | 'bearish' | 'neutral'
  overallScore: number
  bullishPercent: number
  bearishPercent: number
  neutralPercent: number
  topThemes: string[]
  marketMood: string
  articles: { index: number; sentiment: string; score: number }[]
  analyzed: number
}

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(json?.error || `AI analysis failed (HTTP ${response.status}).`)
  }
  return json as T
}

export function useSentimentAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<SentimentAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyze = useCallback(async (title: string, text?: string) => {
    setIsAnalyzing(true)
    setError(null)
    try {
      const data = await postJSON<SentimentAnalysis>('/api/sentiment', { title, text })
      setAnalysis(data)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
      return null
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  return { analyze, analysis, isAnalyzing, error }
}

// Runs once per headline set, used by the home page sentiment widget.
export function useBatchSentiment(articles: { title: string; text?: string }[]) {
  const { data, error, isLoading, mutate } = useSWR<BatchSentimentAnalysis>(
    articles.length > 0 ? ['batch-sentiment', articles.map(a => a.title).join('|')] : null,
    () => postJSON<BatchSentimentAnalysis>('/api/sentiment/batch', { articles: articles.map(a => ({ title: a.title })) }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  )

  return {
    sentiment: data,
    isLoading,
    isError: error as Error | undefined,
    refresh: mutate,
  }
}

// On-demand batch analysis of one asset's headlines, used on the analysis page.
export function useAssetAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<BatchSentimentAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyze = useCallback(async (focus: string, titles: string[]) => {
    setIsAnalyzing(true)
    setError(null)
    try {
      const data = await postJSON<BatchSentimentAnalysis>('/api/sentiment/batch', {
        focus,
        articles: titles.map(title => ({ title })),
      })
      setAnalysis(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  return { analyze, analysis, isAnalyzing, error }
}
