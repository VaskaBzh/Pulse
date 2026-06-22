import { Controller, Get, Logger } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  private readonly logger = new Logger(AnalyticsController.name);

  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('funnel')
  async getFunnel() {
    const result = await this.analyticsService.getFunnel();
    this.logger.debug(`GET /analytics/funnel → ${result.length} steps`);
    return result;
  }

  @Get('retention')
  async getRetention() {
    const result = await this.analyticsService.getRetention();
    this.logger.debug(`GET /analytics/retention → ${result.length} cohorts`);
    return result;
  }
}
