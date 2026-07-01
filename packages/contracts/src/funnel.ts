import { z } from 'zod/v4';

export const FunnelStepSchema = z.object({
  label: z.string(),
  value: z.number(),
  conversionRate: z.number(),
});

export type FunnelStep = z.infer<typeof FunnelStepSchema>;
