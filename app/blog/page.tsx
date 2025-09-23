'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { BlogPost, BlogCategory } from '@/types'
import { CalendarIcon, ClockIcon, UserIcon, TagIcon, SearchIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchPosts()
    fetchCategories()
  }, [currentPage, selectedCategory, searchTerm])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '9'
      })
      
      if (selectedCategory) params.append('category', selectedCategory)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/blog/posts?${params}`)
      const data = await response.json()
      
      setPosts(data.posts || [])
      setTotalPages(data.pagination?.pages || 1)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories')
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchPosts()
  }

  const handleCategoryFilter = (categorySlug: string) => {
    setSelectedCategory(categorySlug === selectedCategory ? '' : categorySlug)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Maritime Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stay updated with the latest insights, industry news, and expert advice 
            from marine superintendents and maritime professionals.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8">
            {/* Search */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative max-w-md mx-auto">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </form>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryFilter('')}
                className="mb-2"
              >
                All Posts
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.slug ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryFilter(category.slug)}
                  className="mb-2"
                  style={{ 
                    backgroundColor: selectedCategory === category.slug ? category.color : undefined,
                    borderColor: category.color
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Blog Posts Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} variant="glass">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {posts.map((post) => (
                  <Card key={post.id} variant="glass" className="hover:scale-105 transition-transform duration-200">
                    <CardHeader>
                      {post.featured_image_url && (
                        <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                          <Image
                            src={post.featured_image_url}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        {post.category && (
                          <span
                            className="px-2 py-1 text-xs font-medium rounded-full text-white"
                            style={{ backgroundColor: post.category.color }}
                          >
                            {post.category.name}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {post.reading_time} min read
                        </span>
                      </div>
                      <CardTitle className="text-lg text-white line-clamp-2">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-gray-300 line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            {formatDate(post.published_at || post.created_at)}
                          </div>
                          {post.author && (
                            <div className="flex items-center gap-1">
                              <UserIcon className="h-4 w-4" />
                              {post.author.name} {post.author.surname}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <Link href={`/blog/${post.slug}`}>
                        <Button className="w-full">
                          Read More
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-white mb-2">No posts found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || selectedCategory 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No blog posts have been published yet.'
                }
              </p>
              {(searchTerm || selectedCategory) && (
                <Button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('')
                    setCurrentPage(1)
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}