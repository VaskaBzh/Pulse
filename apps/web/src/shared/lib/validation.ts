import { z } from 'zod';

export const dateRangeSchema = z.enum(['7d', '30d', '90d']);

export const orderStatusSchema = z.enum(['all', 'completed', 'pending', 'cancelled', 'refunded']);

export const reportTypeSchema = z.enum(['Sales', 'Orders', 'Customers', 'Products']);

export const reportFormatSchema = z.enum(['CSV', 'JSON']);

export const ordersFilterSchema = z.object({
  search: z.string(),
  status: orderStatusSchema,
});

export const reportExportSchema = z.object({
  reportType: reportTypeSchema,
  format: reportFormatSchema,
});

export type DateRange = z.infer<typeof dateRangeSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type ReportType = z.infer<typeof reportTypeSchema>;
export type ReportFormat = z.infer<typeof reportFormatSchema>;
export type OrdersFilterValues = z.infer<typeof ordersFilterSchema>;
export type ReportExportValues = z.infer<typeof reportExportSchema>;
