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

  // Auto-rotation effect with smoother transitions
  useEffect(() => {
    if (!isAutoPlaying || posts.length <= 1) {
      console.log('Carousel auto-rotation disabled:', { isAutoPlaying, postsLength: posts.length })
      return
    }

    console.log('Starting carousel auto-rotation with', posts.length, 'posts')
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % posts.length
        console.log('Carousel rotating from', prev, 'to', next)
        return next
      })
    }, 4000) // Rotate every 4 seconds

    return () => {
      console.log('Clearing carousel interval')
      clearInterval(interval)
    }
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
      const fetchedPosts = (postsData.posts || []).slice(0, maxPosts)
      console.log('BlogCarousel: Fetched posts:', fetchedPosts.length, fetchedPosts)
      setPosts(fetchedPosts)
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
    setCurrentIndex((prev) => (prev + 1) % posts.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length)
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
      className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="flex items-center space-x-3">
          {posts.length > 1 && (
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
        {posts.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-dark-700 hover:bg-dark-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-dark-700 hover:bg-dark-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Blog Posts Carousel - One at a time */}
        <div className="overflow-hidden relative flex justify-center">
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              width: `${posts.length * 100}%`
            }}
          >
            {posts.map((post, index) => (
              <div 
                key={post.id} 
                className="flex-shrink-0 w-full flex justify-center px-4"
              >
                <Card 
                  className={`bg-dark-700 hover:bg-dark-600 transition-all duration-500 group cursor-pointer transform hover:scale-105 hover:shadow-xl w-full max-w-4xl ${
                    index === currentIndex ? 'animate-slide-in' : ''
                  }`}
                  style={{
                    animationDelay: `${index * 150}ms`
                  }}
                >
              <Link href={`/blog/${post.slug}`}>
                <div className="overflow-hidden rounded-t-lg">
                  {post.featured_image_url ? (
                    <img 
                      src={post.featured_image_url} 
                      alt={post.title}
                      className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-24 bg-gradient-to-br from-primary-600 to-marine-600 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">📝</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    {post.category && (
                      <span 
                        style={getCategoryColorClass(post.category.color)}
                        className="text-white px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {post.category.name}
                      </span>
                    )}
                    <div className="flex items-center text-gray-400 text-xs">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      <span>{post.reading_time || 5} min read</span>
                    </div>
                  </div>
                  
                  <h3 className="text-base font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors leading-tight break-words">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-300 text-xs mb-2 line-clamp-1">
                    {post.excerpt || post.content.substring(0, 80) + '...'}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
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
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        {posts.length > 1 && (
          <div className="flex flex-col items-center mt-6 space-y-4">
            {/* Progress Bar */}
            <div className="w-full max-w-xs bg-gray-700 rounded-full h-1 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${((currentIndex + 1) / posts.length) * 100}%`
                }}
              />
            </div>
            
            {/* Dots */}
            <div className="flex space-x-3">
              {posts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative transition-all duration-300 ${
                    index === currentIndex ? 'scale-125' : 'scale-100'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-primary-500 animate-pulse-glow' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`} />
                  {index === currentIndex && (
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-primary-300 animate-ping opacity-75" />
                  )}
                </button>
              ))}
            </div>
            
            {/* Auto-play indicator */}
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              <span>{isAutoPlaying ? 'Auto-rotating' : 'Paused'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
