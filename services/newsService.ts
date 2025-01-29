import Parser from 'rss-parser';
import { NewsClassifierService } from '@/services/newsClassifierService';

export class NewsService {
  private parser: Parser;
  private classifier: NewsClassifierService;
  private RSS_FEEDS: Record<string, string>;

  constructor() {
    this.parser = new Parser();
    this.classifier = new NewsClassifierService();
    this.RSS_FEEDS = {
      top_stories: "https://www.thehindu.com/news/feeder/default.rss",
      national: "https://www.thehindu.com/news/national/feeder/default.rss",
      international: "https://www.thehindu.com/news/international/feeder/default.rss",
      business: "https://www.thehindu.com/business/feeder/default.rss",
      sport: "https://www.thehindu.com/sport/feeder/default.rss",
      science: "https://www.thehindu.com/sci-tech/feeder/default.rss",
      entertainment: "https://www.thehindu.com/entertainment/feeder/default.rss",
      education: "https://www.thehindu.com/education/feeder/default.rss",
      technology: "https://www.thehindu.com/sci-tech/technology/feeder/default.rss",
      health: "https://www.thehindu.com/sci-tech/health/feeder/default.rss",
      environment: "https://www.thehindu.com/sci-tech/energy-and-environment/feeder/default.rss",
      agriculture: "https://www.thehindu.com/business/agri-business/feeder/default.rss",
      economy: "https://www.thehindu.com/business/Economy/feeder/default.rss",
      industry: "https://www.thehindu.com/business/Industry/feeder/default.rss",
      markets: "https://www.thehindu.com/business/markets/feeder/default.rss"
    };
  }

  getAvailableCategories(): string[] {
    return Object.keys(this.RSS_FEEDS);
  }

  async parseFeed(feedUrl: string) {
    try {
      const response = await fetch(feedUrl);
      const data = await response.text();
      const feed = await this.parser.parseString(data);
      
      const newsItems = await Promise.all(
        feed.items.slice(0, 10).map(async (entry, index) => {
          const classification = await this.classifier.isHealthRelated(
            entry.title!,
            entry.contentSnippet || ''
          );

          return {
            id: index,
            title: entry.title,
            link: entry.link,
            published: entry.pubDate,
            summary: entry.contentSnippet,
            is_health_related: classification.is_health_related,
            classification_confidence: classification.confidence
          };
        })
      );
      return newsItems;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse feed: ${error.message}`);
      }
      throw new Error('Failed to parse feed: Unknown error');
    }
  }

  async getNewsByCategory(category: string) {
    if (!this.RSS_FEEDS[category]) {
      return null;
    }
    return await this.parseFeed(this.RSS_FEEDS[category]);
  }

  async getAllHealthNews() {
    const allHealthNews = [];
    
    for (const [category, feedUrl] of Object.entries(this.RSS_FEEDS)) {
      const newsItems = await this.parseFeed(feedUrl);
      const healthNews = newsItems
        .filter(item => item.is_health_related)
        .map(item => ({ ...item, category }));
      allHealthNews.push(...healthNews);
    }

    return allHealthNews.sort((a, b) => 
      new Date(b.published!).getTime() - new Date(a.published!).getTime()
    );
  }
} 