import type { Order } from '../types';
import { recentOrders } from '../data/mockData';
import { randomDelay } from './utils';

export async function fetchOrders(): Promise<Order[]> {
  console.log('[API] fetchOrders called');
  await randomDelay();
  console.log('[API] fetchOrders resolved', { count: recentOrders.length });
  return recentOrders;
}
