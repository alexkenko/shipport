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

  const actionVerbs = ['audit', 'coordinate', 'verify', 'document', 'brief']
  const titleKeywords = Array.from(new Set(
    (sourceArticle.title || '')
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((keyword: string) => keyword.length > 3)
  ))

  const actionItems = actionVerbs.slice(0, 3).map((verb, index) => {
    const keyword = titleKeywords[index] || 'compliance'
    return `- **${verb.charAt(0).toUpperCase() + verb.slice(1)}** controls linked to "${keyword}" and log superintendent follow-up tasks.`
  })

  const executiveSummary = description.length > 0
    ? description
    : `A fresh update from ${sourceName} highlights operational considerations superintendents should evaluate immediately.`

  const insightList = keyInsights.length > 0
    ? keyInsights.map((insight) => `- ${insight}`).join('\n')
    : '- Assess how this development influences crew routines and resource allocation.\n- Map the news to ongoing KPIs in the superintendent dashboard.'

  const riskList = riskNotes.length > 0
    ? riskNotes.map((note) => `- ${note}`).join('\n')
    : '- Double-check statutory certificates approaching renewal windows.\n- Align voyage planning with any regulatory advisories referenced in the report.'

  const referenceTag = `${slug}-fallback`

  const content = `# ${title}

## Executive Briefing

${executiveSummary}

**Source evaluated:** ${sourceName}${publishedAt ? ` • Published ${formattedDate}` : ''}

## Situation Snapshot

${insightList}

## Superintendent Response Planner

${actionItems.join('\n')}
- **Engage** masters and chief engineers to capture on-board feedback linked to "${sourceArticle.title}".
- **Update** HSQE and commercial stakeholders with a concise situational note.

## Compliance & Risk Guardrails

${riskList}

### Coordination Notes

- Touch base with classification or flag representatives about any alerts tied to ${titleKeywords[0] || 'the highlighted topic'}.
- Validate crewing readiness, emergency drills, and record-keeping against this news item.

## Resource Hub for Superintendents

- [What is a Marine Superintendent?](/what-is-marine-superintendent)
- [Marine Superintendent FAQ](/marine-superintendent-faq)
- [Marine Superintendent Jobs](/marine-superintendent-jobs)
- [Consultancy & Superintendancy Services](/marine-superintendent-marine-consultancy-superintendancy)

## Quick Links

- Original report: ${sourceArticle.url ? `[${sourceName}](${sourceArticle.url})` : sourceName}
- Reference tag: \`${referenceTag}\`

---

Marine superintendents who log these insights today will be ready for stakeholder questions tomorrow.`

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shipinport.com'
  return {
    title,
    slug,
    excerpt: (description || extendedText || title).split(/\s+/).slice(0, 60).join(' ') + '...',
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
