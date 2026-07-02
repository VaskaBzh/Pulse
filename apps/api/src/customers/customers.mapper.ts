import { CustomerSegment, type Customer as PrismaCustomer } from '@prisma/client';
import type { Customer } from '@pulse/contracts';

const SEGMENT_MAP = {
  [CustomerSegment.ENTERPRISE]: 'Enterprise',
  [CustomerSegment.PRO]: 'Pro',
  [CustomerSegment.STARTER]: 'Starter',
} as const satisfies Record<CustomerSegment, string>;

export function fromPrismaCustomerSegment(segment: CustomerSegment): Customer['segment'] {
  return SEGMENT_MAP[segment];
}

export function toCustomerDto(customer: PrismaCustomer): Customer {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    segment: fromPrismaCustomerSegment(customer.segment),
    ltv: customer.ltv,
    joinDate: customer.joinDate.toISOString().split('T')[0],
    country: customer.country,
    orders: customer.orders,
  };
}
