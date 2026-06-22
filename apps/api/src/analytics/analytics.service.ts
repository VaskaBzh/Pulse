import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getFunnel() {
    this.logger.debug('getFunnel');
    return this.prisma.funnelStep.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async getRetention() {
    this.logger.debug('getRetention');
    return this.prisma.retentionCohort.findMany({
      orderBy: { id: 'asc' },
    });
  }
}
