import { NextRequest, NextResponse } from 'next/server';
import { NewsService } from '@/services/newsService';

const newsService = new NewsService();

export async function GET(request: NextRequest, { params }: { params: Promise<{ category: string }> }) {
  try {
    const { category } = await params;
    const healthNews = await newsService.getNewsByCategory(category) || [];
    
    const formattedNews = healthNews.map((news, index) => ({
      id: index + 1,
      title: news.title,
      summary: news.summary || '',
      link: news.link || '',
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