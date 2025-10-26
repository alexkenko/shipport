import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const GEMINI_API_KEY = 'AIzaSyAUm4wcXczS7BNJ0gILAH9HrBzSS8N_umo'

export async function GET(request: Request) {
  try {
    console.log('🚀 Manual blog generation triggered...')
    
    // Step 1: Fetch recent maritime news
    const articles = await fetchMaritimeArticles()
    
    if (!articles || articles.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No articles found to process' 
      })
    }

    console.log(`📰 Found ${articles.length} articles`)

    // Step 2: Use Gemini AI to generate blog post
    const blogPost = await generateBlogPostWithGemini(articles[0])
    
    if (!blogPost) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to generate blog post' 
      })
    }

    console.log(`✍️ Generated blog: ${blogPost.title}`)

    // Step 3: Save to database
    const result = await saveBlogPost(blogPost)
    
    console.log(`💾 Saved to database: ${result.id}`)

    return NextResponse.json({ 
      success: true,
      postId: result.id,
      title: blogPost.title,
      slug: blogPost.slug,
      url: `https://shipinport.com/blog/${blogPost.slug}`
    })

  } catch (error: any) {
    console.error('❌ Error in manual blog generation:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

async function fetchMaritimeArticles() {
  try {
    // Use existing news API
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shipinport.com'
    const response = await fetch(`${siteUrl}/api/news?limit=5`, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch maritime news')
    }
    
    const articles = await response.json()
    return articles
  } catch (error) {
    console.error('Error fetching maritime articles:', error)
    return []
  }
}

async function generateMarineThemedImage(title: string): Promise<string> {
  const marineImages = [
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1471922694854-ff1b6b366336?w=1200&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1544552866-d5eec1388af6?w=1200&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=600&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1579602592569-cf6fb48d2943?w=1200&h=600&fit=crop&auto=format'
  ]
  
  const randomIndex = Math.floor(Math.random() * marineImages.length)
  return marineImages[randomIndex]
}

async function generateBlogPostWithGemini(sourceArticle: any) {
  try {
    console.log('🤖 Calling Gemini API...')
    
    // Generate AI image using Unsplash API (free)
    const imageUrl = await generateMarineThemedImage(sourceArticle.title)
    
    const prompt = `You are an expert maritime industry content writer specializing in marine superintendent topics.

Based on this maritime news article:
Title: ${sourceArticle.title}
Description: ${sourceArticle.description}
Source: ${sourceArticle.source?.name || 'Maritime News'}

Write a comprehensive 1500-word SEO-optimized blog post that:

1. Targets the keyword "marine superintendent" naturally throughout
2. Incorporates the news content with analysis relevant to marine superintendents
3. Follows this structure:
   - Executive Summary (200 words)
   - Key Implications for Marine Superintendents (400 words)
   - How This Affects Daily Superintendent Responsibilities (300 words)
   - Compliance Requirements and Best Practices (400 words)
   - Conclusion with Actionable Takeaways (200 words)

4. Include 3-5 internal links to these pages:
   - /what-is-marine-superintendent
   - /marine-superintendent-faq
   - /marine-superintendent-jobs
   - /services
   - /marine-superintendent-marine-consultancy-superintendancy

5. Use professional, expert tone suitable for experienced marine professionals
6. Include specific examples and practical applications
7. Optimize for search engines with natural keyword usage

Generate the blog post in Markdown format with proper H2, H3 headers.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 3000,
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const generatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (!generatedContent) {
      throw new Error('No content generated from Gemini')
    }

    // Parse the generated content
    return parseGeminiResponse(generatedContent, sourceArticle, imageUrl)

  } catch (error) {
    console.error('Error calling Gemini API:', error)
    return null
  }
}

function parseGeminiResponse(content: string, sourceArticle: any, imageUrl: string) {
  // Extract title
  const titleMatch = content.match(/^#\s+(.+)$/m) || 
                     content.match(/^(.+)$/m)
  const title = titleMatch 
    ? titleMatch[1].replace(/^#+\s*/, '').trim()
    : `Marine Superintendent Guide: ${sourceArticle.title}`

  // Generate slug
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100)

  // Extract excerpt (first 150 words)
  const plainText = content.replace(/#+\s+/g, '').replace(/\*\*/g, '')
  const words = plainText.split(/\s+/)
  const excerpt = words.slice(0, 150).join(' ') + '...'

  return {
    title,
    slug,
    excerpt,
    content,
    category: 'regulations-compliance',
    tags: ['marine-superintendent', 'regulations', 'compliance', 'maritime-law', 'superintendent-guide'],
    image: imageUrl
  }
}

async function saveBlogPost(post: any) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Get or create category
  let { data: category } = await supabase
    .from('blog_categories')
    .select('id')
    .eq('slug', post.category)
    .single()

  if (!category) {
    const { data: newCategory } = await supabase
      .from('blog_categories')
      .insert({
        name: post.category,
        slug: post.category,
        color: '#3B82F6',
        description: 'Maritime regulations and compliance topics'
      })
      .select()
      .single()
    category = newCategory
  }

  // Get superadmin user
  const { data: adminUser } = await supabase
    .from('users')
    .select('id')
    .eq('role', 'superadmin')
    .single()

  // Insert blog post
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featured_image_url: post.image,
      category_id: category.id,
      author_id: adminUser?.id,
      status: 'published',
      published_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  // Insert tags
  if (post.tags && post.tags.length > 0) {
    await supabase
      .from('blog_post_tags')
      .insert(post.tags.map((tag: string) => ({
        post_id: data.id,
        tag: tag
      })))
  }

  return data
}
