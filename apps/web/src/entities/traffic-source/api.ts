import { TrafficSourceSchema } from '@pulse/contracts';
import { z } from 'zod/v4';
import type { TrafficSource } from './model';
import { apiRequest } from '../../shared/api/httpClient';

export async function fetchTrafficSources(): Promise<TrafficSource[]> {
  return apiRequest('/traffic-sources', z.array(TrafficSourceSchema));
}
