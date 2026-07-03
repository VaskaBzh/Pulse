import { CustomerSchema } from '@pulse/contracts';
import { z } from 'zod/v4';
import type { Customer } from './model';
import { typedGet } from '../../shared/api/typedClient';

export async function fetchCustomers(): Promise<Customer[]> {
  return typedGet('/customers', z.array(CustomerSchema));
}
