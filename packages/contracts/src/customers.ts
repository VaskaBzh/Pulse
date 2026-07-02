import { z } from 'zod/v4';

export const CustomerSegmentEnum = z.enum(['Enterprise', 'Pro', 'Starter']);

export const CustomerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  segment: CustomerSegmentEnum,
  ltv: z.number(),
  joinDate: z.string(),
  country: z.string(),
  orders: z.number(),
});

export type Customer = z.infer<typeof CustomerSchema>;
