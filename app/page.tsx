import SooryahHealthNews from '@/components/sooryah-health-news';
import { NewsService } from '@/services/newsService';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  link: string;
  category: string;
  published: string;
  is_health_related: boolean;
  classification_confidence: number;
}

interface NewsApiResponse {
  timestamp: string;
  total_health_news: number;
  sources_checked: string[];
  news: NewsItem[];
}
// Use a constant value from the environment variable
export const revalidate = 43200;

// Data fetching at build time
async function getNewsData(): Promise<NewsApiResponse> {
  const newsService = new NewsService();
  
  // Add cache configuration to the fetch request
  const healthNews = await newsService.getAllHealthNews();
  
  // Remove duplicates based on title and ensure proper ordering
  const uniqueNews = Array.from(
    new Map(healthNews.map(item => [item.title, item])).values()
  );

  return {
    timestamp: new Date().toISOString(),
    total_health_news: uniqueNews.length,
    sources_checked: newsService.getAvailableCategories(),
    news: uniqueNews.map((item, index) => ({
      ...item,
      id: index + 1, // Ensure sequential IDs
      title: item.title || '',
      link: item.link || '',
      published: item.published || '',
      summary: item.summary || ''
    }))
  };
}

export default async function HomePage() {
  try {
    const newsData = await getNewsData();
    
    if (!newsData.news.length) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="p-4 bg-red-50 text-red-800 rounded-lg">
            Failed to load health news. Please try again later.
          </div>
        </div>
      );
    }

    return <SooryahHealthNews newsData={newsData} />;
  } catch (error: unknown) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-4 bg-red-50 text-red-800 rounded-lg">
          Failed to load health news. Please try again later.
          {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }
}

