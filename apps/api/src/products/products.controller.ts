import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductDto } from '../openapi/dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOkResponse({ type: [ProductDto] })
  async findAll() {
    const result = await this.productsService.findAll();
    this.logger.debug(`GET /products → ${result.length} items`);
    return result;
  }
}
