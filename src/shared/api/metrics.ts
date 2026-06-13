import { allMetrics, trafficSources } from '../data/mockData';
import type { DailyMetric, TrafficSource, DateRange } from '../types';
import { randomDelay } from './utils';

export async function fetchMetrics(dateRange: DateRange): Promise<DailyMetric[]> {
  console.log('[API] fetchMetrics called', { dateRange });
  await randomDelay();
  const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
  const result = allMetrics.slice(-days);
  console.log('[API] fetchMetrics resolved', { dateRange, count: result.length });
  return result;
}

export async function fetchTrafficSources(): Promise<TrafficSource[]> {
  console.log('[API] fetchTrafficSources called');
  await randomDelay();
  return trafficSources;
}
