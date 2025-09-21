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

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

// Maritime-related keywords for filtering news
const MARITIME_KEYWORDS = [
  'maritime', 'shipping', 'vessel', 'port', 'harbor', 'marine', 'superintendent',
  'IMO', 'ISM', 'ISPS', 'MLC', 'SOLAS', 'MARPOL', 'container', 'cargo',
  'seafarer', 'crew', 'shipyard', 'drydock', 'inspection', 'audit',
  'classification society', 'flag state', 'PSC', 'port state control'
];

export class NewsService {
  private apiKey: string;
  private baseUrl = 'https://newsapi.org/v2';

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY || '';
  }

  async fetchMaritimeNews(limit: number = 10): Promise<NewsArticle[]> {
    if (!this.apiKey) {
      console.warn('NewsAPI key not configured, returning empty results');
      return [];
    }

    try {
      // Try multiple queries to get maritime news from different sources
      const queries = [
        // Search for maritime keywords
        `maritime OR shipping OR vessel OR port OR marine OR superintendent`,
        // Search for IMO and regulations
        `IMO OR ISM OR ISPS OR MLC OR SOLAS OR MARPOL`,
        // Search for specific maritime companies and organizations
        `Maersk OR MSC OR CMA CGM OR Hapag-Lloyd OR shipping company`
      ];

      const allArticles: NewsArticle[] = [];

      for (const query of queries) {
        try {
          const response = await fetch(
            `${this.baseUrl}/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${this.apiKey}`,
            {
              headers: {
                'User-Agent': 'ShipinPort.com/1.0'
              }
            }
          );

          if (!response.ok) {
            console.warn(`NewsAPI request failed: ${response.status}`);
            continue;
          }

          const data: NewsResponse = await response.json();
          
          if (data.status === 'ok' && data.articles) {
            // Filter articles to ensure they're maritime-related
            const maritimeArticles = data.articles.filter(article => 
              this.isMaritimeRelated(article.title + ' ' + article.description)
            );
            allArticles.push(...maritimeArticles);
          }
        } catch (error) {
          console.warn('Error fetching news for query:', query, error);
        }
      }

      // Remove duplicates based on URL
      const uniqueArticles = allArticles.filter((article, index, self) => 
        index === self.findIndex(a => a.url === article.url)
      );

      // Sort by published date (newest first)
      uniqueArticles.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

      return uniqueArticles.slice(0, limit);
    } catch (error) {
      console.error('Error fetching maritime news:', error);
      return [];
    }
  }

  private isMaritimeRelated(text: string): boolean {
    const lowerText = text.toLowerCase();
    return MARITIME_KEYWORDS.some(keyword => 
      lowerText.includes(keyword.toLowerCase())
    );
  }

  formatTimeAgo(dateString: string): string {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - publishedDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    }
  }

  getCategoryFromTitle(title: string): string {
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
    } else {
      return 'General';
    }
  }
}

export const newsService = new NewsService();
