import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const MARINE_REGULATION_SOURCES = [
  {
    name: 'OCIMF',
    url: 'https://www.ocimf.org/news',
    selector: 'article'
  },
  {
    name: 'Marine Insight',
    url: 'https://www.marineinsight.com/category/maritime-law/',
    selector: 'article'
  },
  {
    name: 'IMO',
    url: 'https://www.imo.org/en/MediaCentre/Pages/Default.aspx',
    selector: '.news-item'
  }
]

const targetKeywords = [
  'marine superintendent',
  'superintendency',
  'maritime superintendent',
  'port superintendent',
  'superintendent duties',
  'superintendent responsibilities'
]

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  
  // Verify cron secret
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('🚀 Starting automated blog generation...')
    
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

    // Step 4: Ping search engines for indexing
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shipinport.com'
      await fetch(`${siteUrl}/api/sitemap/ping`)
      console.log('✅ Sitemap pinged to search engines')
    } catch (pingError) {
      console.error('⚠️ Failed to ping sitemap:', pingError)
    }

    return NextResponse.json({ 
      success: true, 
      postId: result.id,
      title: blogPost.title,
      slug: blogPost.slug 
    })

  } catch (error: any) {
    console.error('❌ Error in blog generation:', error)
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
    const response = await fetch(`${siteUrl}/api/news?limit=5`)
    
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

async function generateBlogPostWithGemini(sourceArticle: any) {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY
    
    if (!geminiApiKey) {
      console.error('⚠️ GEMINI_API_KEY not configured')
      return createFallbackBlogPost(sourceArticle)
    }

    console.log('🤖 Calling Gemini API...')
    
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
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
    return parseGeminiResponse(generatedContent, sourceArticle)

  } catch (error) {
    console.error('Error calling Gemini API:', error)
    return createFallbackBlogPost(sourceArticle)
  }
}

function parseGeminiResponse(content: string, sourceArticle: any) {
  // Extract title (usually first line or # Title)
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
    image: sourceArticle.urlToImage || 'https://images.unsplash.com/photo-1544552866-d5eec1388af6?w=1200&h=600&fit=crop'
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

${sourceArticle.description}

This article provides marine superintendents with insights into recent maritime industry developments and their practical implications for daily operations.

## Key Implications for Marine Superintendents

As a marine superintendent, staying informed about maritime regulations and industry developments is crucial for maintaining compliance and operational excellence. This recent development in the maritime sector has several important implications:

### Operational Impact

Marine superintendents must understand how these changes affect vessel operations, port state control requirements, and regulatory compliance. The evolving nature of maritime regulations requires continuous education and adaptation.

### Compliance Requirements

Marine superintendents are responsible for ensuring vessels comply with international maritime regulations. This development emphasizes the importance of:

- Regular vessel inspections
- Documentation compliance
- Crew competency verification
- Emergency preparedness
- Environmental compliance

## Best Practices for Marine Superintendents

Based on this industry development, marine superintendents should:

1. **Stay Updated**: Regularly monitor industry news and regulatory changes
2. **Network**: Engage with professional communities and industry forums  
3. **Continuous Learning**: Invest in professional development and certifications
4. **Risk Assessment**: Evaluate how industry changes impact operations
5. **Documentation**: Maintain comprehensive records of compliance activities

## Practical Applications

Marine superintendents working in port management, vessel operations, or marine consulting must adapt their practices to align with industry standards. This includes:

- Port state control inspections
- ISM code compliance
- ISPS code implementation
- MLC 2006 compliance
- Environmental regulations

## Conclusion

Marine superintendents play a vital role in ensuring maritime safety, compliance, and operational excellence. Keeping abreast of industry developments is essential for professional success.

For more information about becoming a marine superintendent, visit our [Marine Superintendent FAQ](/marine-superintendent-faq) or explore [career opportunities](/marine-superintendent-jobs).

---

*Source: ${sourceArticle.source?.name || 'Maritime News'}*

For more marine superintendent resources, visit [ShipPort.com](/).`

  return {
    title,
    slug,
    excerpt: sourceArticle.description.substring(0, 150) + '...',
    content,
    category: 'regulations-compliance',
    tags: ['marine-superintendent', 'regulations', 'compliance'],
    image: sourceArticle.urlToImage || 'https://images.unsplash.com/photo-1544552866-d5eec1388af6?w=1200&h=600&fit=crop'
  }
}

async function saveBlogPost(blogPost: any) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, serviceKey)

  // Get author
  const { data: author } = await supabase
    .from('users')
    .select('id')
    .eq('email', 'kenkadzealex@gmail.com')
    .single()

  // Get category
  const { data: category } = await supabase
    .from('blog_categories')
    .select('id')
    .eq('slug', blogPost.category)
    .single()

  // Check if post with this slug already exists
  const { data: existing } = await supabase
    .from('blog_posts')
    .select('id')
    .eq('slug', blogPost.slug)
    .single()

  if (existing) {
    console.log(`⚠️ Post with slug "${blogPost.slug}" already exists. Skipping.`)
    return existing
  }

  // Calculate reading time
  const wordCount = blogPost.content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)

  // Insert blog post
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      title: blogPost.title,
      slug: blogPost.slug,
      excerpt: blogPost.excerpt,
      content: blogPost.content,
      featured_image_url: blogPost.image,
      author_id: author?.id,
      category_id: category?.id,
      meta_title: blogPost.title,
      meta_description: blogPost.excerpt.substring(0, 150),
      tags: blogPost.tags,
      reading_time: readingTime,
      status: 'published',
      published_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('Database error:', error)
    throw error
  }

  return data
}

