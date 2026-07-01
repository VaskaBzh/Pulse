import { Controller, Get, Query, Logger } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersQuerySchema, type OrdersQuery } from '@pulse/contracts';
import { ZodValidationPipe } from '../common/pipes';

@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(OrdersQuerySchema, 'OrdersQuerySchema')) query: OrdersQuery,
  ) {
    const result = await this.ordersService.findAll(query);
    this.logger.debug(
      `GET /orders status=${query.status ?? 'all'} page=${query.page} → total=${result.meta.total}`,
    );
    return result;
  }
}
