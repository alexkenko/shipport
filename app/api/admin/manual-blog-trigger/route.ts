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
    let blogPost = await generateBlogPostWithGemini(articles[0])
    
    if (!blogPost) {
      console.log('⚠️ Gemini failed, using fallback blog post')
      blogPost = createFallbackBlogPost(articles[0])
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
  // Use our logo instead of random images
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shipinport.com'
  return `${siteUrl}/logo.jpg`
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

Write a comprehensive 1500-word ORIGINAL analysis-focused blog post that:

1. DO NOT COPY the original article. Write your own analysis and interpretation
2. Focus on implications for marine superintendents specifically
3. Add your own insights, examples, and maritime industry expertise
4. Target the keyword "marine superintendent" naturally throughout
5. Follow this structure:
   - Executive Summary with YOUR analysis (200 words)
   - Key Implications for Marine Superintendents - deep analysis (400 words)
   - How This Affects Daily Superintendent Responsibilities - original insights (300 words)
   - Compliance Requirements and Best Practices - your expert recommendations (400 words)
   - Conclusion with Actionable Takeaways (200 words)

6. Include 3-5 internal links to these pages:
   - /what-is-marine-superintendent
   - /marine-superintendent-faq
   - /marine-superintendent-jobs
   - /services
   - /marine-superintendent-marine-consultancy-superintendancy

7. Use professional, expert tone suitable for experienced marine professionals
8. Include specific examples, case studies, and practical applications
9. Optimize for search engines with natural keyword usage

IMPORTANT: Write original content - analyze the news topic but provide your own insights, not a summary of the original article.

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

function createFallbackBlogPost(sourceArticle: any) {
  const title = `Marine Superintendent Guide: ${sourceArticle.title}`
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100)

  const content = `# ${title}

## Executive Summary

This analysis examines recent maritime developments and their specific implications for marine superintendent operations. Marine superintendents play a critical role in vessel management, compliance, and operational excellence. This article provides actionable insights based on industry developments.

## Key Implications for Marine Superintendents

Marine superintendents serve as the critical link between vessel operators, port authorities, and regulatory bodies. The maritime industry's dynamic nature requires continuous adaptation and expertise in several key areas:

### Operational Impact

Marine superintendents must navigate complex regulatory landscapes while ensuring vessel efficiency and safety. Key responsibilities include:

- Pre-arrival preparation and documentation
- Port state control coordination
- Vessel inspection coordination
- Emergency response planning
- Regulatory compliance verification

### Compliance Requirements

International maritime regulations continue to evolve, requiring marine superintendents to stay current with:

- SOLAS (Safety of Life at Sea) requirements
- MARPOL (Marine Pollution) compliance
- ISM Code (International Safety Management)
- ISPS Code (International Ship and Port Facility Security)
- MLC 2006 (Maritime Labour Convention)

## Best Practices for Marine Superintendents

To excel in this role, marine superintendents should:

1. Maintain current certifications and training
2. Build relationships with port authorities and classification societies
3. Stay informed about regulatory changes
4. Document all inspections and compliance activities
5. Proactively identify potential issues before they escalate

## Conclusion

Marine superintendents are essential professionals in the maritime industry, ensuring vessel compliance, safety, and operational excellence. Staying informed about industry developments and maintaining expertise in regulatory compliance is crucial for career success.

**Disclaimer:** This article is an original analysis focusing on marine superintendent operations. News inspiration: ${sourceArticle.source?.name || 'Maritime News'} - [Original article](${sourceArticle.url}).

For more marine superintendent resources and career opportunities, visit [ShipPort.com](/).`

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shipinport.com'
  return {
    title,
    slug,
    excerpt: sourceArticle.description.substring(0, 150) + '...',
    content,
    category: 'regulations-compliance',
    tags: ['marine-superintendent', 'regulations', 'compliance'],
    image: `${siteUrl}/logo.jpg`
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

  // Ensure category exists
  if (!category) {
    throw new Error('Failed to get or create category')
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
