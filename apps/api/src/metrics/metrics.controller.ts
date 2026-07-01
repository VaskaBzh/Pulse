import { Controller, Get, Query, Logger } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsQuerySchema, type MetricsQuery } from '@pulse/contracts';
import { ZodValidationPipe } from '../common/pipes';

@Controller('metrics')
export class MetricsController {
  private readonly logger = new Logger(MetricsController.name);

  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(MetricsQuerySchema, 'MetricsQuerySchema')) query: MetricsQuery,
  ) {
    const { range } = query;
    const result = await this.metricsService.findByRange(range);
    this.logger.debug(`GET /metrics range=${range} → ${result.length} rows`);
    return result;
  }
}
