import { NextResponse } from 'next/server';

// Force this API route to run at runtime, not build time
export const dynamic = 'force-dynamic'

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
    
    // Try multiple news sources to get real maritime news
    const articles = await fetchRealMaritimeNews(limit);
    
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news articles' },
      { status: 500 }
    );
  }
}

async function fetchRealMaritimeNews(limit: number): Promise<NewsArticle[]> {
  const newsSources = [
    {
      name: 'Marine Insight',
      fetch: () => fetchFromMarineInsight()
    },
    {
      name: 'OCIMF',
      fetch: () => fetchFromOCIMF()
    },
    {
      name: 'IMO',
      fetch: () => fetchFromIMO()
    }
  ];

  const allArticles: NewsArticle[] = [];
  
  // Try each source and collect articles
  for (const source of newsSources) {
    try {
      console.log(`Trying to fetch from ${source.name}...`);
      const articles = await source.fetch();
      if (articles && articles.length > 0) {
        allArticles.push(...articles);
        console.log(`✅ Successfully fetched ${articles.length} articles from ${source.name}`);
        
        // If we have enough articles, break early
        if (allArticles.length >= limit * 2) {
          break;
        }
      }
    } catch (error) {
      console.warn(`❌ Failed to fetch from ${source.name}:`, error instanceof Error ? error.message : String(error));
      continue;
    }
  }

  // Remove duplicates based on title similarity
  const uniqueArticles = removeDuplicateArticles(allArticles);
  
  // Sort by published date (newest first)
  uniqueArticles.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // Return limited results or empty array
  if (uniqueArticles.length > 0) {
    console.log(`📰 Returning ${Math.min(uniqueArticles.length, limit)} real maritime news articles`);
    return uniqueArticles.slice(0, limit);
  } else {
    console.log('⚠️ No real news found, returning empty array');
    return [];
  }
}

async function fetchFromRSSFeed(rssUrl: string, sourceName: string): Promise<NewsArticle[]> {
  try {
    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'ShipinPort.com/1.0 (Maritime News Reader)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
    });

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`);
    }

    const xmlText = await response.text();
    return parseRSSFeed(xmlText, sourceName);
  } catch (error) {
    console.error(`Error fetching RSS from ${sourceName}:`, error);
    throw error;
  }
}

function parseRSSFeed(xmlText: string, sourceName: string): NewsArticle[] {
  const articles: NewsArticle[] = [];
  
  try {
    // Parse RSS/XML using regex patterns
    const itemPattern = /<item>[\s\S]*?<\/item>/gi;
    const items = xmlText.match(itemPattern) || [];

    for (const item of items) {
      const article = extractArticleFromRSSItem(item, sourceName);
      if (article && isMaritimeRelated(article.title, article.description)) {
        articles.push(article);
      }
    }
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
  }

  return articles;
}

function extractArticleFromRSSItem(itemXml: string, sourceName: string): NewsArticle | null {
  try {
    // Extract title
    const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/i);
    const title = titleMatch ? (titleMatch[1] || titleMatch[2]) : '';
    
    // Extract description
    const descMatch = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/i);
    const description = descMatch ? (descMatch[1] || descMatch[2]) : '';
    
    // Extract URL
    const linkMatch = itemXml.match(/<link>(.*?)<\/link>/i);
    const url = linkMatch ? linkMatch[1] : '';
    
    // Extract image
    const imageMatch = itemXml.match(/<media:content[^>]*url="([^"]+)"|<enclosure[^>]*url="([^"]+)"|<image><!\[CDATA\[(.*?)\]\]><\/image>/i);
    const urlToImage = imageMatch ? (imageMatch[1] || imageMatch[2] || imageMatch[3]) : '';
    
    // Extract published date
    const dateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>|<dc:date>(.*?)<\/dc:date>/i);
    const publishedAt = dateMatch ? formatDate(dateMatch[1] || dateMatch[2]) : new Date().toISOString();

    if (title && title.length > 10 && url) {
      return {
        title: cleanText(title),
        description: cleanText(description) || 'Read the full article for more details.',
        url: url,
        urlToImage: urlToImage || getDefaultMaritimeImage(),
        publishedAt,
        source: { name: sourceName },
        category: getCategoryFromTitle(title)
      };
    }
  } catch (error) {
    console.error('Error extracting article from RSS item:', error);
  }
  
  return null;
}

async function fetchFromGCaptainDirect(): Promise<NewsArticle[]> {
  try {
    const response = await fetch('https://gcaptain.com', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Gcaptain: ${response.status}`);
    }

    const html = await response.text();
    return parseGCaptainHTML(html);
  } catch (error) {
    console.error('Error fetching from Gcaptain directly:', error);
    throw error;
  }
}

function parseGCaptainHTML(html: string): NewsArticle[] {
  const articles: NewsArticle[] = [];
  
  try {
    // Look for article containers in Gcaptain's structure
    const articlePatterns = [
      /<article[^>]*>[\s\S]*?<\/article>/gi,
      /<div[^>]*class="[^"]*post[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
      /<div[^>]*class="[^"]*entry[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
    ];
    
    let allMatches: string[] = [];
    for (const pattern of articlePatterns) {
      const matches = html.match(pattern) || [];
      allMatches = [...allMatches, ...matches];
      if (matches.length > 0) break;
    }
    
    for (const articleHtml of allMatches.slice(0, 10)) {
      const article = extractArticleFromHTML(articleHtml);
      if (article && isMaritimeRelated(article.title, article.description)) {
        articles.push(article);
      }
    }
  } catch (error) {
    console.error('Error parsing Gcaptain HTML:', error);
  }

  return articles;
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
    
    // Extract description
    const descMatch = html.match(/<p[^>]*>([^<]+)<\/p>/i);
    const description = descMatch ? descMatch[1].trim() : '';
    
    // Extract URL
    const urlMatch = html.match(/href="([^"]+)"/i);
    const url = urlMatch ? urlMatch[1] : '';
    
    // Extract image
    const imgMatch = html.match(/<img[^>]+src="([^"]+)"/i);
    const urlToImage = imgMatch ? imgMatch[1] : '';
    
    // Extract date
    const dateMatch = html.match(/<time[^>]*>([^<]+)<\/time>/i) || 
                     html.match(/datetime="([^"]+)"/i) ||
                     html.match(/(\d{4}-\d{2}-\d{2})/);
    const publishedAt = dateMatch ? formatDate(dateMatch[1] || dateMatch[0]) : new Date().toISOString();
    
    return {
      title: cleanText(title),
      description: cleanText(description) || 'Read the full article for more details.',
      url: url.startsWith('http') ? url : `https://gcaptain.com${url}`,
      urlToImage: urlToImage || getDefaultMaritimeImage(),
      publishedAt,
      source: { name: 'gCaptain' },
      category: getCategoryFromTitle(title)
    };
  } catch (error) {
    console.error('Error extracting article from HTML:', error);
    return null;
  }
}

async function fetchFromNewsAPI(): Promise<NewsArticle[]> {
  try {
    // Try to use NewsAPI if key is available
    const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
    if (!apiKey) {
      throw new Error('NewsAPI key not configured');
    }

    const queries = [
      'maritime OR shipping OR vessel OR port OR marine OR superintendent',
      'IMO OR ISM OR ISPS OR MLC OR SOLAS OR MARPOL',
      'Maersk OR MSC OR CMA CGM OR Hapag-Lloyd OR shipping company'
    ];

    const allArticles: NewsArticle[] = [];

    for (const query of queries) {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`,
          {
            headers: {
              'User-Agent': 'ShipinPort.com/1.0'
            }
          }
        );

        if (!response.ok) {
          continue;
        }

        const data = await response.json();
        
        if (data.status === 'ok' && data.articles) {
          const maritimeArticles = data.articles
            .filter((article: any) => isMaritimeRelated(article.title, article.description))
            .map((article: any) => ({
              title: cleanText(article.title),
              description: cleanText(article.description),
              url: article.url,
              urlToImage: article.urlToImage || getDefaultMaritimeImage(),
              publishedAt: article.publishedAt,
              source: { name: article.source.name },
              category: getCategoryFromTitle(article.title)
            }));
          
          allArticles.push(...maritimeArticles);
        }
      } catch (error) {
        console.warn(`NewsAPI query failed for "${query}":`, error);
        continue;
      }
    }

    return allArticles;
  } catch (error) {
    console.error('Error fetching from NewsAPI:', error);
    throw error;
  }
}

// Fetch from Marine Insight
async function fetchFromMarineInsight(): Promise<NewsArticle[]> {
  try {
    const response = await fetch('https://www.marineinsight.com/category/shipping-news/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Marine Insight: ${response.status}`);
    }

    const html = await response.text();
    return parseMarineInsightHTML(html);
  } catch (error) {
    console.error('Error fetching from Marine Insight:', error);
    throw error;
  }
}

function parseMarineInsightHTML(html: string): NewsArticle[] {
  const articles: NewsArticle[] = [];
  
  try {
    // Parse article titles and links
    const titlePattern = /<h[1-6][^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>[\s\S]*?<\/h[1-6]>/gi;
    const matches = html.match(titlePattern) || [];
    
    for (const match of matches.slice(0, 10)) {
      const urlMatch = match.match(/href="([^"]+)"/);
      const titleMatch = match.match(/>([^<]+)</);
      
      if (urlMatch && titleMatch) {
        const url = urlMatch[1].startsWith('http') ? urlMatch[1] : `https://www.marineinsight.com${urlMatch[1]}`;
        const title = cleanText(titleMatch[1]);
        
        articles.push({
          title,
          description: title,
          url,
          urlToImage: getDefaultMaritimeImage(),
          publishedAt: new Date().toISOString(),
          source: { name: 'Marine Insight' },
          category: getCategoryFromTitle(title)
        });
      }
    }
  } catch (error) {
    console.error('Error parsing Marine Insight HTML:', error);
  }

  return articles;
}

// Fetch from OCIMF
async function fetchFromOCIMF(): Promise<NewsArticle[]> {
  try {
    const response = await fetch('https://www.ocimf.org/news-and-events/news/newsletter', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch OCIMF: ${response.status}`);
    }

    const html = await response.text();
    return parseOCIMFHTML(html);
  } catch (error) {
    console.error('Error fetching from OCIMF:', error);
    throw error;
  }
}

function parseOCIMFHTML(html: string): NewsArticle[] {
  const articles: NewsArticle[] = [];
  
  try {
    // Parse newsletter items
    const itemPattern = /<a[^>]*class="[^"]*newsletter-item[^"]*"[^>]*href="([^"]+)"[^>]*>[\s\S]*?<h[1-6][^>]*>([^<]+)<\/h[1-6]>[\s\S]*?<p[^>]*>([^<]+)<\/p>/gi;
    const matches = Array.from(html.matchAll(itemPattern));
    
    for (const match of matches.slice(0, 10)) {
      const url = match[1].startsWith('http') ? match[1] : `https://www.ocimf.org${match[1]}`;
      const title = cleanText(match[2]);
      const description = cleanText(match[3]);
      
      articles.push({
        title,
        description,
        url,
        urlToImage: getDefaultMaritimeImage(),
        publishedAt: new Date().toISOString(),
        source: { name: 'OCIMF' },
        category: getCategoryFromTitle(title)
      });
    }
  } catch (error) {
    console.error('Error parsing OCIMF HTML:', error);
  }

  return articles;
}

// Fetch from IMO
async function fetchFromIMO(): Promise<NewsArticle[]> {
  try {
    const response = await fetch('https://www.imo.org/en/mediacentre/pages/whatsnew.aspx', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch IMO: ${response.status}`);
    }

    const html = await response.text();
    return parseIMOHTML(html);
  } catch (error) {
    console.error('Error fetching from IMO:', error);
    throw error;
  }
}

function parseIMOHTML(html: string): NewsArticle[] {
  const articles: NewsArticle[] = [];
  
  try {
    // Parse news items
    const itemPattern = /<article[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>[\s\S]*?<h[1-6][^>]*>([^<]+)<\/h[1-6]>[\s\S]*?<\/article>/gi;
    const matches = Array.from(html.matchAll(itemPattern));
    
    for (const match of matches.slice(0, 10)) {
      const url = match[1].startsWith('http') ? match[1] : `https://www.imo.org${match[1]}`;
      const title = cleanText(match[2]);
      
      articles.push({
        title,
        description: title,
        url,
        urlToImage: getDefaultMaritimeImage(),
        publishedAt: new Date().toISOString(),
        source: { name: 'IMO' },
        category: getCategoryFromTitle(title)
      });
    }
  } catch (error) {
    console.error('Error parsing IMO HTML:', error);
  }

  return articles;
}

function isMaritimeRelated(title: string, description: string): boolean {
  const maritimeKeywords = [
    'maritime', 'shipping', 'vessel', 'port', 'harbor', 'marine', 'superintendent',
    'IMO', 'ISM', 'ISPS', 'MLC', 'SOLAS', 'MARPOL', 'container', 'cargo',
    'seafarer', 'crew', 'shipyard', 'drydock', 'inspection', 'audit',
    'classification society', 'flag state', 'PSC', 'port state control',
    'ship', 'boat', 'tanker', 'bulk carrier', 'cruise', 'ferry', 'yacht',
    'nautical', 'ocean', 'sea', 'coastal', 'offshore', 'underwater',
    'maritime law', 'shipping industry', 'marine insurance', 'cargo handling',
    'port operations', 'vessel management', 'marine engineering', 'naval architecture'
  ];
  
  const text = (title + ' ' + description).toLowerCase();
  return maritimeKeywords.some(keyword => text.includes(keyword.toLowerCase()));
}

function removeDuplicateArticles(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Set();
  return articles.filter(article => {
    // Create a simple hash of the title for deduplication
    const titleHash = article.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seen.has(titleHash)) {
      return false;
    }
    seen.add(titleHash);
    return true;
  });
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
    .replace(/<[^>]*>/g, '') // Remove HTML tags
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

function getDefaultMaritimeImage(): string {
  const maritimeImages = [
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&h=400&fit=crop&crop=center'
  ];
  return maritimeImages[Math.floor(Math.random() * maritimeImages.length)];
}

function getSampleMaritimeNews(limit: number): NewsArticle[] {
  const sampleNews: NewsArticle[] = [
    {
      title: "IMO Adopts New Regulations for Ship Energy Efficiency",
      description: "The International Maritime Organization has introduced updated guidelines for ship energy efficiency management, focusing on reducing greenhouse gas emissions from maritime transport.",
      url: "https://gcaptain.com/imo-energy-efficiency-regulations",
      urlToImage: getDefaultMaritimeImage(),
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: { name: "gCaptain" },
      category: "Regulations"
    },
    {
      title: "Port of Singapore Reports Record Container Throughput",
      description: "Singapore's port authority announces a new monthly record for container handling, demonstrating the port's continued growth in global maritime trade.",
      url: "https://gcaptain.com/singapore-record-throughput",
      urlToImage: getDefaultMaritimeImage(),
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      source: { name: "gCaptain" },
      category: "Ports"
    },
    {
      title: "New AI Technology Enhances Marine Navigation Systems",
      description: "Leading maritime technology companies unveil artificial intelligence-powered navigation systems that improve safety and efficiency for vessel operations.",
      url: "https://gcaptain.com/ai-navigation-systems",
      urlToImage: getDefaultMaritimeImage(),
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      source: { name: "gCaptain" },
      category: "Technology"
    },
    {
      title: "Marine Superintendent Certification Program Expands",
      description: "Professional marine superintendent certification programs are expanding globally to meet the growing demand for qualified maritime professionals.",
      url: "https://gcaptain.com/superintendent-certification",
      urlToImage: getDefaultMaritimeImage(),
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      source: { name: "gCaptain" },
      category: "Inspections"
    },
    {
      title: "Crew Welfare Standards Strengthened Under MLC 2006",
      description: "The Maritime Labour Convention continues to evolve with enhanced standards for seafarer welfare, including improved living conditions and fair employment practices.",
      url: "https://gcaptain.com/mlc-crew-welfare",
      urlToImage: getDefaultMaritimeImage(),
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      source: { name: "gCaptain" },
      category: "Crew"
    },
    {
      title: "Container Shipping Rates Stabilize After Market Volatility",
      description: "Global container shipping rates show signs of stabilization following recent market volatility, with industry experts predicting steady growth.",
      url: "https://gcaptain.com/container-rates-stabilize",
      urlToImage: getDefaultMaritimeImage(),
      publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      source: { name: "gCaptain" },
      category: "Cargo"
    }
  ];

  return sampleNews.slice(0, limit);
}