import { Controller, Get } from '@nestjs/common';
import { MainServicesService } from './main-service.service';

@Controller()
export class MainServiceController {
  constructor(private readonly mainServicesService: MainServicesService) {}

  @Get()
  getHello(): string {
    return this.mainServicesService.getHello();
  }
}
