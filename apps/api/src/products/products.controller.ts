import { Controller, Get, Logger } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll() {
    const result = await this.productsService.findAll();
    this.logger.debug(`GET /products → ${result.length} items`);
    return result;
  }
}
