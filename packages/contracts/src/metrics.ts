import { z } from 'zod/v4';

export const DailyMetricSchema = z.object({
  date: z.string(),
  revenue: z.number(),
  profit: z.number(),
  orders: z.number(),
  users: z.number(),
  sessions: z.number(),
  conversionRate: z.number(),
  avgOrderValue: z.number(),
});

export type DailyMetric = z.infer<typeof DailyMetricSchema>;

export const MetricsQuerySchema = z.object({
  range: z.enum(['7d', '30d', '90d']).default('30d'),
});

export type MetricsQuery = z.infer<typeof MetricsQuerySchema>;
