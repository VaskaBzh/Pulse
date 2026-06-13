import { customers } from '../data/mockData';
import type { Customer } from '../types';
import { randomDelay } from './utils';

export async function fetchCustomers(): Promise<Customer[]> {
  await randomDelay();
  return customers;
}
