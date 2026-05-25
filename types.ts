// Cryptocurrency Types
export interface CryptoMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number | null;
  market_cap_rank: number | null;
  total_volume: number | null;
  high_24h: number | null;
  low_24h: number | null;
  price_change_24h: number | null;
  price_change_percentage_24h: number | null;
  price_change_percentage_7d: number | null;
  price_change_percentage_30d: number | null;
  price_change_percentage_1y: number | null;
  market_cap_change_24h: number | null;
  market_cap_change_percentage_24h: number | null;
  circulating_supply: number | null;
  total_supply: number | null;
  max_supply: number | null;
  ath: number | null;
  atl: number | null;
  ath_change_percentage: number | null;
  atl_change_percentage: number | null;
  ath_date: string | null;
  atl_date: string | null;
  roi: { times: number; currency: string; percentage: number } | null;
  last_updated: string;
}

export interface CoinDetails extends CryptoMarketData {
  description?: string;
  links?: {
    homepage?: string[];
    blockchain_site?: string[];
    official_forum_url?: string[];
    chat_url?: string[];
    announcement_url?: string[];
    reddit_url?: string;
    repos_url?: { github?: string[] };
  };
  categories?: string[];
  market_data?: {
    price_change_24h_in_currency?: Record<string, number>;
    market_cap_change_24h_in_currency?: Record<string, number>;
  };
}

export interface PriceHistory {
  timestamp: number;
  price: number;
  market_cap?: number;
  volume?: number;
}

export interface FearGreedIndex {
  value: number;
  valueClassification: string;
  timestamp: string;
  timeUntilUpdate: string;
}

export interface CryptoNews {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface PortfolioHolding {
  id: number;
  userId: number;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WatchlistItem {
  id: number;
  userId: number;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  addedAt: Date;
}

export interface UserPreferences {
  id: number;
  userId: number;
  currency: string;
  theme: 'dark' | 'light';
  refreshInterval: number; // in seconds
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioStats {
  totalValue: number;
  totalInvested: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
  holdings: PortfolioHoldingWithValue[];
}

export interface PortfolioHoldingWithValue extends PortfolioHolding {
  currentPrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  allocation: number;
}

export interface MarketOverview {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  ethDominance: number;
  marketCapChangePercentage24h: number;
  activeCoins: number;
}

export type Currency = 'usd' | 'eur' | 'gbp' | 'jpy' | 'aud' | 'cad' | 'chf' | 'cny' | 'inr' | 'krw';

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  usd: '$',
  eur: '€',
  gbp: '£',
  jpy: '¥',
  aud: 'A$',
  cad: 'C$',
  chf: 'CHF',
  cny: '¥',
  inr: '₹',
  krw: '₩',
};

export const CURRENCY_NAMES: Record<Currency, string> = {
  usd: 'US Dollar',
  eur: 'Euro',
  gbp: 'British Pound',
  jpy: 'Japanese Yen',
  aud: 'Australian Dollar',
  cad: 'Canadian Dollar',
  chf: 'Swiss Franc',
  cny: 'Chinese Yuan',
  inr: 'Indian Rupee',
  krw: 'South Korean Won',
};

export const TIMEFRAMES = [
  { label: '1D', value: '1' },
  { label: '7D', value: '7' },
  { label: '30D', value: '30' },
  { label: '1Y', value: '365' },
] as const;

export type Timeframe = typeof TIMEFRAMES[number]['value'];
