import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getFunnel() {
    this.logger.debug('getFunnel');
    // Naturally bounded aggregate (seed: 4 funnel steps) — unbounded read is
    // intentional; these rows are a fixed pipeline, not user data. See plan #5.
    return this.prisma.funnelStep.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async getRetention() {
    this.logger.debug('getRetention');
    // Naturally bounded aggregate (seed: 6 cohorts) — unbounded read is
    // intentional; cohort count grows slowly and stays small. See plan #5.
    return this.prisma.retentionCohort.findMany({
      orderBy: { id: 'asc' },
    });
  }
}
