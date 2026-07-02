import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    this.logger.debug('findAll products');
    return this.prisma.product.findMany({
      orderBy: { revenue: 'desc' },
    });
  }
}
