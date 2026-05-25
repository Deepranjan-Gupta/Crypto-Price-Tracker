import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Portfolio holdings table - tracks user's cryptocurrency holdings
 */
export const portfolioHoldings = mysqlTable("portfolio_holdings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  coinId: varchar("coinId", { length: 64 }).notNull(),
  coinName: varchar("coinName", { length: 255 }).notNull(),
  coinSymbol: varchar("coinSymbol", { length: 10 }).notNull(),
  quantity: decimal("quantity", { precision: 20, scale: 8 }).notNull(),
  purchasePrice: decimal("purchasePrice", { precision: 20, scale: 8 }).notNull(),
  purchaseDate: timestamp("purchaseDate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PortfolioHolding = typeof portfolioHoldings.$inferSelect;
export type InsertPortfolioHolding = typeof portfolioHoldings.$inferInsert;

/**
 * Watchlist table - tracks user's favorite cryptocurrencies
 */
export const watchlist = mysqlTable("watchlist", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  coinId: varchar("coinId", { length: 64 }).notNull(),
  coinName: varchar("coinName", { length: 255 }).notNull(),
  coinSymbol: varchar("coinSymbol", { length: 10 }).notNull(),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
});

export type WatchlistItem = typeof watchlist.$inferSelect;
export type InsertWatchlistItem = typeof watchlist.$inferInsert;

/**
 * User preferences table - stores user settings and preferences
 */
export const userPreferences = mysqlTable("user_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  currency: varchar("currency", { length: 10 }).default("usd").notNull(),
  theme: mysqlEnum("theme", ["dark", "light"]).default("dark").notNull(),
  refreshInterval: int("refreshInterval").default(30).notNull(), // in seconds
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = typeof userPreferences.$inferInsert;

/**
 * Price alerts table - tracks user's price alert settings
 */
export const priceAlerts = mysqlTable("price_alerts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  coinId: varchar("coinId", { length: 64 }).notNull(),
  coinName: varchar("coinName", { length: 255 }).notNull(),
  targetPrice: decimal("targetPrice", { precision: 20, scale: 8 }).notNull(),
  alertType: mysqlEnum("alertType", ["above", "below"]).notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PriceAlert = typeof priceAlerts.$inferSelect;
export type InsertPriceAlert = typeof priceAlerts.$inferInsert;
