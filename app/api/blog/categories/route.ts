import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { data: categories, error } = await supabase
      .from('blog_categories')
      .select(`
        *,
        posts:blog_posts!blog_posts_category_id_fkey (
          id,
          status
        )
      `)
      .order('name')

    if (error) {
      console.error('Error fetching blog categories:', error)
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }

    // Add post count for each category
    const categoriesWithCount = categories?.map(category => ({
      ...category,
      post_count: category.posts?.filter((post: any) => post.status === 'published').length || 0
    })) || []

    return NextResponse.json({ categories: categoriesWithCount })
  } catch (error) {
    console.error('Error in blog categories API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, description, color } = body

    const { data: category, error } = await supabase
      .from('blog_categories')
      .insert({
        name,
        slug,
        description,
        color
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating blog category:', error)
      return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
    }

    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error('Error in blog category creation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
