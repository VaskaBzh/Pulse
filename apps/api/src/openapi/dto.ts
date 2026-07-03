import { createZodDto } from 'nestjs-zod';
import {
  OrderSchema,
  OrdersQuerySchema,
  DailyMetricSchema,
  MetricsQuerySchema,
  TrafficSourceSchema,
  ProductSchema,
  FunnelStepSchema,
  RetentionRowSchema,
  CustomerSchema,
  HealthResponseSchema,
  PaginatedResponseSchema,
} from '@pulse/contracts';

// DTO-обёртки над Zod-контрактами из @pulse/contracts.
// Единственная роль — дать @nestjs/swagger OpenAPI-схему (request/response),
// чтобы `/api/docs-json` содержал непустые схемы и openapi-typescript мог
// сгенерировать типизированный клиент. Рантайм-валидация по-прежнему выполняется
// существующим кастомным ZodValidationPipe и не меняется.

export class OrderDto extends createZodDto(OrderSchema) {}
export class PaginatedOrdersDto extends createZodDto(PaginatedResponseSchema(OrderSchema)) {}
export class OrdersQueryDto extends createZodDto(OrdersQuerySchema) {}

export class DailyMetricDto extends createZodDto(DailyMetricSchema) {}
export class MetricsQueryDto extends createZodDto(MetricsQuerySchema) {}

export class TrafficSourceDto extends createZodDto(TrafficSourceSchema) {}

export class ProductDto extends createZodDto(ProductSchema) {}
export class FunnelStepDto extends createZodDto(FunnelStepSchema) {}
export class RetentionRowDto extends createZodDto(RetentionRowSchema) {}

export class CustomerDto extends createZodDto(CustomerSchema) {}

export class HealthResponseDto extends createZodDto(HealthResponseSchema) {}
