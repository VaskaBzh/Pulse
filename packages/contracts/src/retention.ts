import { z } from 'zod/v4';

export const RetentionRowSchema = z.object({
  cohort: z.string(),
  weeks: z.array(z.number()),
});

export type RetentionRow = z.infer<typeof RetentionRowSchema>;
