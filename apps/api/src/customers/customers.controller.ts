import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CustomerDto } from '../openapi/dto';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  private readonly logger = new Logger(CustomersController.name);

  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiOkResponse({ type: [CustomerDto] })
  async findAll() {
    const result = await this.customersService.findAll();
    this.logger.debug(`GET /customers → ${result.length} items`);
    return result;
  }
}
