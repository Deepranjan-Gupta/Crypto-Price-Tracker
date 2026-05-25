import { useState, useEffect, useCallback } from 'react';
import { useCrypto } from '@/contexts/CryptoContext';
import type { CryptoMarketData, PriceHistory, CoinDetails } from '@shared/types';
import {
  getCoinDetails,
  getPriceHistory,
  getSparklineData,
  searchCoins,
  getTopGainers,
  getTopLosers,
} from '@/services/coingeckoApi';

/**
 * Hook to get a single coin's data
 */
export function useCoinData(coinId: string | undefined) {
  const { currency } = useCrypto();
  const [data, setData] = useState<CoinDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!coinId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const coinData = await getCoinDetails(coinId, currency);
        setData(coinData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch coin data'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [coinId, currency]);

  return { data, loading, error };
}

/**
 * Hook to get price history for charts
 */
export function usePriceHistory(coinId: string | undefined, days: number = 7) {
  const { currency } = useCrypto();
  const [data, setData] = useState<PriceHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!coinId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const history = await getPriceHistory(coinId, days, currency);
        setData(history);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch price history'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [coinId, days, currency]);

  return { data, loading, error };
}

/**
 * Hook to get sparkline data for mini charts
 */
export function useSparklineData(coinId: string | undefined, days: number = 7) {
  const { currency } = useCrypto();
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coinId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const sparkline = await getSparklineData(coinId, days, currency);
        setData(sparkline);
      } catch (err) {
        console.error('Failed to fetch sparkline data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [coinId, days, currency]);

  return { data, loading };
}

/**
 * Hook to search coins
 */
export function useSearchCoins(query: string) {
  const [results, setResults] = useState<Array<{ id: string; name: string; symbol: string; thumb: string }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const searchResults = await searchCoins(query);
        setResults(searchResults);
      } catch (err) {
        console.error('Failed to search coins:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return { results, loading };
}

/**
 * Hook to get top gainers
 */
export function useTopGainers() {
  const { currency } = useCrypto();
  const [data, setData] = useState<CryptoMarketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const gainers = await getTopGainers(currency);
      setData(gainers);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch top gainers'));
    } finally {
      setLoading(false);
    }
  }, [currency]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

/**
 * Hook to get top losers
 */
export function useTopLosers() {
  const { currency } = useCrypto();
  const [data, setData] = useState<CryptoMarketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const losers = await getTopLosers(currency);
      setData(losers);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch top losers'));
    } finally {
      setLoading(false);
    }
  }, [currency]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

/**
 * Hook to get current price of a coin
 */
export function useCoinPrice(coinId: string | undefined): CryptoMarketData | undefined {
  const { prices } = useCrypto();

  if (!coinId) return undefined;
  return prices.get(coinId);
}

/**
 * Hook to get multiple coins' prices
 */
export function useCoinsPrices(coinIds: string[]): Map<string, CryptoMarketData> {
  const { prices } = useCrypto();
  const result = new Map<string, CryptoMarketData>();

  coinIds.forEach(id => {
    const price = prices.get(id);
    if (price) {
      result.set(id, price);
    }
  });

  return result;
}
