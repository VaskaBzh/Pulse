import { CustomerSchema } from '@pulse/contracts';
import { z } from 'zod/v4';
import type { Customer } from '../types';
import { apiRequest } from './httpClient';

export async function fetchCustomers(): Promise<Customer[]> {
  return apiRequest('/customers', z.array(CustomerSchema));
}
