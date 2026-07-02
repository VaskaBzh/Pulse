import { OrderStatus, type Order as PrismaOrder } from '@prisma/client';
import type { Order } from '@pulse/contracts';

const STATUS_MAP: Record<string, OrderStatus> = {
  completed: OrderStatus.COMPLETED,
  pending: OrderStatus.PENDING,
  cancelled: OrderStatus.CANCELLED,
  refunded: OrderStatus.REFUNDED,
};

const STATUS_REVERSE = {
  [OrderStatus.COMPLETED]: 'completed',
  [OrderStatus.PENDING]: 'pending',
  [OrderStatus.CANCELLED]: 'cancelled',
  [OrderStatus.REFUNDED]: 'refunded',
} as const satisfies Record<OrderStatus, string>;

export function toPrismaOrderStatus(status: string): OrderStatus {
  return STATUS_MAP[status];
}

export function fromPrismaOrderStatus(status: OrderStatus): Order['status'] {
  return STATUS_REVERSE[status];
}

export function toOrderDto(order: PrismaOrder): Order {
  return {
    id: order.id,
    customer: order.customer,
    email: order.email,
    product: order.product,
    amount: order.amount,
    status: fromPrismaOrderStatus(order.status),
    date: order.date.toISOString().split('T')[0],
    country: order.country,
  };
}
