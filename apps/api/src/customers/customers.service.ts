import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toCustomerDto } from './customers.mapper';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    this.logger.debug('findAll customers');
    const customers = await this.prisma.customer.findMany({
      orderBy: { ltv: 'desc' },
    });

    return customers.map(toCustomerDto);
  }
}
