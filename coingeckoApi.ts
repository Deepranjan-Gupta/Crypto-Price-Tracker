import axios from 'axios';
import type { CryptoMarketData, CoinDetails, PriceHistory, FearGreedIndex, MarketOverview } from '@shared/types';
import type { Currency } from '@shared/types';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';
const FEAR_GREED_API = 'https://api.alternative.me/fng';

const axiosInstance = axios.create({
  baseURL: COINGECKO_API_BASE,
  timeout: 10000,
});

/**
 * Fetch top cryptocurrencies by market cap
 */
export async function getTopCryptos(
  currency: Currency = 'usd',
  limit: number = 50,
  order: string = 'market_cap_desc'
): Promise<CryptoMarketData[]> {
  try {
    const response = await axiosInstance.get('/coins/markets', {
      params: {
        vs_currency: currency,
        order,
        per_page: limit,
        page: 1,
        sparkline: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top cryptos:', error);
    throw new Error('Failed to fetch cryptocurrency data');
  }
}

/**
 * Fetch detailed information about a specific coin
 */
export async function getCoinDetails(
  coinId: string,
  currency: Currency = 'usd'
): Promise<CoinDetails> {
  try {
    const response = await axiosInstance.get(`/coins/${coinId}`, {
      params: {
        vs_currency: currency,
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching coin details for ${coinId}:`, error);
    throw new Error(`Failed to fetch details for ${coinId}`);
  }
}

/**
 * Fetch historical price data for a coin
 */
export async function getPriceHistory(
  coinId: string,
  days: number,
  currency: Currency = 'usd'
): Promise<PriceHistory[]> {
  try {
    const response = await axiosInstance.get(`/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: currency,
        days,
        interval: days > 90 ? 'daily' : undefined,
      },
    });

    // Transform the response data
    return response.data.prices.map(([timestamp, price]: [number, number]) => ({
      timestamp,
      price,
    }));
  } catch (error) {
    console.error(`Error fetching price history for ${coinId}:`, error);
    throw new Error(`Failed to fetch price history for ${coinId}`);
  }
}

/**
 * Fetch sparkline data (mini chart data)
 */
export async function getSparklineData(
  coinId: string,
  days: number = 7,
  currency: Currency = 'usd'
): Promise<number[]> {
  try {
    const response = await axiosInstance.get(`/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: currency,
        days,
        interval: 'daily',
      },
    });
    return response.data.prices.map(([, price]: [number, number]) => price);
  } catch (error) {
    console.error(`Error fetching sparkline data for ${coinId}:`, error);
    return [];
  }
}

/**
 * Search for cryptocurrencies by name or symbol
 */
export async function searchCoins(query: string): Promise<Array<{ id: string; name: string; symbol: string; thumb: string }>> {
  try {
    const response = await axiosInstance.get('/search', {
      params: {
        query,
      },
    });
    return response.data.coins.slice(0, 10);
  } catch (error) {
    console.error('Error searching coins:', error);
    return [];
  }
}

/**
 * Get market overview data
 */
export async function getMarketOverview(currency: Currency = 'usd'): Promise<MarketOverview> {
  try {
    const response = await axiosInstance.get('/global', {
      params: {
        vs_currency: currency,
      },
    });

    const data = response.data.data;
    return {
      totalMarketCap: data.total_market_cap?.[currency] || 0,
      totalVolume: data.total_volume?.[currency] || 0,
      btcDominance: data.btc_market_cap_percentage || 0,
      ethDominance: data.eth_market_cap_percentage || 0,
      marketCapChangePercentage24h: data.market_cap_change_percentage_24h_usd || 0,
      activeCoins: data.active_cryptocurrencies || 0,
    };
  } catch (error) {
    console.error('Error fetching market overview:', error);
    throw new Error('Failed to fetch market overview');
  }
}

/**
 * Get trending cryptocurrencies
 */
export async function getTrendingCoins(currency: Currency = 'usd'): Promise<CryptoMarketData[]> {
  try {
    const response = await axiosInstance.get('/coins/markets', {
      params: {
        vs_currency: currency,
        order: 'gecko_desc',
        per_page: 10,
        page: 1,
        sparkline: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    return [];
  }
}

/**
 * Get top gainers
 */
export async function getTopGainers(currency: Currency = 'usd'): Promise<CryptoMarketData[]> {
  try {
    const response = await axiosInstance.get('/coins/markets', {
      params: {
        vs_currency: currency,
        order: 'price_change_percentage_24h_desc',
        per_page: 10,
        page: 1,
        sparkline: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top gainers:', error);
    return [];
  }
}

/**
 * Get top losers
 */
export async function getTopLosers(currency: Currency = 'usd'): Promise<CryptoMarketData[]> {
  try {
    const response = await axiosInstance.get('/coins/markets', {
      params: {
        vs_currency: currency,
        order: 'price_change_percentage_24h_asc',
        per_page: 10,
        page: 1,
        sparkline: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top losers:', error);
    return [];
  }
}

/**
 * Fetch Fear & Greed Index
 */
export async function getFearGreedIndex(): Promise<FearGreedIndex | null> {
  try {
    const response = await axios.get(`${FEAR_GREED_API}/?limit=1&date_format=us`);
    const data = response.data.data[0];
    return {
      value: parseInt(data.value),
      valueClassification: data.value_classification,
      timestamp: data.timestamp,
      timeUntilUpdate: data.time_until_update,
    };
  } catch (error) {
    console.error('Error fetching Fear & Greed Index:', error);
    return null;
  }
}

/**
 * Get multiple coins data at once
 */
export async function getMultipleCoins(
  coinIds: string[],
  currency: Currency = 'usd'
): Promise<CryptoMarketData[]> {
  try {
    const response = await axiosInstance.get('/coins/markets', {
      params: {
        vs_currency: currency,
        ids: coinIds.join(','),
        order: 'market_cap_desc',
        per_page: 250,
        page: 1,
        sparkline: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching multiple coins:', error);
    return [];
  }
}
