'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { BlogPost, BlogCategory } from '@/types'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPost, setIsLoadingPost] = useState(true)
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image_url: '',
    category_id: '',
    meta_title: '',
    meta_description: '',
    tags: '',
    status: 'draft' as 'draft' | 'published'
  })

  useEffect(() => {
    fetchCategories()
    fetchPost()
  }, [slug])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories')
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/posts/${slug}`)
      if (response.ok) {
        const data = await response.json()
        const post = data.post
        setFormData({
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          featured_image_url: post.featured_image_url || '',
          category_id: post.category_id || '',
          meta_title: post.meta_title || '',
          meta_description: post.meta_description || '',
          tags: post.tags ? post.tags.join(', ') : '',
          status: post.status || 'draft'
        })
      } else {
        toast.error('Blog post not found')
        router.push('/dashboard/blog')
      }
    } catch (error) {
      console.error('Error fetching blog post:', error)
      toast.error('Failed to load blog post')
    } finally {
      setIsLoadingPost(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)

      const response = await fetch(`/api/blog/posts/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
          category_id: formData.category_id || null
        }),
      })

      if (response.ok) {
        toast.success('Blog post updated successfully!')
        router.push('/dashboard/blog')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update blog post')
      }
    } catch (error) {
      console.error('Error updating blog post:', error)
      toast.error('Failed to update blog post')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingPost) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading blog post...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/dashboard/blog" className="mr-4">
            <Button variant="outline" size="sm">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Blog Management
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Blog Post</h1>
            <p className="text-gray-300">Update your blog post content and settings</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="bg-dark-800/50 backdrop-blur-sm border-dark-700">
            <CardHeader>
              <CardTitle className="text-white">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter blog post title"
                  required
                />
                <Input
                  label="Slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="url-friendly-slug"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Excerpt
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Brief description of the blog post"
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your blog post content here..."
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                  rows={15}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Media and Settings */}
          <Card className="bg-dark-800/50 backdrop-blur-sm border-dark-700">
            <CardHeader>
              <CardTitle className="text-white">Media and Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                label="Featured Image URL"
                name="featured_image_url"
                value={formData.featured_image_url}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <Input
                label="Tags (comma-separated)"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="marine industry, shipping, regulations"
              />
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card className="bg-dark-800/50 backdrop-blur-sm border-dark-700">
            <CardHeader>
              <CardTitle className="text-white">SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                label="Meta Title"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleInputChange}
                placeholder="SEO optimized title"
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Meta Description
                </label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  placeholder="SEO optimized description"
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/blog')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!formData.title || !formData.content}
            >
              {formData.status === 'published' ? 'Update & Publish' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
