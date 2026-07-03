import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    this.logger.debug('findAll products');
    // Conscious unbounded read: a small product catalog (seed: 6). Category
    // filter/sort run on the client because this set stays bounded; add
    // server-side params here if the catalog grows — see plan #5.
    return this.prisma.product.findMany({
      orderBy: { revenue: 'desc' },
    });
  }
}
