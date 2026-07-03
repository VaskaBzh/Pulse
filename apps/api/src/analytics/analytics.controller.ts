import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { FunnelStepDto, RetentionRowDto } from '../openapi/dto';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  private readonly logger = new Logger(AnalyticsController.name);

  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('funnel')
  @ApiOkResponse({ type: [FunnelStepDto] })
  async getFunnel() {
    const result = await this.analyticsService.getFunnel();
    this.logger.debug(`GET /analytics/funnel → ${result.length} steps`);
    return result;
  }

  @Get('retention')
  @ApiOkResponse({ type: [RetentionRowDto] })
  async getRetention() {
    const result = await this.analyticsService.getRetention();
    this.logger.debug(`GET /analytics/retention → ${result.length} cohorts`);
    return result;
  }
}
