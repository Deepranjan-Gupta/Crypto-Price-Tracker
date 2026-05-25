import type { Currency } from '@shared/types';
import { CURRENCY_SYMBOLS } from '@shared/types';

/**
 * Format a number as currency
 */
export function formatCurrency(value: number | null | undefined, currency: Currency = 'usd', decimals: number = 2): string {
  if (value === null || value === undefined) {
    return `${CURRENCY_SYMBOLS[currency]}0.00`;
  }

  const symbol = CURRENCY_SYMBOLS[currency];
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  return `${symbol}${formatted}`;
}

/**
 * Format a number with abbreviations (K, M, B, T)
 */
export function formatCompactNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '0';
  }

  const absValue = Math.abs(value);

  if (absValue >= 1e12) {
    return (value / 1e12).toFixed(2) + 'T';
  }
  if (absValue >= 1e9) {
    return (value / 1e9).toFixed(2) + 'B';
  }
  if (absValue >= 1e6) {
    return (value / 1e6).toFixed(2) + 'M';
  }
  if (absValue >= 1e3) {
    return (value / 1e3).toFixed(2) + 'K';
  }

  return value.toFixed(2);
}

/**
 * Format percentage change with color indicator
 */
export function formatPercentage(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined) {
    return '0.00%';
  }

  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

/**
 * Get color class for percentage change
 */
export function getPercentageColorClass(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return 'text-foreground';
  }

  if (value > 0) {
    return 'text-green-500';
  }
  if (value < 0) {
    return 'text-red-500';
  }
  return 'text-foreground';
}

/**
 * Get background color class for percentage change
 */
export function getPercentageBgClass(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return 'bg-muted';
  }

  if (value > 0) {
    return 'bg-green-500/10';
  }
  if (value < 0) {
    return 'bg-red-500/10';
  }
  return 'bg-muted';
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | string | number): string {
  const dateObj = typeof date === 'string' ? new Date(date) : typeof date === 'number' ? new Date(date) : date;

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Format a date to short format (MM/DD/YY)
 */
export function formatDateShort(date: Date | string | number): string {
  const dateObj = typeof date === 'string' ? new Date(date) : typeof date === 'number' ? new Date(date) : date;

  return new Intl.DateTimeFormat('en-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
}

/**
 * Format time ago (e.g., "2 hours ago")
 */
export function formatTimeAgo(date: Date | string | number): string {
  const dateObj = typeof date === 'string' ? new Date(date) : typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} year${interval > 1 ? 's' : ''} ago`;

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} month${interval > 1 ? 's' : ''} ago`;

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} day${interval > 1 ? 's' : ''} ago`;

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} hour${interval > 1 ? 's' : ''} ago`;

  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval} minute${interval > 1 ? 's' : ''} ago`;

  return 'just now';
}

/**
 * Format a number with commas
 */
export function formatNumber(value: number | null | undefined, decimals: number = 0): string {
  if (value === null || value === undefined) {
    return '0';
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]/g, ''));
}

/**
 * Format profit/loss with color
 */
export function formatProfitLoss(value: number | null | undefined, decimals: number = 2): { text: string; color: string } {
  if (value === null || value === undefined) {
    return { text: '$0.00', color: 'text-foreground' };
  }

  const text = `${value >= 0 ? '+' : ''}${formatNumber(value, decimals)}`;
  const color = value > 0 ? 'text-green-500' : value < 0 ? 'text-red-500' : 'text-foreground';

  return { text, color };
}
