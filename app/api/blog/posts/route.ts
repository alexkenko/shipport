import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const status = searchParams.get('status') || 'published'

    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        author:users!blog_posts_author_id_fkey (
          id,
          name,
          surname,
          photo_url
        ),
        category:blog_categories!blog_posts_category_id_fkey (
          id,
          name,
          slug,
          color
        )
      `)
      .eq('status', status)
      .order('published_at', { ascending: false })

    // Filter by category
    if (category) {
      query = query.eq('category.slug', category)
    }

    // Search functionality
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`)
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: posts, error, count } = await query
      .range(from, to)
      .limit(limit)

    if (error) {
      console.error('Error fetching blog posts:', error)
      return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
    }

    return NextResponse.json({
      posts: posts || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Error in blog posts API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      featured_image_url,
      author_id,
      category_id,
      meta_title,
      meta_description,
      tags,
      status = 'draft'
    } = body

    // Calculate reading time (average 200 words per minute)
    const wordCount = content.split(/\s+/).length
    const reading_time = Math.ceil(wordCount / 200)

    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert({
        title,
        slug,
        excerpt,
        content,
        featured_image_url,
        author_id,
        category_id,
        meta_title,
        meta_description,
        tags: tags || [],
        reading_time,
        status,
        published_at: status === 'published' ? new Date().toISOString() : null
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating blog post:', error)
      return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
    }

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('Error in blog post creation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
