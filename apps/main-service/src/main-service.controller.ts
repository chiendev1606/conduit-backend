import { Controller } from '@nestjs/common';
import { MainServicesService } from './main-service.service';

@Controller()
export class MainServiceController {
  constructor(private readonly mainServicesService: MainServicesService) {}
}
