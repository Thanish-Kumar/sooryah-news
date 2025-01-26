import { NextResponse } from 'next/server';
import { NewsService } from '@/services/newsService';

const newsService = new NewsService();

export async function GET() {
  try {
    const healthNews = await newsService.getAllHealthNews();
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      total_health_news: healthNews.length,
      sources_checked: newsService.getAvailableCategories(),
      news: healthNews
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Error fetching health news: ${errorMessage}` },
      { status: 500 }
    );
  }
}