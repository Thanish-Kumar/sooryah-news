import Link from "next/link"
import { SunIcon } from "./sun-icon"

interface NewsItem {
  id: number
  title: string
  summary: string
  link: string
}

interface NewsApiResponse {
  timestamp: string;
  total_health_news: number;
  sources_checked: string[];
  news: NewsItem[];
}

interface Props {
  newsData: NewsApiResponse;
}

export default function SooryahHealthNews({ newsData }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <SunIcon className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
          <h1 className="text-4xl font-extrabold text-yellow-800 mb-2">Sooryah Health News</h1>
          <p className="text-xl text-yellow-700">Illuminating Wellness, Radiating Health</p>
        </div>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {newsData.news.length > 0 ? (
            newsData.news.map((item, index) => (
              <div key={item.id} className={`p-6 ${index % 2 === 0 ? "bg-yellow-50" : "bg-white"}`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-yellow-400 rounded-full p-2 mr-4">
                    <span className="text-yellow-800 font-bold">{item.id}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-yellow-900 mb-2">{item.title}</h2>
                    <p className="text-yellow-700 mb-4">{item.summary}</p>
                    <Link
                      href={item.link}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-900 bg-yellow-200 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-150"
                    >
                      Read More
                      <svg className="ml-2 -mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-yellow-700">
              No health news available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

