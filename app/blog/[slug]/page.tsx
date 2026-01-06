import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { BlogPost } from '@/types'
import { CalendarIcon, ClockIcon, UserIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'
import { getCurrentUser } from '@/lib/auth'
import BlogContent from './BlogContent'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

type Props = {
  params: { slug: string }
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, category:blog_categories(name, slug, color), author:users(name, surname, photo_url)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error || !data) {
      return null
    }
    return data as BlogPost
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

async function getRelatedPosts(categoryId: string, excludeId: string): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, category:blog_categories(name, slug, color)')
      .eq('category_id', categoryId)
      .neq('id', excludeId)
      .eq('status', 'published')
      .limit(3)
      .order('published_at', { ascending: false })
      
    if (error) return []
    return (data as BlogPost[]) || []
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'This blog post could not be found.',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shipinport.com'
  const imageUrl = post.featured_image_url || `${siteUrl}/og-image.jpg`

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    keywords: post.tags,
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || '',
      url: `${siteUrl}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.published_at || new Date().toISOString(),
      authors: post.author ? [`${post.author.name} ${post.author.surname}`] : ['ShipinPort Team'],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || '',
      images: [imageUrl],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const [post, user] = await Promise.all([
    getPost(params.slug),
    getCurrentUser().catch(() => null)
  ])

  if (!post) {
    notFound()
  }
  
  const relatedPosts = post.category_id ? await getRelatedPosts(post.category_id, post.id) : []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': post.title,
    'description': post.meta_description || post.excerpt,
    'image': post.featured_image_url || `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.jpg`,
    'author': {
      '@type': 'Person',
      'name': post.author ? `${post.author.name} ${post.author.surname}` : 'ShipinPort Team',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'ShipinPort',
      'logo': {
        '@type': 'ImageObject',
        'url': `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      },
    },
    'datePublished': post.published_at,
    'dateModified': post.updated_at,
  }
  
  const PageLayout = ({ children }: { children: React.ReactNode }) => {
    if (user) {
      return <DashboardLayout>{children}</DashboardLayout>
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-16">{children}</main>
        <Footer />
      </div>
    )
  }

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto">
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-gray-300 truncate">{post.title}</span>
        </nav>

        <article className="mb-12">
          <BlogContent post={post} />
        </article>

        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} variant="glass" className="hover:scale-105 transition-transform duration-200">
                  <CardHeader>
                    {relatedPost.featured_image_url && (
                      <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={relatedPost.featured_image_url}
                          alt={relatedPost.title}
                          fill
                          className="object-cover"
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
                    </div>
                    <CardTitle className="text-lg text-white line-clamp-2">
                      {relatedPost.title}
                    </CardTitle>
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
    </PageLayout>
  )
}
