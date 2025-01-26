import { NextResponse } from 'next/server';
import { NewsService } from '@/services/newsService';

const newsService = new NewsService();

export async function GET() {
  return NextResponse.json({
    message: "Welcome to The Hindu News API",
    available_endpoints: [
      "/api/news/top_stories",
      "/api/news/national",
      "/api/news/international",
      "/api/news/business",
      "/api/news/sport",
      "/api/news/science",
      "/api/news/entertainment",
      "/api/news/education",
      "/api/news/technology",
      "/api/news/health",
      "/api/news/environment",
      "/api/news/agriculture",
      "/api/news/economy",
      "/api/news/industry",
      "/api/news/markets",
      "/api/news/sooryah_news"
    ]
  });
}
