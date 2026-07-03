import { ProductSchema, FunnelStepSchema, RetentionRowSchema } from '@pulse/contracts';
import { z } from 'zod/v4';
import type { Product, FunnelStep, RetentionRow } from './model';
import { typedGet } from '../../shared/api/typedClient';

export async function fetchProducts(): Promise<Product[]> {
  return typedGet('/products', z.array(ProductSchema));
}

export async function fetchFunnelData(): Promise<FunnelStep[]> {
  return typedGet('/analytics/funnel', z.array(FunnelStepSchema));
}

export async function fetchRetentionData(): Promise<RetentionRow[]> {
  return typedGet('/analytics/retention', z.array(RetentionRowSchema));
}
