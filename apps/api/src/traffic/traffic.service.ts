import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrafficService {
  private readonly logger = new Logger(TrafficService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    this.logger.debug('findAll traffic sources');
    // Naturally bounded reference table (seed: 5 traffic channels) — unbounded
    // read is intentional and safe; no pagination needed. See plan #5.
    return this.prisma.trafficSource.findMany({
      orderBy: { value: 'desc' },
    });
  }
}
