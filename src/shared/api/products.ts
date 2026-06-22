import { randomDelay } from './utils';
import { topProducts, funnelData, retentionData } from '../data/mockData';
import type { Product, FunnelStep, RetentionRow } from '../types';

export async function fetchProducts(): Promise<Product[]> {
  await randomDelay();
  return topProducts;
}

export async function fetchFunnelData(): Promise<FunnelStep[]> {
  await randomDelay();
  return funnelData;
}

export async function fetchRetentionData(): Promise<RetentionRow[]> {
  await randomDelay();
  return retentionData;
}
