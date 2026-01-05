'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { BlogPost, BlogCategory } from '@/types'
import { CalendarIcon, ClockIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'
import { trackBlogPostView, trackBlogSearch, trackBlogCategoryFilter } from '@/lib/analytics'
import { AuthUser } from '@/lib/auth'

interface BlogPageClientProps {
  initialPosts: BlogPost[]
  initialTotalPages: number
  categories: BlogCategory[]
  user: AuthUser | null
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function BlogPageClient({
  initialPosts,
  initialTotalPages,
  categories,
  user,
  searchParams
}: BlogPageClientProps) {
  const router = useRouter()
  const currentSearchParams = useSearchParams()

  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [isLoading, setIsLoading] = useState(false)

  const [searchTerm, setSearchTerm] = useState((searchParams.search as string) || '')
  const [selectedCategory, setSelectedCategory] = useState((searchParams.category as string) || '')
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.page as string, 10) || 1)
  const [totalPages, setTotalPages] = useState(initialTotalPages)

  useEffect(() => {
    setPosts(initialPosts)
    setTotalPages(initialTotalPages)
    setCurrentPage(parseInt(searchParams.page as string, 10) || 1)
    setSelectedCategory((searchParams.category as string) || '')
    setSearchTerm((searchParams.search as string) || '')
  }, [initialPosts, initialTotalPages, searchParams])

  const updateURL = (params: Record<string, string | number>) => {
    const newSearchParams = new URLSearchParams(currentSearchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, String(value))
      } else {
        newSearchParams.delete(key)
      }
    })
    router.push(`/blog?${newSearchParams.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm) {
      trackBlogSearch(searchTerm)
    }
    updateURL({ page: 1, search: searchTerm, category: selectedCategory })
  }

  const handleCategoryFilter = (categorySlug: string) => {
    const newCategory = categorySlug === selectedCategory ? '' : categorySlug
    if (newCategory) {
      const category = categories.find(cat => cat.slug === newCategory)
      if (category) trackBlogCategoryFilter(category.name)
    }
    setSelectedCategory(newCategory)
    updateURL({ page: 1, search: searchTerm, category: newCategory })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    updateURL({ page, search: searchTerm, category: selectedCategory })
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Header user={user} />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Maritime Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
            Stay updated with the latest insights, industry news, and expert advice
            from marine superintendents and maritime professionals.
          </p>
          <p className="text-gray-400 max-w-3xl mx-auto mb-6">
            Discover career opportunities on our <Link href="/" className="text-blue-400 hover:text-blue-300 underline">marine superintendent</Link> platform
            and connect with industry professionals worldwide.
          </p>
        </div>

        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative max-w-md mx-auto">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </form>

            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedCategory === '' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleCategoryFilter('')}
                className="mb-2"
              >
                All Posts
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.slug ? 'primary' : 'outline'}
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

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} variant="glass">
                  <CardContent className="p-6">
                    <div className="space-y-4 animate-pulse">
                      <div className="h-48 bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                      <div className="h-6 bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
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
                      <Link
                        href={`/blog/${post.slug}`}
                        onClick={() => trackBlogPostView(post.title, post.slug)}
                      >
                        <Button className="w-full">
                          Read More
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'primary' : 'outline'}
                      onClick={() => handlePageChange(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
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
                Try adjusting your search or filter criteria.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('')
                  handlePageChange(1)
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}


