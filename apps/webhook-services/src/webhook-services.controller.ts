import { Controller, Get } from '@nestjs/common';
import { WebhookServicesService } from './webhook-services.service';

@Controller()
export class WebhookServicesController {
  constructor(private readonly webhookServicesService: WebhookServicesService) {}

  @Get()
  getHello(): string {
    return this.webhookServicesService.getHello();
  }
}
