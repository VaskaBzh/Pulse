import { ProductSchema, FunnelStepSchema, RetentionRowSchema } from '@pulse/contracts';
import { z } from 'zod/v4';
import type { Product, FunnelStep, RetentionRow } from '../types';
import { apiRequest } from './httpClient';

export async function fetchProducts(): Promise<Product[]> {
  return apiRequest('/products', z.array(ProductSchema));
}

export async function fetchFunnelData(): Promise<FunnelStep[]> {
  return apiRequest('/analytics/funnel', z.array(FunnelStepSchema));
}

export async function fetchRetentionData(): Promise<RetentionRow[]> {
  return apiRequest('/analytics/retention', z.array(RetentionRowSchema));
}
