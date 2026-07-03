import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { OrdersQuerySchema } from '@pulse/contracts';
import { ZodValidationPipe } from '../common/pipes';
import { OrdersQueryDto, PaginatedOrdersDto } from '../openapi/dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOkResponse({ type: PaginatedOrdersDto })
  async findAll(
    @Query(new ZodValidationPipe(OrdersQuerySchema, 'OrdersQuerySchema')) query: OrdersQueryDto,
  ) {
    const result = await this.ordersService.findAll(query);
    this.logger.debug(
      `GET /orders status=${query.status ?? 'all'} page=${query.page} → total=${result.meta.total}`,
    );
    return result;
  }
}
