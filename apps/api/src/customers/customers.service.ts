import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CustomerSegment } from '@prisma/client';

const SEGMENT_MAP: Record<CustomerSegment, string> = {
  [CustomerSegment.ENTERPRISE]: 'Enterprise',
  [CustomerSegment.PRO]: 'Pro',
  [CustomerSegment.STARTER]: 'Starter',
};

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    this.logger.debug('findAll customers');
    const customers = await this.prisma.customer.findMany({
      orderBy: { ltv: 'desc' },
    });

    return customers.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      segment: SEGMENT_MAP[c.segment],
      ltv: c.ltv,
      joinDate: c.joinDate.toISOString().split('T')[0],
      country: c.country,
      orders: c.orders,
    }));
  }
}
