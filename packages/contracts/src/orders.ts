import { z } from 'zod/v4';

export const OrderStatusEnum = z.enum(['completed', 'pending', 'cancelled', 'refunded']);

export const OrderSchema = z.object({
  id: z.string(),
  customer: z.string(),
  email: z.string(),
  product: z.string(),
  amount: z.number(),
  status: OrderStatusEnum,
  date: z.string(),
  country: z.string(),
});

export type Order = z.infer<typeof OrderSchema>;

export const OrdersQuerySchema = z.object({
  status: OrderStatusEnum.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sort: z.string().default('date:desc'),
  search: z.string().optional(),
});

export type OrdersQuery = z.infer<typeof OrdersQuerySchema>;
