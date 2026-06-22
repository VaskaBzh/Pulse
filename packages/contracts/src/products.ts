import { z } from 'zod/v4';

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  revenue: z.number(),
  orders: z.number(),
  growth: z.number(),
});

export type Product = z.infer<typeof ProductSchema>;
