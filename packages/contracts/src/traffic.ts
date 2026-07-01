import { z } from 'zod/v4';

export const TrafficSourceSchema = z.object({
  name: z.string(),
  value: z.number(),
  color: z.string(),
});

export type TrafficSource = z.infer<typeof TrafficSourceSchema>;
