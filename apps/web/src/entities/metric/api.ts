import { DailyMetricSchema } from '@pulse/contracts';
import { z } from 'zod/v4';
import type { DailyMetric, DateRange } from './model';
import { typedGet } from '../../shared/api/typedClient';

export async function fetchMetrics(range: DateRange = '90d'): Promise<DailyMetric[]> {
  return typedGet('/metrics', z.array(DailyMetricSchema), { range });
}
