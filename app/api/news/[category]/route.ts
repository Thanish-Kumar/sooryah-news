import { NextRequest, NextResponse } from 'next/server';
import { NewsService } from '@/services/newsService';

const newsService = new NewsService();

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const {category} = await params;
    const newsItems = await newsService.getNewsByCategory(category);
    
    if (!newsItems) {
      return NextResponse.json(
        { error: `Category not found. Available categories: ${newsService.getAvailableCategories()}` },
        { status: 404 }
      );
    }

    const healthRelated = newsItems.filter(item => item.is_health_related);
    const nonHealthRelated = newsItems.filter(item => !item.is_health_related);

    return NextResponse.json({
      category,
      timestamp: new Date().toISOString(),
      total_count: newsItems.length,
      health_related_count: healthRelated.length,
      news: {
        health_related: healthRelated,
        other: nonHealthRelated
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Error fetching news: ${errorMessage}` },
      { status: 500 }
    );
  }
}