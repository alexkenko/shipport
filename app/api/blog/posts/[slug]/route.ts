import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Check if this is an edit request (has authorization header)
    const authHeader = request.headers.get('authorization')
    const isEditRequest = !!authHeader

    // Fetch the blog post with relations
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
          color,
          description
        )
      `)
      .eq('slug', slug)

    // For public access, only show published posts
    // For edit access, show all posts
    if (!isEditRequest) {
      query = query.eq('status', 'published')
    }

    console.log('Blog post API called:', { slug, isEditRequest, authHeader: !!authHeader })

    const { data: post, error } = await query.single()

    console.log('Query result:', { post: !!post, error: error?.message, slug })

    if (error || !post) {
      console.log('Blog post not found:', { error: error?.message, slug })
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }

    // Only increment view count for public access (not edit requests)
    if (!isEditRequest) {
      await supabase
        .from('blog_posts')
        .update({ view_count: post.view_count + 1 })
        .eq('id', post.id)
    }

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
    // Check authentication using Supabase directly
    const authHeader = request.headers.get('authorization')
    console.log('🔐 Blog edit API - Auth header received:', authHeader ? 'Present' : 'Missing')
    
    if (!authHeader) {
      console.log('❌ Blog edit API - No authorization header found')
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    console.log('🔑 Blog edit API - Token extracted:', token ? 'Present' : 'Missing')
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    console.log('👤 Blog edit API - User auth result:', { user: user?.email, error: authError?.message })
    
    if (authError || !user || user.email !== 'kenkadzealex@gmail.com') {
      console.log('🚫 Blog edit API - Authorization failed:', { 
        authError: authError?.message, 
        userEmail: user?.email,
        hasUser: !!user,
        emailMatch: user?.email === 'kenkadzealex@gmail.com'
      })
      return NextResponse.json({ error: 'Unauthorized. Only authorized users can edit blog posts.' }, { status: 401 })
    }

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
