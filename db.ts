import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, portfolioHoldings, watchlist, userPreferences, priceAlerts } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Portfolio functions
export async function getPortfolioHoldings(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(portfolioHoldings).where(eq(portfolioHoldings.userId, userId));
}

export async function addPortfolioHolding(userId: number, holding: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(portfolioHoldings).values({
    userId,
    ...holding,
  });
}

export async function updatePortfolioHolding(holdingId: number, updates: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(portfolioHoldings).set(updates).where(eq(portfolioHoldings.id, holdingId));
}

export async function deletePortfolioHolding(holdingId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.delete(portfolioHoldings).where(eq(portfolioHoldings.id, holdingId));
}

// Watchlist functions
export async function getWatchlist(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(watchlist).where(eq(watchlist.userId, userId));
}

export async function addToWatchlist(userId: number, coin: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(watchlist).values({
    userId,
    ...coin,
  });
}

export async function removeFromWatchlist(watchlistId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.delete(watchlist).where(eq(watchlist.id, watchlistId));
}

export async function isInWatchlist(userId: number, coinId: string) {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .select()
    .from(watchlist)
    .where(and(eq(watchlist.userId, userId), eq(watchlist.coinId, coinId)))
    .limit(1);

  return result.length > 0;
}

// User preferences functions
export async function getUserPreferences(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function upsertUserPreferences(userId: number, prefs: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getUserPreferences(userId);

  if (existing) {
    return db.update(userPreferences).set(prefs).where(eq(userPreferences.userId, userId));
  } else {
    return db.insert(userPreferences).values({
      userId,
      ...prefs,
    });
  }
}

// Price alerts functions
export async function getPriceAlerts(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(priceAlerts).where(eq(priceAlerts.userId, userId));
}

export async function addPriceAlert(userId: number, alert: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(priceAlerts).values({
    userId,
    ...alert,
  });
}

export async function updatePriceAlert(alertId: number, updates: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(priceAlerts).set(updates).where(eq(priceAlerts.id, alertId));
}

export async function deletePriceAlert(alertId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.delete(priceAlerts).where(eq(priceAlerts.id, alertId));
}
