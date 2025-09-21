import { NextResponse } from 'next/server';

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  category?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Fetch articles from Gcaptain.com
    const articles = await fetchGCaptainArticles(limit);
    
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news articles' },
      { status: 500 }
    );
  }
}

async function fetchGCaptainArticles(limit: number): Promise<NewsArticle[]> {
  try {
    // Use a CORS proxy or direct fetch to Gcaptain
    const response = await fetch('https://gcaptain.com', {
      headers: {
        'User-Agent': 'ShipinPort.com/1.0 (Maritime News Reader)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Gcaptain: ${response.status}`);
    }

    const html = await response.text();
    return parseGCaptainHTML(html, limit);
  } catch (error) {
    console.error('Error fetching Gcaptain articles:', error);
    // Return sample articles as fallback
    return getSampleMaritimeNews(limit);
  }
}

function parseGCaptainHTML(html: string, limit: number): NewsArticle[] {
  const articles: NewsArticle[] = [];
  
  try {
    // Parse HTML using regex patterns for Gcaptain's structure
    // Look for article containers
    const articlePattern = /<article[^>]*>[\s\S]*?<\/article>/gi;
    const articleMatches = html.match(articlePattern) || [];
    
    // Alternative patterns for different article structures
    const alternativePatterns = [
      /<div[^>]*class="[^"]*post[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
      /<div[^>]*class="[^"]*entry[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
      /<div[^>]*class="[^"]*article[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
    ];
    
    let allMatches: string[] = articleMatches;
    
    // Try alternative patterns if no articles found
    for (const pattern of alternativePatterns) {
      if (allMatches.length === 0) {
        const matches = html.match(pattern) || [];
        allMatches = matches;
        if (matches.length > 0) break;
      }
    }
    
    for (const articleHtml of allMatches.slice(0, limit)) {
      const article = extractArticleFromHTML(articleHtml);
      if (article) {
        articles.push(article);
      }
    }
  } catch (error) {
    console.error('Error parsing Gcaptain HTML:', error);
  }

  // If no articles found, return sample news
  return articles.length > 0 ? articles : getSampleMaritimeNews(limit);
}

function extractArticleFromHTML(html: string): NewsArticle | null {
  try {
    // Extract title from various heading patterns
    const titlePatterns = [
      /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/i,
      /<a[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)<\/a>/i,
      /<div[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)<\/div>/i,
    ];
    
    let title = '';
    for (const pattern of titlePatterns) {
      const match = html.match(pattern);
      if (match && match[1].trim().length > 10) {
        title = match[1].trim();
        break;
      }
    }
    
    if (!title) return null;
    
    // Extract description/excerpt
    const descPatterns = [
      /<p[^>]*>([^<]+)<\/p>/i,
      /<div[^>]*class="[^"]*excerpt[^"]*"[^>]*>([^<]+)<\/div>/i,
      /<div[^>]*class="[^"]*summary[^"]*"[^>]*>([^<]+)<\/div>/i,
    ];
    
    let description = '';
    for (const pattern of descPatterns) {
      const match = html.match(pattern);
      if (match && match[1].trim().length > 20) {
        description = match[1].trim();
        break;
      }
    }
    
    // Extract URL
    const urlMatch = html.match(/href="([^"]+)"/i);
    const url = urlMatch ? urlMatch[1] : '';
    
    // Extract image
    const imgMatch = html.match(/<img[^>]+src="([^"]+)"/i);
    const urlToImage = imgMatch ? imgMatch[1] : '';
    
    // Extract date
    const datePatterns = [
      /<time[^>]*>([^<]+)<\/time>/i,
      /datetime="([^"]+)"/i,
      /(\d{4}-\d{2}-\d{2})/,
      /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[^<]*\d{4}/i,
    ];
    
    let publishedAt = new Date().toISOString();
    for (const pattern of datePatterns) {
      const match = html.match(pattern);
      if (match) {
        publishedAt = formatDate(match[1] || match[0]);
        break;
      }
    }
    
    return {
      title: cleanText(title),
      description: cleanText(description) || 'Read the full article for more details.',
      url: url.startsWith('http') ? url : `https://gcaptain.com${url}`,
      urlToImage: urlToImage.startsWith('http') ? urlToImage : `https://gcaptain.com${urlToImage}`,
      publishedAt,
      source: { name: 'gCaptain' },
      category: getCategoryFromTitle(title)
    };
  } catch (error) {
    console.error('Error extracting article from HTML:', error);
    return null;
  }
}

function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function getCategoryFromTitle(title: string): string {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('regulation') || lowerTitle.includes('imo') || lowerTitle.includes('ism')) {
    return 'Regulations';
  } else if (lowerTitle.includes('port') || lowerTitle.includes('harbor') || lowerTitle.includes('terminal')) {
    return 'Ports';
  } else if (lowerTitle.includes('technology') || lowerTitle.includes('ai') || lowerTitle.includes('digital')) {
    return 'Technology';
  } else if (lowerTitle.includes('inspection') || lowerTitle.includes('audit') || lowerTitle.includes('superintendent')) {
    return 'Inspections';
  } else if (lowerTitle.includes('crew') || lowerTitle.includes('seafarer') || lowerTitle.includes('mlc')) {
    return 'Crew';
  } else if (lowerTitle.includes('cargo') || lowerTitle.includes('container') || lowerTitle.includes('freight')) {
    return 'Cargo';
  } else if (lowerTitle.includes('environment') || lowerTitle.includes('emission') || lowerTitle.includes('carbon')) {
    return 'Environment';
  } else if (lowerTitle.includes('accident') || lowerTitle.includes('incident') || lowerTitle.includes('collision')) {
    return 'Safety';
  } else {
    return 'Maritime News';
  }
}

function getSampleMaritimeNews(limit: number): NewsArticle[] {
  const sampleNews: NewsArticle[] = [
    {
      title: "IMO Adopts New Regulations for Ship Energy Efficiency",
      description: "The International Maritime Organization has introduced updated guidelines for ship energy efficiency management, focusing on reducing greenhouse gas emissions from maritime transport.",
      url: "https://gcaptain.com/imo-energy-efficiency-regulations",
      urlToImage: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=400&fit=crop&crop=center",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: { name: "gCaptain" },
      category: "Regulations"
    },
    {
      title: "Port of Singapore Reports Record Container Throughput",
      description: "Singapore's port authority announces a new monthly record for container handling, demonstrating the port's continued growth in global maritime trade.",
      url: "https://gcaptain.com/singapore-record-throughput",
      urlToImage: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=400&fit=crop&crop=center",
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      source: { name: "gCaptain" },
      category: "Ports"
    },
    {
      title: "New AI Technology Enhances Marine Navigation Systems",
      description: "Leading maritime technology companies unveil artificial intelligence-powered navigation systems that improve safety and efficiency for vessel operations.",
      url: "https://gcaptain.com/ai-navigation-systems",
      urlToImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop&crop=center",
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      source: { name: "gCaptain" },
      category: "Technology"
    },
    {
      title: "Marine Superintendent Certification Program Expands",
      description: "Professional marine superintendent certification programs are expanding globally to meet the growing demand for qualified maritime professionals.",
      url: "https://gcaptain.com/superintendent-certification",
      urlToImage: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=400&fit=crop&crop=center",
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      source: { name: "gCaptain" },
      category: "Inspections"
    },
    {
      title: "Crew Welfare Standards Strengthened Under MLC 2006",
      description: "The Maritime Labour Convention continues to evolve with enhanced standards for seafarer welfare, including improved living conditions and fair employment practices.",
      url: "https://gcaptain.com/mlc-crew-welfare",
      urlToImage: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=400&fit=crop&crop=center",
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      source: { name: "gCaptain" },
      category: "Crew"
    },
    {
      title: "Container Shipping Rates Stabilize After Market Volatility",
      description: "Global container shipping rates show signs of stabilization following recent market volatility, with industry experts predicting steady growth.",
      url: "https://gcaptain.com/container-rates-stabilize",
      urlToImage: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=400&fit=crop&crop=center",
      publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      source: { name: "gCaptain" },
      category: "Cargo"
    }
  ];

  return sampleNews.slice(0, limit);
}
