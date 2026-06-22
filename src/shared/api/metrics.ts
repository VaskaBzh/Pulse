import { randomDelay } from './utils';
import { allMetrics, trafficSources } from '../data/mockData';
import type { DailyMetric, TrafficSource, DateRange } from '../types';

export async function fetchMetrics(dateRange: DateRange): Promise<DailyMetric[]> {
  await randomDelay();
  const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
  return allMetrics.slice(-days);
}

export async function fetchTrafficSources(): Promise<TrafficSource[]> {
  await randomDelay();
  return trafficSources;
}
