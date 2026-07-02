import { OrderStatus } from '@prisma/client';
import { toPrismaOrderStatus, fromPrismaOrderStatus, toOrderDto } from './orders.mapper';

describe('orders.mapper', () => {
  describe('toPrismaOrderStatus / fromPrismaOrderStatus round-trip', () => {
    const cases: Array<[string, OrderStatus]> = [
      ['completed', OrderStatus.COMPLETED],
      ['pending', OrderStatus.PENDING],
      ['cancelled', OrderStatus.CANCELLED],
      ['refunded', OrderStatus.REFUNDED],
    ];

    it.each(cases)('maps "%s" <-> %s', (contractStatus, prismaStatus) => {
      expect(toPrismaOrderStatus(contractStatus)).toBe(prismaStatus);
      expect(fromPrismaOrderStatus(prismaStatus)).toBe(contractStatus);
    });
  });

  describe('toOrderDto', () => {
    it('maps a Prisma order row to the contract shape', () => {
      const row = {
        id: 'order-1',
        customer: 'Jane Doe',
        email: 'jane@example.com',
        product: 'Widget',
        amount: 42.5,
        status: OrderStatus.COMPLETED,
        date: new Date('2026-06-01T00:00:00.000Z'),
        country: 'US',
      };

      expect(toOrderDto(row)).toEqual({
        id: 'order-1',
        customer: 'Jane Doe',
        email: 'jane@example.com',
        product: 'Widget',
        amount: 42.5,
        status: 'completed',
        date: '2026-06-01',
        country: 'US',
      });
    });
  });
});
