import { topProducts, funnelData, retentionData } from '../data/mockData';
import type { Product, FunnelStep, RetentionRow } from '../types';
import { randomDelay } from './utils';

export async function fetchProducts(): Promise<Product[]> {
  console.log('[API] fetchProducts called');
  await randomDelay();
  console.log('[API] fetchProducts resolved', { count: topProducts.length });
  return topProducts;
}

export async function fetchFunnelData(): Promise<FunnelStep[]> {
  console.log('[API] fetchFunnelData called');
  await randomDelay();
  return funnelData;
}

export async function fetchRetentionData(): Promise<RetentionRow[]> {
  console.log('[API] fetchRetentionData called');
  await randomDelay();
  return retentionData;
}
