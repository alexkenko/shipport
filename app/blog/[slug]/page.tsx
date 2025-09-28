'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { BlogPost, BlogCategory } from '@/types'
import { CalendarIcon, ClockIcon, UserIcon, TagIcon, ArrowLeftIcon, ShareIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'
import { getCurrentUser } from '@/lib/auth'
import { trackBlogPostView } from '@/lib/analytics'

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (params.slug) {
      fetchPost(params.slug as string)
    }
    checkUser()
  }, [params.slug])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.log('No user logged in')
    }
  }

  const fetchPost = async (slug: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/blog/posts/${slug}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Blog post not found')
        } else {
          setError('Failed to load blog post')
        }
        return
      }

      const data = await response.json()
      setPost(data.post)
      
      // Track blog post view
      if (data.post) {
        trackBlogPostView(data.post.title, data.post.slug)
      }
      
      // Fetch related posts
      if (data.post.category_id) {
        fetchRelatedPosts(data.post.category_id, data.post.id)
      }
    } catch (error) {
      console.error('Error fetching blog post:', error)
      setError('Failed to load blog post')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRelatedPosts = async (categoryId: string, excludeId: string) => {
    try {
      const response = await fetch(`/api/blog/posts?category=${categoryId}&limit=3`)
      const data = await response.json()
      
      // Filter out the current post
      const filtered = data.posts?.filter((p: BlogPost) => p.id !== excludeId) || []
      setRelatedPosts(filtered.slice(0, 3))
    } catch (error) {
      console.error('Error fetching related posts:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const sharePost = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || '',
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // You could add a toast notification here
    }
  }

  if (isLoading) {
    const LoadingContent = () => (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-8"></div>
          <div className="h-64 bg-gray-700 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )

    if (user) {
      return (
        <DashboardLayout>
          <LoadingContent />
        </DashboardLayout>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <LoadingContent />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !post) {
    const ErrorContent = () => (
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
        <p className="text-gray-300 mb-8">{error || 'The blog post you are looking for does not exist.'}</p>
        <Link href="/blog">
          <Button>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
      </div>
    )

    if (user) {
      return (
        <DashboardLayout>
          <ErrorContent />
        </DashboardLayout>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <ErrorContent />
        </main>
        <Footer />
      </div>
    )
  }

  const BlogContent = () => (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link href="/blog" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Blog
      </Link>

          {/* Article Header */}
          <article className="mb-12">
            <header className="mb-8">
              {/* Category and Meta */}
              <div className="flex items-center gap-4 mb-4">
                {post.category && (
                  <span
                    className="px-3 py-1 text-sm font-medium rounded-full text-white"
                    style={{ backgroundColor: post.category.color }}
                  >
                    {post.category.name}
                  </span>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    {formatDate(post.published_at || post.created_at)}
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    {post.reading_time} min read
                  </div>
                  {post.author && (
                    <div className="flex items-center gap-1">
                      <UserIcon className="h-4 w-4" />
                      {post.author.name} {post.author.surname}
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share Button */}
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={sharePost}
                  className="flex items-center gap-2"
                >
                  <ShareIcon className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </header>

            {/* Featured Image */}
            {post.featured_image_url && (
              <div className="relative w-full mb-8 rounded-lg overflow-hidden">
                <Image
                  src={post.featured_image_url}
                  alt={post.title}
                  width={800}
                  height={400}
                  className="w-full h-auto object-cover rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-lg prose-invert max-w-none prose-img:rounded-lg prose-img:w-full prose-img:h-auto prose-img:object-contain prose-img:max-h-96 prose-img:mx-auto prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
            />

            {/* Author Bio */}
            {post.author && (
              <div className="mt-12 p-6 bg-gray-800/50 rounded-lg">
                <div className="flex items-start gap-4">
                  {post.author.photo_url ? (
                    <Image
                      src={post.author.photo_url}
                      alt={`${post.author.name} ${post.author.surname}`}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                      <UserIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {post.author.name} {post.author.surname}
                    </h3>
                    <p className="text-gray-300">
                      Marine industry expert with extensive experience in vessel management and maritime compliance.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} variant="glass" className="hover:scale-105 transition-transform duration-200">
                    <CardHeader>
                      {relatedPost.featured_image_url && (
                        <div className="relative w-full mb-4 rounded-lg overflow-hidden">
                          <Image
                            src={relatedPost.featured_image_url}
                            alt={relatedPost.title}
                            width={300}
                            height={150}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        {relatedPost.category && (
                          <span
                            className="px-2 py-1 text-xs font-medium rounded-full text-white"
                            style={{ backgroundColor: relatedPost.category.color }}
                          >
                            {relatedPost.category.name}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {relatedPost.reading_time} min read
                        </span>
                      </div>
                      <CardTitle className="text-lg text-white line-clamp-2">
                        {relatedPost.title}
                      </CardTitle>
                      <CardDescription className="text-gray-300 line-clamp-3">
                        {relatedPost.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/blog/${relatedPost.slug}`}>
                        <Button className="w-full">
                          Read More
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
    </div>
  )

  if (user) {
    return (
      <DashboardLayout>
        <BlogContent />
      </DashboardLayout>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <BlogContent />
      </main>
      <Footer />
    </div>
  )
}
