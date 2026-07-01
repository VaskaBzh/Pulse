import { Controller, Get, Logger } from '@nestjs/common';
import { TrafficService } from './traffic.service';

@Controller('traffic-sources')
export class TrafficController {
  private readonly logger = new Logger(TrafficController.name);

  constructor(private readonly trafficService: TrafficService) {}

  @Get()
  async findAll() {
    const result = await this.trafficService.findAll();
    this.logger.debug(`GET /traffic-sources → ${result.length} items`);
    return result;
  }
}
