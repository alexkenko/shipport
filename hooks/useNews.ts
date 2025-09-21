'use client'

import { useState, useEffect } from 'react'
import { newsService, NewsArticle } from '@/lib/news'

export interface NewsState {
  articles: NewsArticle[]
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
}

export function useNews(limit: number = 6) {
  const [newsState, setNewsState] = useState<NewsState>({
    articles: [],
    isLoading: false,
    error: null,
    lastUpdated: null
  })

  const fetchNews = async () => {
    setNewsState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const articles = await newsService.fetchMaritimeNews(limit)
      setNewsState({
        articles,
        isLoading: false,
        error: null,
        lastUpdated: new Date()
      })
    } catch (error) {
      console.error('Error fetching news:', error)
      setNewsState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch news'
      }))
    }
  }

  useEffect(() => {
    fetchNews()
  }, [limit])

  return {
    ...newsState,
    refetch: fetchNews
  }
}
