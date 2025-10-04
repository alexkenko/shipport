import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { BlogPost } from '@/types'
import { CalendarIcon, ClockIcon, UserIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'
import { getCurrentUser } from '@/lib/auth'
import { trackBlogPostView } from '@/lib/analytics'
import { getBlogPost, getRelatedPosts, getAllBlogSlugs } from '@/lib/blog'
import { ShareButton } from '@/components/blog/ShareButton'

interface BlogPostPageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllBlogSlugs()
    return slugs.map((slug) => ({
      slug: slug,
    }))
  } catch (error) {
    console.log('Error fetching blog slugs during build:', error)
    // Return empty array during build if database is not available
    // Pages will be generated on-demand
    return []
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shipinport.com'
  const postUrl = `${baseUrl}/blog/${post.slug}`
  
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || `Read about ${post.title} on ShipinPort.com`,
    keywords: post.tags?.join(', ') || 'marine superintendent, maritime, shipping',
    authors: post.author ? [{ name: `${post.author.name} ${post.author.surname}` }] : undefined,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || `Read about ${post.title} on ShipinPort.com`,
      url: postUrl,
      siteName: 'ShipinPort',
      type: 'article',
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at,
      authors: post.author ? [`${post.author.name} ${post.author.surname}`] : undefined,
      tags: post.tags,
      images: post.featured_image_url ? [
        {
          url: post.featured_image_url,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || `Read about ${post.title} on ShipinPort.com`,
      images: post.featured_image_url ? [post.featured_image_url] : undefined,
    },
    alternates: {
      canonical: postUrl,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    notFound()
  }

  // Track blog post view (client-side)
  if (typeof window !== 'undefined') {
    trackBlogPostView(post.title, post.slug)
  }

  // Fetch related posts
  const relatedPosts = post.category_id 
    ? await getRelatedPosts(post.category_id, post.id)
    : []

  // Check if user is logged in
  let user = null
  try {
    user = await getCurrentUser()
  } catch (error) {
    // User not logged in, continue without user context
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
                <ShareButton 
                  title={post.title}
                  excerpt={post.excerpt}
                  url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://shipinport.com'}/blog/${post.slug}`}
                />
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
