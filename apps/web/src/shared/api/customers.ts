import { CustomerSchema } from '@pulse/contracts';
import { z } from 'zod/v4';
import type { Customer } from '../types';
import { typedGet } from './typedClient';

export async function fetchCustomers(): Promise<Customer[]> {
  return typedGet('/customers', z.array(CustomerSchema));
}
