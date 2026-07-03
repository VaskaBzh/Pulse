import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toCustomerDto } from './customers.mapper';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    this.logger.debug('findAll customers');
    // Conscious unbounded read: a bounded reference set (seed: 20) rendered as a
    // single client-side list/segment view. If this grows large, add server-side
    // pagination/filtering here (mirroring OrdersService) before the client list
    // starts over-fetching — see audit finding B / plan #5.
    const customers = await this.prisma.customer.findMany({
      orderBy: { ltv: 'desc' },
    });

    return customers.map(toCustomerDto);
  }
}
