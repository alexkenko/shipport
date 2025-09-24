'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { BlogPost, BlogCategory } from '@/types'
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchBlogData()
  }, [])

  const fetchBlogData = async () => {
    setIsLoading(true)
    try {
      console.log('Fetching blog data...')
      
      // Fetch categories
      const categoriesRes = await fetch('/api/blog/categories')
      const categoriesData = await categoriesRes.json()
      console.log('Categories data:', categoriesData)
      setCategories(categoriesData.categories || [])

      // Fetch posts
      const postsRes = await fetch('/api/blog/posts')
      const postsData = await postsRes.json()
      console.log('Posts data:', postsData)
      setPosts(postsData.posts || [])
    } catch (error) {
      console.error('Error fetching blog data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePost = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return

    try {
      const response = await fetch(`/api/blog/posts/${slug}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPosts(posts.filter(post => post.slug !== slug))
        alert('Blog post deleted successfully!')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting blog post:', error)
      alert('Failed to delete blog post')
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || post.category?.slug === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColorClass = (color: string) => {
    return { backgroundColor: color }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-6">Blog Management</h1>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/4 mx-auto mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-dark-800 p-6 rounded-lg">
                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Blog Management</h1>
            <p className="text-gray-300">Create, edit, and manage your blog posts</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={fetchBlogData}
              variant="outline"
              className="bg-dark-700 hover:bg-dark-600 w-full sm:w-auto"
            >
              Refresh
            </Button>
            <Button
              onClick={() => router.push('/dashboard/blog/create')}
              className="bg-primary-600 hover:bg-primary-700 w-full sm:w-auto"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === null ? 'primary' : 'outline'}
                onClick={() => setSelectedCategory(null)}
                size="sm"
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.slug ? 'primary' : 'outline'}
                  onClick={() => setSelectedCategory(category.slug)}
                  size="sm"
                  style={getCategoryColorClass(category.color)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="bg-dark-800 border-dark-700 hover:bg-dark-700/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  {post.category && (
                    <span 
                      style={getCategoryColorClass(post.category.color)}
                      className="text-white px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {post.category.name}
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    post.status === 'published' 
                      ? 'bg-green-600 text-white' 
                      : post.status === 'draft'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-600 text-white'
                  }`}>
                    {post.status}
                  </span>
                </div>
                <CardTitle className="text-white text-lg line-clamp-2">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {post.excerpt || post.content.substring(0, 150) + '...'}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>
                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Not published'}
                  </span>
                  {post.reading_time && (
                    <span>{post.reading_time} min read</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                    className="flex-1"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/blog/edit/${post.slug}`)}
                    className="flex-1"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePost(post.slug)}
                    className="text-red-400 hover:text-red-300 hover:border-red-400"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No blog posts found</p>
            <Button
              onClick={() => router.push('/dashboard/blog/create')}
              className="bg-primary-600 hover:bg-primary-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Your First Post
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
