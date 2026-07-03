import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { TrafficService } from './traffic.service';
import { TrafficSourceDto } from '../openapi/dto';

@ApiTags('traffic-sources')
@Controller('traffic-sources')
export class TrafficController {
  private readonly logger = new Logger(TrafficController.name);

  constructor(private readonly trafficService: TrafficService) {}

  @Get()
  @ApiOkResponse({ type: [TrafficSourceDto] })
  async findAll() {
    const result = await this.trafficService.findAll();
    this.logger.debug(`GET /traffic-sources → ${result.length} items`);
    return result;
  }
}
