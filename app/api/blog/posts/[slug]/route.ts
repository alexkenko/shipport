import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Fetch the blog post with relations
    const { data: post, error } = await supabase
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
          color,
          description
        ),
        seo_data:blog_seo_data (
          id,
          schema_type,
          json_ld_data,
          focus_keyword
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error || !post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }

    // Increment view count
    await supabase
      .from('blog_posts')
      .update({ view_count: post.view_count + 1 })
      .eq('id', post.id)

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const body = await request.json()

    const {
      title,
      excerpt,
      content,
      featured_image_url,
      category_id,
      meta_title,
      meta_description,
      tags,
      status
    } = body

    // Calculate reading time
    const wordCount = content.split(/\s+/).length
    const reading_time = Math.ceil(wordCount / 200)

    const updateData: any = {
      title,
      excerpt,
      content,
      featured_image_url,
      category_id,
      meta_title,
      meta_description,
      tags: tags || [],
      reading_time,
      status
    }

    // Set published_at if status is changing to published
    if (status === 'published') {
      updateData.published_at = new Date().toISOString()
    }

    const { data: post, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('slug', slug)
      .select()
      .single()

    if (error) {
      console.error('Error updating blog post:', error)
      return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error in blog post update:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('slug', slug)

    if (error) {
      console.error('Error deleting blog post:', error)
      return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Blog post deleted successfully' })
  } catch (error) {
    console.error('Error in blog post deletion:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
