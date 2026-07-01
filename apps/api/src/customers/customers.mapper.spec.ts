import { CustomerSegment } from '@prisma/client';
import { fromPrismaCustomerSegment, toCustomerDto } from './customers.mapper';

describe('customers.mapper', () => {
  describe('fromPrismaCustomerSegment', () => {
    const cases: Array<[CustomerSegment, string]> = [
      [CustomerSegment.ENTERPRISE, 'Enterprise'],
      [CustomerSegment.PRO, 'Pro'],
      [CustomerSegment.STARTER, 'Starter'],
    ];

    it.each(cases)('maps %s -> "%s"', (prismaSegment, expected) => {
      expect(fromPrismaCustomerSegment(prismaSegment)).toBe(expected);
    });
  });

  describe('toCustomerDto', () => {
    it('maps a Prisma customer row to the contract shape', () => {
      const row = {
        id: 'cust-1',
        name: 'Acme Corp',
        email: 'billing@acme.test',
        segment: CustomerSegment.ENTERPRISE,
        ltv: 12000,
        joinDate: new Date('2025-01-15T00:00:00.000Z'),
        country: 'DE',
        orders: 7,
      };

      expect(toCustomerDto(row)).toEqual({
        id: 'cust-1',
        name: 'Acme Corp',
        email: 'billing@acme.test',
        segment: 'Enterprise',
        ltv: 12000,
        joinDate: '2025-01-15',
        country: 'DE',
        orders: 7,
      });
    });
  });
});
