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
      console.warn('NewsAPI key not configured, returning sample maritime news');
      return this.getSampleMaritimeNews(limit);
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

  private getSampleMaritimeNews(limit: number): NewsArticle[] {
    const sampleNews: NewsArticle[] = [
      {
        title: "IMO Adopts New Regulations for Ship Energy Efficiency",
        description: "The International Maritime Organization has introduced updated guidelines for ship energy efficiency management, focusing on reducing greenhouse gas emissions from maritime transport.",
        url: "https://shipinport.com/news/imo-energy-efficiency",
        urlToImage: "",
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        source: { name: "Maritime Executive" },
        category: "Regulations"
      },
      {
        title: "Port of Singapore Reports Record Container Throughput",
        description: "Singapore's port authority announces a new monthly record for container handling, demonstrating the port's continued growth in global maritime trade.",
        url: "https://shipinport.com/news/singapore-record-throughput",
        urlToImage: "",
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        source: { name: "Port Technology" },
        category: "Ports"
      },
      {
        title: "New AI Technology Enhances Marine Navigation Systems",
        description: "Leading maritime technology companies unveil artificial intelligence-powered navigation systems that improve safety and efficiency for vessel operations.",
        url: "https://shipinport.com/news/ai-navigation-systems",
        urlToImage: "",
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        source: { name: "Marine Technology News" },
        category: "Technology"
      },
      {
        title: "Marine Superintendent Certification Program Expands",
        description: "Professional marine superintendent certification programs are expanding globally to meet the growing demand for qualified maritime professionals.",
        url: "https://shipinport.com/news/superintendent-certification",
        urlToImage: "",
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        source: { name: "Maritime Professional" },
        category: "Inspections"
      },
      {
        title: "Crew Welfare Standards Strengthened Under MLC 2006",
        description: "The Maritime Labour Convention continues to evolve with enhanced standards for seafarer welfare, including improved living conditions and fair employment practices.",
        url: "https://shipinport.com/news/mlc-crew-welfare",
        urlToImage: "",
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        source: { name: "Seafarers' Rights" },
        category: "Crew"
      },
      {
        title: "Container Shipping Rates Stabilize After Market Volatility",
        description: "Global container shipping rates show signs of stabilization following recent market volatility, with industry experts predicting steady growth.",
        url: "https://shipinport.com/news/container-rates-stabilize",
        urlToImage: "",
        publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
        source: { name: "Shipping Today" },
        category: "Cargo"
      }
    ];

    return sampleNews.slice(0, limit);
  }
}

export const newsService = new NewsService();
