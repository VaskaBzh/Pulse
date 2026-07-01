import { DailyMetricSchema, TrafficSourceSchema } from '@pulse/contracts';
import { z } from 'zod/v4';
import type { DailyMetric, TrafficSource, DateRange } from '../types';
import { apiRequest } from './httpClient';

export async function fetchMetrics(range: DateRange = '90d'): Promise<DailyMetric[]> {
  return apiRequest(`/metrics?range=${range}`, z.array(DailyMetricSchema));
}

export async function fetchTrafficSources(): Promise<TrafficSource[]> {
  return apiRequest('/traffic-sources', z.array(TrafficSourceSchema));
}
