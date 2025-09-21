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

export class NewsService {
  private gcaptainUrl = 'https://gcaptain.com';

  async fetchMaritimeNews(limit: number = 10): Promise<NewsArticle[]> {
    try {
      // Fetch articles from our API endpoint which scrapes Gcaptain.com
      const response = await fetch(`/api/news?limit=${limit}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const articles = await response.json();
      return articles;
    } catch (error) {
      console.error('Error fetching maritime news from API:', error);
      // Return empty array instead of fake news
      return [];
    }
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
    } else if (lowerTitle.includes('environment') || lowerTitle.includes('emission') || lowerTitle.includes('carbon')) {
      return 'Environment';
    } else if (lowerTitle.includes('accident') || lowerTitle.includes('incident') || lowerTitle.includes('collision')) {
      return 'Safety';
    } else {
      return 'Maritime News';
    }
  }

  private getSampleMaritimeNews(limit: number): NewsArticle[] {
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
}

export const newsService = new NewsService();