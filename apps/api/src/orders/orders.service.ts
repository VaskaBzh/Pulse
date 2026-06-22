import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, OrderStatus } from '@prisma/client';
import type { OrdersQuery, PaginatedResponse, Order } from '@pulse/contracts';

const STATUS_MAP: Record<string, OrderStatus> = {
  completed: OrderStatus.COMPLETED,
  pending: OrderStatus.PENDING,
  cancelled: OrderStatus.CANCELLED,
  refunded: OrderStatus.REFUNDED,
};

const ALLOWED_SORT_FIELDS = new Set([
  'date',
  'amount',
  'customer',
  'email',
  'product',
  'status',
  'country',
]);

const STATUS_REVERSE = {
  [OrderStatus.COMPLETED]: 'completed',
  [OrderStatus.PENDING]: 'pending',
  [OrderStatus.CANCELLED]: 'cancelled',
  [OrderStatus.REFUNDED]: 'refunded',
} as const satisfies Record<OrderStatus, string>;

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: OrdersQuery): Promise<PaginatedResponse<Order>> {
    const { page, limit, sort, search, status } = query;

    const where: Prisma.OrderWhereInput = {};

    if (status) {
      where.status = STATUS_MAP[status];
    }

    if (search) {
      where.OR = [
        { customer: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [rawField, sortDir] = sort.split(':');
    const sortField = ALLOWED_SORT_FIELDS.has(rawField) ? rawField : 'date';
    const orderBy: Prisma.OrderOrderByWithRelationInput = {
      [sortField]: sortDir === 'asc' ? 'asc' : 'desc',
    };

    this.logger.debug(
      `findAll status=${status ?? 'all'} search=${search ?? ''} sort=${sort} page=${page} limit=${limit}`,
    );

    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: items.map((o) => ({
        id: o.id,
        customer: o.customer,
        email: o.email,
        product: o.product,
        amount: o.amount,
        status: STATUS_REVERSE[o.status],
        date: o.date.toISOString().split('T')[0],
        country: o.country,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
