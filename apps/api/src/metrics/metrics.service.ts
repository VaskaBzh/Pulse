import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findByRange(range: '7d' | '30d' | '90d') {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const since = new Date();
    // `date` is stored as `@db.Date` (no time component), so Postgres compares
    // against the calendar day of `since` — leaving a time-of-day on `since`
    // makes the boundary day inclusive, returning `days + 1` rows instead of `days`.
    since.setUTCHours(0, 0, 0, 0);
    since.setUTCDate(since.getUTCDate() - (days - 1));

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
