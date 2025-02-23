import { Controller, Get } from '@nestjs/common';
import { CronServicesService } from './cron-services.service';

@Controller()
export class CronServicesController {
  constructor(private readonly cronServicesService: CronServicesService) {}

  @Get()
  getHello(): string {
    return this.cronServicesService.getHello();
  }
}
