import { Controller, Get, Query, Logger, BadRequestException } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsQuerySchema } from '@pulse/contracts';

@Controller('metrics')
export class MetricsController {
  private readonly logger = new Logger(MetricsController.name);

  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  async findAll(@Query('range') range?: string) {
    const parsed = MetricsQuerySchema.safeParse({ range });
    if (!parsed.success) {
      this.logger.warn(`GET /metrics invalid range=${range}`);
      throw new BadRequestException(parsed.error.issues);
    }

    const { range: validRange } = parsed.data;
    const result = await this.metricsService.findByRange(validRange);
    this.logger.debug(`GET /metrics range=${validRange} → ${result.length} rows`);
    return result;
  }
}
