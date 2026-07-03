import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findByRange(range: '7d' | '30d' | '90d') {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;

    // Anchor the window to the latest available data point, NOT `new Date()`.
    // The dataset is fixed in the past (seed), so anchoring to the wall clock
    // makes `Nd` return fewer than N rows once "today" drifts past the last
    // seeded day (finding A: "asked for 90, got 89"). Anchoring to MAX(date)
    // keeps `Nd` == N regardless of when the seed ran vs. when we query.
    const latest = await this.prisma.dailyMetric.findFirst({
      orderBy: { date: 'desc' },
      select: { date: true },
    });

    if (!latest) {
      this.logger.debug(`findByRange range=${range} days=${days} → no data`);
      return [];
    }

    const anchor = latest.date;
    // `date` is stored as `@db.Date` (no time component); `anchor` is already at
    // UTC midnight. Go back `days - 1` whole days so the inclusive window spans
    // exactly `days` calendar days ending at the last available date.
    const since = new Date(anchor);
    since.setUTCHours(0, 0, 0, 0);
    since.setUTCDate(since.getUTCDate() - (days - 1));

    this.logger.debug(
      `findByRange range=${range} days=${days} anchor=${anchor.toISOString()} since=${since.toISOString()}`,
    );

    const metrics = await this.prisma.dailyMetric.findMany({
      where: { date: { gte: since, lte: anchor } },
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
