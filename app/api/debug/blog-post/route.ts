import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug') || 'zasdasd'

    console.log('Debug API called with slug:', slug)

    // Test the exact query
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
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    console.log('Debug query result:', { post: !!post, error: error?.message })

    return NextResponse.json({
      success: true,
      slug,
      post: post || null,
      error: error?.message || null
    })
  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
