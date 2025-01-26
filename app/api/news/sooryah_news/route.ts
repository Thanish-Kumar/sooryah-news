import { NextResponse } from 'next/server';
import { NewsService } from '@/services/newsService';

const newsService = new NewsService();

export async function GET() {
  try {
    const healthNews = await newsService.getAllHealthNews();
    
    // Transform the health news to match the NewsItem interface
    const formattedNews = healthNews.map((news, index) => ({
      id: index + 1,
      title: news.title,
      summary: news.summary || '', // Adjust based on your newsService response
      link: news.link || '', // Adjust based on your newsService response
    }));
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      total_health_news: formattedNews.length,
      sources_checked: newsService.getAvailableCategories(),
      news: formattedNews
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Error fetching health news: ${errorMessage}` },
      { status: 500 }
    );
  }
}