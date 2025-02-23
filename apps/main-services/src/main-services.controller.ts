import { Controller, Get } from '@nestjs/common';
import { MainServicesService } from './main-services.service';

@Controller()
export class MainServicesController {
  constructor(private readonly mainServicesService: MainServicesService) {}

  @Get()
  getHello(): string {
    return this.mainServicesService.getHello();
  }
}
