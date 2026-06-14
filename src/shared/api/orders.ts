import { recentOrders } from '../data/mockData';
import type { Order } from '../types';
import { randomDelay } from './utils';

export async function fetchOrders(): Promise<Order[]> {
  await randomDelay();
  return recentOrders;
}
