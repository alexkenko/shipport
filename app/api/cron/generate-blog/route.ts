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

async function generateMarineThemedImage(title: string): Promise<string> {
  // Use a curated set of marine-themed Unsplash images
  // These images are high-quality and relevant to maritime themes
  const marineImages = [
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200&h=600&fit=crop&auto=format', // Ocean
    'https://images.unsplash.com/photo-1471922694854-ff1b6b366336?w=1200&h=600&fit=crop&auto=format', // Ships
    'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200&h=600&fit=crop&auto=format', // Port
    'https://images.unsplash.com/photo-1544552866-d5eec1388af6?w=1200&h=600&fit=crop&auto=format', // Maritime
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=600&fit=crop&auto=format', // Cargo
    'https://images.unsplash.com/photo-1579602592569-cf6fb48d2943?w=1200&h=600&fit=crop&auto=format'  // Vessel
  ]
  
  // Pick a random marine-themed image
  const randomIndex = Math.floor(Math.random() * marineImages.length)
  return marineImages[randomIndex]
}

async function generateBlogPostWithGemini(sourceArticle: any) {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY
    
    if (!geminiApiKey) {
      console.error('⚠️ GEMINI_API_KEY not configured')
      return createFallbackBlogPost(sourceArticle)
    }

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
    return parseGeminiResponse(generatedContent, sourceArticle, imageUrl)

  } catch (error) {
    console.error('Error calling Gemini API:', error)
    return createFallbackBlogPost(sourceArticle)
  }
}

function parseGeminiResponse(content: string, sourceArticle: any, imageUrl: string) {
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
    image: imageUrl
  }
}

function createFallbackBlogPost(sourceArticle: any) {
  const title = `Marine Superintendent Guide: ${sourceArticle.title}`
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100)

  const description = (sourceArticle.description || '').trim()
  const extendedText = `${description} ${sourceArticle.content || ''}`.replace(/\s+/g, ' ').trim()
  const sentences = extendedText
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.replace(/\[[^\]]*\]/g, '').trim())
    .filter((sentence) => sentence.length > 0)

  const keyInsights = sentences.slice(0, 4)
  const riskNotes = sentences.slice(4, 8)
  const sourceName = sourceArticle.source?.name || 'Maritime News'
  const publishedAt = sourceArticle.publishedAt ? new Date(sourceArticle.publishedAt) : null
  const formattedDate = publishedAt ? publishedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'recent developments'

  const actionVerbs = ['brief', 'audit', 'verify', 'coordinate', 'document']
  const titleKeywords = Array.from(new Set(
    (sourceArticle.title || '')
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((keyword: string) => keyword.length > 3)
  ))

  const actionItems = actionVerbs.slice(0, 3).map((verb, index) => {
    const keyword = titleKeywords[index] || 'operations'
    return `- **${verb.charAt(0).toUpperCase() + verb.slice(1)}** onboard procedures connected to "${keyword}" and capture superintendent sign-off.`
  })

  const executiveSummary = description.length > 0
    ? description
    : `Key developments from ${sourceName} on ${formattedDate} indicate emerging considerations for marine superintendents overseeing day-to-day fleet readiness.`

  const insightList = keyInsights.length > 0
    ? keyInsights.map((insight) => `- ${insight}`).join('\n')
    : '- Monitor crew morale data sources and correlate with current voyage conditions.\n- Review maintenance backlogs that could magnify the reported issue.'

  const riskList = riskNotes.length > 0
    ? riskNotes.map((note) => `- ${note}`).join('\n')
    : '- Validate compliance records for upcoming port calls.\n- Confirm contingency plans with crewing and HSQE leads.'

  const referenceTag = `${slug}-fallback`

  const content = `# ${title}

## Executive Briefing

${executiveSummary}

**Source evaluated:** ${sourceName}${publishedAt ? ` • Published ${formattedDate}` : ''}

## What Happened & Why It Matters

${insightList}

## Superintendent Action Grid

${actionItems.join('\n')}
- **Engage** with crewing teams to cross-check incident reporting cadence linked to this story.
- **Update** the HSQE dashboard with any new KPIs impacted by "${sourceArticle.title}".

## Compliance & Risk Watch

${riskList}

### Cross-Department Alignment

- Liaise with technical managers about class or flag notifications related to ${titleKeywords[0] || 'the highlighted development'}.
- Share a short situation update with commercial and chartering teams so voyage plans can be adjusted proactively.

## Superintendent Toolkit

- [What is a Marine Superintendent?](/what-is-marine-superintendent)
- [Marine Superintendent FAQ](/marine-superintendent-faq)
- [Marine Superintendent Jobs](/marine-superintendent-jobs)
- [Consultancy & Superintendancy Services](/marine-superintendent-marine-consultancy-superintendancy)

## Quick Reference

- Original report: ${sourceArticle.url ? `[${sourceName}](${sourceArticle.url})` : sourceName}
- Tag for knowledge base: \`${referenceTag}\`

---

Staying informed allows superintendents to keep vessels safe, compliant, and profitable. Capture follow-up tasks in the superintendent log and schedule a review during the next operational call.`

  const excerptSource = executiveSummary || extendedText || title
  const excerpt = excerptSource.split(/\s+/).slice(0, 60).join(' ') + '...'

  return {
    title,
    slug,
    excerpt,
    content,
    category: 'regulations-compliance',
    tags: ['marine-superintendent', 'regulations', 'compliance'],
    image: sourceArticle.urlToImage || 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200&h=600&fit=crop&auto=format'
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

