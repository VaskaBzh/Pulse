import { TrafficSourceSchema } from '@pulse/contracts';
import { z } from 'zod/v4';
import type { TrafficSource } from './model';
import { typedGet } from '../../shared/api/typedClient';

export async function fetchTrafficSources(): Promise<TrafficSource[]> {
  return typedGet('/traffic-sources', z.array(TrafficSourceSchema));
}
