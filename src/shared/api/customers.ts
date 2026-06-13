import type { Customer } from '../types';
import { customers } from '../data/mockData';
import { randomDelay } from './utils';

export async function fetchCustomers(): Promise<Customer[]> {
  console.log('[API] fetchCustomers called');
  await randomDelay();
  console.log('[API] fetchCustomers resolved', { count: customers.length });
  return customers;
}
