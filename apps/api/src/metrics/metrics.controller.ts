import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';
import { MetricsQuerySchema } from '@pulse/contracts';
import { ZodValidationPipe } from '../common/pipes';
import { MetricsQueryDto, DailyMetricDto } from '../openapi/dto';

@ApiTags('metrics')
@Controller('metrics')
export class MetricsController {
  private readonly logger = new Logger(MetricsController.name);

  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @ApiOkResponse({ type: [DailyMetricDto] })
  async findAll(
    @Query(new ZodValidationPipe(MetricsQuerySchema, 'MetricsQuerySchema')) query: MetricsQueryDto,
  ) {
    const { range } = query;
    const result = await this.metricsService.findByRange(range);
    this.logger.debug(`GET /metrics range=${range} → ${result.length} rows`);
    return result;
  }
}
