import { Controller, Get, Logger } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  private readonly logger = new Logger(CustomersController.name);

  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async findAll() {
    const result = await this.customersService.findAll();
    this.logger.debug(`GET /customers → ${result.length} items`);
    return result;
  }
}
