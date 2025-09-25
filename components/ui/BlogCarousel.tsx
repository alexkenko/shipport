'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { BlogPost, BlogCategory } from '@/types'
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface BlogCarouselProps {
  title?: string
  maxPosts?: number
  showViewAll?: boolean
}

export function BlogCarousel({ 
  title = "Latest Blog Posts", 
  maxPosts = 3, 
  showViewAll = true 
}: BlogCarouselProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    fetchBlogData()
  }, [])

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoPlaying || posts.length <= 3) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, posts.length - 2))
    }, 4000) // Rotate every 4 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, posts.length])

  const fetchBlogData = async () => {
    setIsLoading(true)
    try {
      // Fetch categories
      const categoriesRes = await fetch('/api/blog/categories')
      const categoriesData = await categoriesRes.json()
      setCategories(categoriesData.categories || [])

      // Fetch latest published posts
      const postsRes = await fetch('/api/blog/posts?status=published&limit=6')
      const postsData = await postsRes.json()
      setPosts((postsData.posts || []).slice(0, maxPosts))
    } catch (error) {
      console.error('Error fetching blog data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryColorClass = (color: string) => {
    return { backgroundColor: color }
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, posts.length - 2))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, posts.length - 2)) % Math.max(1, posts.length - 2))
  }

  const handleMouseEnter = () => {
    setIsAutoPlaying(false)
  }

  const handleMouseLeave = () => {
    setIsAutoPlaying(true)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  if (isLoading) {
    return (
      <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-dark-700 animate-pulse">
              <div className="h-48 bg-gray-700 rounded-t-lg"></div>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-5/6"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-400 text-lg">No blog posts available yet</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="flex items-center space-x-3">
          {posts.length > 3 && (
            <button
              onClick={toggleAutoPlay}
              className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-white transition-colors"
              title={isAutoPlaying ? 'Pause auto-rotation' : 'Resume auto-rotation'}
            >
              {isAutoPlaying ? '⏸️' : '▶️'}
            </button>
          )}
          {showViewAll && (
            <Link href="/blog">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="relative">
        {/* Navigation Buttons */}
        {posts.length > 3 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-dark-700 hover:bg-dark-600 text-white p-2 rounded-full shadow-lg transition-all duration-200"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-dark-700 hover:bg-dark-600 text-white p-2 rounded-full shadow-lg transition-all duration-200"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ease-in-out">
          {posts.slice(currentIndex, currentIndex + 3).map((post, index) => (
            <Card 
              key={post.id} 
              className={`bg-dark-700 hover:bg-dark-600 transition-all duration-500 group cursor-pointer transform ${
                index === 0 ? 'animate-fade-in' : ''
              }`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="overflow-hidden rounded-t-lg">
                  {post.featured_image_url ? (
                    <img 
                      src={post.featured_image_url} 
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary-600 to-marine-600 flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">📝</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    {post.category && (
                      <span 
                        style={getCategoryColorClass(post.category.color)}
                        className="text-white px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {post.category.name}
                      </span>
                    )}
                    <div className="flex items-center text-gray-400 text-sm">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>{post.reading_time || 5} min read</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2 group-hover:text-primary-400 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {post.excerpt || post.content.substring(0, 120) + '...'}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>
                        {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'Recently'}
                      </span>
                    </div>
                    <span className="text-primary-400 group-hover:text-primary-300 transition-colors">
                      Read More →
                    </span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Dots Indicator */}
        {posts.length > 3 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: Math.max(1, posts.length - 2) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex ? 'bg-primary-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
