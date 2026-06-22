import { randomDelay } from './utils';
import { recentOrders } from '../data/mockData';
import type { Order } from '../types';

export async function fetchOrders(): Promise<Order[]> {
  await randomDelay();
  return recentOrders;
}
