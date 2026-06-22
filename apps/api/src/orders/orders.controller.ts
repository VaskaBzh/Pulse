import { Controller, Get, Query, Logger, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersQuerySchema } from '@pulse/contracts';

@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
    @Query('search') search?: string,
  ) {
    const parsed = OrdersQuerySchema.safeParse({ status, page, limit, sort, search });
    if (!parsed.success) {
      this.logger.warn(`GET /orders validation failed: ${JSON.stringify(parsed.error.issues)}`);
      throw new BadRequestException(parsed.error.issues);
    }

    const query = parsed.data;
    const result = await this.ordersService.findAll(query);
    this.logger.debug(
      `GET /orders status=${query.status ?? 'all'} page=${query.page} → total=${result.meta.total}`,
    );
    return result;
  }
}
