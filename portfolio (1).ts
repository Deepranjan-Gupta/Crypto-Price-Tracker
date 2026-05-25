import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

type AuthenticatedUser = NonNullable<TrpcContext['user']>;

function createAuthContext(userId: number = 1): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: 'test',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {} as TrpcContext['res'],
  };

  return { ctx };
}

describe('CryptoPulse API Tests', () => {
  describe('Portfolio Management', () => {
    it('should get holdings for authenticated user', async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.portfolio.getHoldings();

      expect(Array.isArray(result)).toBe(true);
    });

    it('should add a holding with valid data', async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const holdingData = {
        coinId: 'bitcoin',
        coinName: 'Bitcoin',
        coinSymbol: 'BTC',
        quantity: '0.5',
        purchasePrice: '45000',
        purchaseDate: new Date('2024-01-01'),
      };

      const result = await caller.portfolio.addHolding(holdingData);
      expect(result).toBeDefined();
    });

    it('should delete a holding', async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.portfolio.deleteHolding({ id: 999 });
      expect(result).toBeDefined();
    });
  });

  describe('Watchlist Management', () => {
    it('should get watchlist items', async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.watchlist.getItems();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should add different coins to watchlist', async () => {
      const { ctx } = createAuthContext(2);
      const caller = appRouter.createCaller(ctx);

      const coin1 = {
        coinId: 'ethereum',
        coinName: 'Ethereum',
        coinSymbol: 'ETH',
      };

      const result = await caller.watchlist.addItem(coin1);
      expect(result).toBeDefined();
    });

    it('should check if coin is in watchlist', async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.watchlist.isInWatchlist({ coinId: 'bitcoin' });
      expect(typeof result).toBe('boolean');
    });

    it('should remove item from watchlist', async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.watchlist.removeItem({ id: 999 });
      expect(result).toBeDefined();
    });
  });

  describe('User Preferences', () => {
    it('should get user preferences', async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.preferences.get();
      expect(result === null || typeof result === 'object').toBe(true);
    });

    it('should update user preferences', async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const updates = {
        currency: 'eur',
        theme: 'dark' as const,
        refreshInterval: 60,
      };

      const result = await caller.preferences.update(updates);
      expect(result).toBeDefined();
    });

    it('should update partial preferences', async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const updates = {
        currency: 'gbp',
      };

      const result = await caller.preferences.update(updates);
      expect(result).toBeDefined();
    });
  });

  describe('Price Alerts', () => {
    it('should get alerts for user', async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.alerts.getAlerts();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should add a price alert', async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const alertData = {
        coinId: 'bitcoin',
        coinName: 'Bitcoin',
        targetPrice: '50000',
        alertType: 'above' as const,
      };

      const result = await caller.alerts.addAlert(alertData);
      expect(result).toBeDefined();
    });

    it('should update a price alert', async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const updates = {
        id: 1,
        targetPrice: '55000',
      };

      const result = await caller.alerts.updateAlert(updates);
      expect(result).toBeDefined();
    });

    it('should delete a price alert', async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.alerts.deleteAlert({ id: 999 });
      expect(result).toBeDefined();
    });
  });

  describe('Authentication', () => {
    it('should return current user', async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const user = await caller.auth.me();

      expect(user).toBeDefined();
      expect(user?.id).toBe(1);
      expect(user?.openId).toBe('test-user-1');
    });
  });
});
