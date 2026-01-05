import { Metadata } from 'next'
import BlogPageClient from './BlogPageClient'
import { supabase } from '@/lib/supabase'
import { BlogPost, BlogCategory } from '@/types'
import { getCurrentUser, AuthUser } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Maritime Blog - Marine Superintendent Insights & News',
  description: 'Explore the latest insights, news, and expert advice for marine superintendents. Stay informed on vessel inspections, ISM audits, and maritime industry trends.',
  keywords: 'maritime blog, marine superintendent blog, shipping industry news, vessel management articles, marine consultancy insights, ISM audit tips, ship inspection news',
  alternates: {
    canonical: 'https://shipinport.com/blog',
  },
  openGraph: {
    title: 'Maritime Blog - Marine Superintendent Insights & News',
    description: 'Explore the latest insights, news, and expert advice for the maritime industry.',
    type: 'website',
    url: 'https://shipinport.com/blog',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ShipinPort Maritime Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maritime Blog - Marine Superintendent Insights & News',
    description: 'Explore the latest insights, news, and expert advice for the maritime industry.',
    images: ['/og-image.jpg'],
  },
}

async function getPosts(searchParams: { [key: string]: string | string[] | undefined }): Promise<{ posts: BlogPost[], totalPages: number }> {
  const page = parseInt(searchParams.page as string || '1', 10)
  const limit = 9
  const offset = (page - 1) * limit
  const searchTerm = searchParams.search as string || ''
  const categorySlug = searchParams.category as string || ''

  try {
    let query = supabase
      .from('blog_posts')
      .select('*, category:blog_categories(name, slug, color), author:users(name, surname, photo_url)', { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (searchTerm) {
      query = query.ilike('title', `%${searchTerm}%`)
    }
    
    if (categorySlug) {
      const { data: categoryData } = await supabase
        .from('blog_categories')
        .select('id')
        .eq('slug', categorySlug)
        .single()
      if (categoryData) {
        query = query.eq('category_id', categoryData.id)
      }
    }

    const { data, error, count } = await query

    if (error) throw error

    const totalPages = Math.ceil((count || 0) / limit)
    return { posts: data as BlogPost[], totalPages }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return { posts: [], totalPages: 1 }
  }
}

async function getCategories(): Promise<BlogCategory[]> {
  try {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data as BlogCategory[]
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

async function getUser(): Promise<AuthUser | null> {
  try {
    return await getCurrentUser()
  } catch (error) {
    return null
  }
}

export default async function BlogPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const [postsData, categories, user] = await Promise.all([
    getPosts(searchParams),
    getCategories(),
    getUser()
  ])

  const { posts, totalPages } = postsData

  return (
    <BlogPageClient
      initialPosts={posts}
      initialTotalPages={totalPages}
      categories={categories}
      user={user}
      searchParams={searchParams}
    />
  )
}