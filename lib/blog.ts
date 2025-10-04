import { supabase } from '@/lib/supabase'
import { BlogPost } from '@/types'

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
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

    if (error || !post) {
      console.log('Blog post not found:', { error: error?.message, slug })
      return null
    }

    // Increment view count
    await supabase
      .from('blog_posts')
      .update({ view_count: post.view_count + 1 })
      .eq('id', post.id)

    return post
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

export async function getRelatedPosts(categoryId: string, excludeId: string, limit: number = 3): Promise<BlogPost[]> {
  try {
    const { data: posts, error } = await supabase
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
      .eq('category_id', categoryId)
      .eq('status', 'published')
      .neq('id', excludeId)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching related posts:', error)
      return []
    }

    return posts || []
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}

export async function getAllBlogSlugs(): Promise<string[]> {
  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('status', 'published')

    if (error) {
      console.error('Error fetching blog slugs:', error)
      return []
    }

    return posts?.map(post => post.slug) || []
  } catch (error) {
    console.error('Error fetching blog slugs:', error)
    // During build time, database might not be available
    // Return empty array to allow on-demand generation
    return []
  }
}