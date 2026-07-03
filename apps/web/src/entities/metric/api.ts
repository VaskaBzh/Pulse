import { DailyMetricSchema } from '@pulse/contracts';
import { z } from 'zod/v4';
import type { DailyMetric, DateRange } from './model';
import { apiRequest } from '../../shared/api/httpClient';

export async function fetchMetrics(range: DateRange = '90d'): Promise<DailyMetric[]> {
  return apiRequest(`/metrics?range=${range}`, z.array(DailyMetricSchema));
}
