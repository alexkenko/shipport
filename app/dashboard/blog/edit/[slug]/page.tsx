'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { BlogPost, BlogCategory } from '@/types'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import Image from 'next/image';

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPost, setIsLoadingPost] = useState(true)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
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
      // Get authentication token for edit access
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      console.log('Edit page - Current user:', session?.user?.email)
      console.log('Edit page - Session token:', token ? 'Present' : 'Missing')

      const headers: HeadersInit = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      console.log('Edit page - Making request to:', `/api/blog/posts/${slug}`)
      console.log('Edit page - Headers:', headers)

      const response = await fetch(`/api/blog/posts/${slug}`, { headers })
      
      console.log('Edit page - Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Edit page - Response data:', data)
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
        const errorData = await response.json()
        console.error('Edit page - Error response:', errorData)
        toast.error(errorData.error || 'Blog post not found')
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    console.log('📁 File selected:', { name: file.name, type: file.type, size: file.size })

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setIsUploadingImage(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `uploads/${fileName}`

      console.log('📤 Uploading file:', { fileName, filePath, fileType: file.type })

      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file)

      console.log('📤 Upload result:', { data, error })

      if (error) {
        console.error('❌ Upload error details:', error)
        throw error
      }

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath)

      console.log('🔗 Public URL generated:', publicUrl)

      setFormData(prev => ({
        ...prev,
        featured_image_url: publicUrl
      }))

      toast.success('Image uploaded successfully!')
    } catch (error: any) {
      console.error('❌ Error uploading image:', error)
      console.error('❌ Error details:', {
        message: error.message,
        statusCode: error.statusCode,
        error: error.error
      })
      toast.error(`Failed to upload image: ${error.message || 'Please try again.'}`)
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)

      // Get the current user and their token with better error handling
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      console.log('🔐 Edit - Current user:', user?.email, 'Error:', userError?.message)
      
      if (userError || !user) {
        console.error('❌ Edit - User authentication failed:', userError)
        throw new Error('Not authenticated. Please log in again.')
      }

      // Try to refresh the session first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      console.log('🔄 Edit - Session refresh result:', { hasSession: !!session, error: sessionError?.message })
      
      let token = session?.access_token
      
      // If no session, try to refresh
      if (!token) {
        console.log('🔄 Edit - No session found, attempting to refresh...')
        const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession()
        console.log('🔄 Edit - Refresh result:', { hasSession: !!refreshedSession, error: refreshError?.message })
        token = refreshedSession?.access_token
      }

      console.log('🔑 Edit - Final token status:', token ? 'Present' : 'Missing')

      if (!token) {
        throw new Error('No access token available. Please log in again.')
      }

      const response = await fetch(`/api/blog/posts/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading blog post...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
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
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Featured Image</label>
                
                {/* Image Preview */}
                <div className="mt-4">
                  <p className="block text-sm font-medium text-gray-300 mb-2">
                    Featured Image Preview
                  </p>
                  {formData.featured_image_url ? (
                    <div className="relative w-full h-56 rounded-lg overflow-hidden border border-dark-600">
                      <Image
                        src={formData.featured_image_url}
                        alt="Featured image preview"
                        layout="fill"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-56 rounded-lg bg-dark-800 flex items-center justify-center">
                      <p className="text-gray-400">No image uploaded</p>
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <div className="space-y-3">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploadingImage}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer transition-colors ${
                      isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isUploadingImage ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Upload Image
                      </>
                    )}
                  </label>
                  
                  <p className="text-xs text-gray-400">
                    Or paste an image URL below
                  </p>
                  
                  <Input
                    name="featured_image_url"
                    value={formData.featured_image_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

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
    </DashboardLayout>
  )
}
