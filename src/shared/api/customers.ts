import { randomDelay } from './utils';
import { customers } from '../data/mockData';
import type { Customer } from '../types';

export async function fetchCustomers(): Promise<Customer[]> {
  await randomDelay();
  return customers;
}
