import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getPortfolioHoldings,
  addPortfolioHolding,
  updatePortfolioHolding,
  deletePortfolioHolding,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
  getUserPreferences,
  upsertUserPreferences,
  getPriceAlerts,
  addPriceAlert,
  updatePriceAlert,
  deletePriceAlert,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Portfolio management
  portfolio: router({
    getHoldings: protectedProcedure.query(async ({ ctx }) => {
      return getPortfolioHoldings(ctx.user.id);
    }),

    addHolding: protectedProcedure
      .input(
        z.object({
          coinId: z.string(),
          coinName: z.string(),
          coinSymbol: z.string(),
          quantity: z.string(),
          purchasePrice: z.string(),
          purchaseDate: z.date(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return addPortfolioHolding(ctx.user.id, input);
      }),

    updateHolding: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          quantity: z.string().optional(),
          purchasePrice: z.string().optional(),
          purchaseDate: z.date().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        return updatePortfolioHolding(id, updates);
      }),

    deleteHolding: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deletePortfolioHolding(input.id);
      }),
  }),

  // Watchlist management
  watchlist: router({
    getItems: protectedProcedure.query(async ({ ctx }) => {
      return getWatchlist(ctx.user.id);
    }),

    addItem: protectedProcedure
      .input(
        z.object({
          coinId: z.string(),
          coinName: z.string(),
          coinSymbol: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const alreadyExists = await isInWatchlist(ctx.user.id, input.coinId);
        if (alreadyExists) {
          throw new Error("Coin already in watchlist");
        }
        return addToWatchlist(ctx.user.id, input);
      }),

    removeItem: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return removeFromWatchlist(input.id);
      }),

    isInWatchlist: protectedProcedure
      .input(z.object({ coinId: z.string() }))
      .query(async ({ ctx, input }) => {
        return isInWatchlist(ctx.user.id, input.coinId);
      }),
  }),

  // User preferences
  preferences: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return getUserPreferences(ctx.user.id);
    }),

    update: protectedProcedure
      .input(
        z.object({
          currency: z.string().optional(),
          theme: z.enum(["dark", "light"]).optional(),
          refreshInterval: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return upsertUserPreferences(ctx.user.id, input);
      }),
  }),

  // Price alerts
  alerts: router({
    getAlerts: protectedProcedure.query(async ({ ctx }) => {
      return getPriceAlerts(ctx.user.id);
    }),

    addAlert: protectedProcedure
      .input(
        z.object({
          coinId: z.string(),
          coinName: z.string(),
          targetPrice: z.string(),
          alertType: z.enum(["above", "below"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return addPriceAlert(ctx.user.id, input);
      }),

    updateAlert: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          targetPrice: z.string().optional(),
          alertType: z.enum(["above", "below"]).optional(),
          isActive: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        return updatePriceAlert(id, updates);
      }),

    deleteAlert: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deletePriceAlert(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
