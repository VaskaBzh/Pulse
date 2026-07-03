import { DailyMetricSchema, TrafficSourceSchema } from '@pulse/contracts';
import { z } from 'zod/v4';
import type { DailyMetric, TrafficSource, DateRange } from '../types';
import { typedGet } from './typedClient';

export async function fetchMetrics(range: DateRange = '90d'): Promise<DailyMetric[]> {
  return typedGet('/metrics', z.array(DailyMetricSchema), { range });
}

export async function fetchTrafficSources(): Promise<TrafficSource[]> {
  return typedGet('/traffic-sources', z.array(TrafficSourceSchema));
}
