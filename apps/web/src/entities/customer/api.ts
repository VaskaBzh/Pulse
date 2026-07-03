import { CustomerSchema } from '@pulse/contracts';
import { z } from 'zod/v4';
import type { Customer } from './model';
import { apiRequest } from '../../shared/api/httpClient';

export async function fetchCustomers(): Promise<Customer[]> {
  return apiRequest('/customers', z.array(CustomerSchema));
}
