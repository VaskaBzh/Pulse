import { describe, it, expect } from 'vitest';
import {
  dateRangeSchema,
  orderStatusSchema,
  ordersFilterSchema,
  reportExportSchema,
} from '../validation';

describe('dateRangeSchema', () => {
  it.each(['7d', '30d', '90d'])('parses valid value "%s"', (value) => {
    expect(dateRangeSchema.parse(value)).toBe(value);
  });

  it.each(['1d', '', '365d', null, undefined, 0])('rejects invalid value %j', (value) => {
    expect(dateRangeSchema.safeParse(value).success).toBe(false);
  });
});

describe('orderStatusSchema', () => {
  it.each(['all', 'completed', 'pending', 'cancelled', 'refunded'])(
    'parses valid status "%s"',
    (status) => {
      expect(orderStatusSchema.parse(status)).toBe(status);
    },
  );

  it.each(['done', 'active', '', null, 123])('rejects invalid status %j', (value) => {
    expect(orderStatusSchema.safeParse(value).success).toBe(false);
  });
});

describe('ordersFilterSchema', () => {
  it('parses a complete valid object', () => {
    const input = { search: 'test', status: 'completed' };
    expect(ordersFilterSchema.parse(input)).toEqual(input);
  });

  it('parses with empty search string', () => {
    const input = { search: '', status: 'all' };
    expect(ordersFilterSchema.parse(input)).toEqual(input);
  });

  it('rejects missing search field', () => {
    expect(ordersFilterSchema.safeParse({ status: 'pending' }).success).toBe(false);
  });

  it('rejects missing status field', () => {
    expect(ordersFilterSchema.safeParse({ search: 'x' }).success).toBe(false);
  });

  it('rejects invalid status value', () => {
    expect(ordersFilterSchema.safeParse({ search: '', status: 'shipped' }).success).toBe(false);
  });

  it('rejects empty object', () => {
    expect(ordersFilterSchema.safeParse({}).success).toBe(false);
  });
});

describe('reportExportSchema', () => {
  it.each([
    { reportType: 'Sales', format: 'CSV' },
    { reportType: 'Orders', format: 'JSON' },
    { reportType: 'Customers', format: 'CSV' },
    { reportType: 'Products', format: 'JSON' },
  ])('parses valid combination %j', (input) => {
    expect(reportExportSchema.parse(input)).toEqual(input);
  });

  it('rejects unknown reportType', () => {
    expect(reportExportSchema.safeParse({ reportType: 'Analytics', format: 'CSV' }).success).toBe(
      false,
    );
  });

  it('rejects unknown format', () => {
    expect(reportExportSchema.safeParse({ reportType: 'Sales', format: 'XML' }).success).toBe(
      false,
    );
  });

  it('rejects empty object', () => {
    expect(reportExportSchema.safeParse({}).success).toBe(false);
  });

  it('rejects missing format field', () => {
    expect(reportExportSchema.safeParse({ reportType: 'Sales' }).success).toBe(false);
  });
});
