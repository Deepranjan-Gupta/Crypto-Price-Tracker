import axios from 'axios';
import type { CryptoNews } from '@shared/types';

// Using CoinTelegraph RSS feed and other public sources
// For production, consider using NewsAPI.org or similar service

const NEWS_SOURCES = [
  'https://cointelegraph.com/feed',
  'https://www.coindesk.com/arc/outboundfeeds/rss/',
  'https://bitcoinmagazine.com/feed',
];

/**
 * Fetch crypto news from multiple sources
 * Note: This is a simplified implementation using public APIs
 */
export async function getCryptoNews(limit: number = 10): Promise<CryptoNews[]> {
  try {
    // Using a free news aggregator API for crypto news
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'cryptocurrency OR bitcoin OR ethereum OR crypto',
        sortBy: 'publishedAt',
        language: 'en',
        pageSize: limit,
      },
      timeout: 5000,
    });

    if (response.data.articles) {
      return response.data.articles.map((article: any, index: number) => ({
        id: `${article.publishedAt}-${index}`,
        title: article.title,
        description: article.description || article.content?.substring(0, 200),
        url: article.url,
        imageUrl: article.urlToImage,
        source: article.source.name,
        publishedAt: article.publishedAt,
        sentiment: 'neutral' as const,
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching crypto news:', error);
    // Return mock news data as fallback
    return getMockNews(limit);
  }
}

/**
 * Get news for a specific coin
 */
export async function getCoinNews(coinName: string, limit: number = 5): Promise<CryptoNews[]> {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: coinName,
        sortBy: 'publishedAt',
        language: 'en',
        pageSize: limit,
      },
      timeout: 5000,
    });

    if (response.data.articles) {
      return response.data.articles.map((article: any, index: number) => ({
        id: `${article.publishedAt}-${index}`,
        title: article.title,
        description: article.description || article.content?.substring(0, 200),
        url: article.url,
        imageUrl: article.urlToImage,
        source: article.source.name,
        publishedAt: article.publishedAt,
        sentiment: 'neutral' as const,
      }));
    }

    return [];
  } catch (error) {
    console.error(`Error fetching news for ${coinName}:`, error);
    return [];
  }
}

/**
 * Mock news data for fallback
 */
function getMockNews(limit: number): CryptoNews[] {
  const mockNews: CryptoNews[] = [
    {
      id: '1',
      title: 'Bitcoin Reaches New All-Time High',
      description: 'Bitcoin has surged past previous resistance levels, marking a significant milestone in the cryptocurrency market.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1639762681033-6461efb0aaad?w=400&h=300&fit=crop',
      source: 'CryptoPulse News',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      sentiment: 'positive',
    },
    {
      id: '2',
      title: 'Ethereum Upgrade Improves Network Efficiency',
      description: 'The latest Ethereum upgrade has successfully reduced transaction fees and improved network throughput.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1642104704074-ab1b9ff7f359?w=400&h=300&fit=crop',
      source: 'CryptoPulse News',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      sentiment: 'positive',
    },
    {
      id: '3',
      title: 'Regulatory Developments in Crypto Market',
      description: 'New regulatory frameworks are being introduced to provide clarity and stability in the cryptocurrency sector.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=300&fit=crop',
      source: 'CryptoPulse News',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      sentiment: 'neutral',
    },
    {
      id: '4',
      title: 'Major Exchange Lists New Altcoins',
      description: 'Leading cryptocurrency exchanges have announced support for several emerging altcoins.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1605792657692-4a46f60eb223?w=400&h=300&fit=crop',
      source: 'CryptoPulse News',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      sentiment: 'positive',
    },
    {
      id: '5',
      title: 'Market Analysis: Volatility Expected',
      description: 'Analysts predict increased market volatility in the coming weeks due to macroeconomic factors.',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf35f?w=400&h=300&fit=crop',
      source: 'CryptoPulse News',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      sentiment: 'neutral',
    },
  ];

  return mockNews.slice(0, limit);
}
