import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findByRange(range: '7d' | '30d' | '90d') {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const since = new Date();
    since.setDate(since.getDate() - days);

    this.logger.debug(`findByRange range=${range} days=${days} since=${since.toISOString()}`);

    const metrics = await this.prisma.dailyMetric.findMany({
      where: { date: { gte: since } },
      orderBy: { date: 'asc' },
    });

    return metrics.map((m) => ({
      date: m.date.toISOString().split('T')[0],
      revenue: m.revenue,
      profit: m.profit,
      orders: m.orders,
      users: m.users,
      sessions: m.sessions,
      conversionRate: m.conversionRate,
      avgOrderValue: m.avgOrderValue,
    }));
  }
}
