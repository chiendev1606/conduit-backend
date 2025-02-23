import { Module } from '@nestjs/common';
import { WebhookServicesController } from './webhook-services.controller';
import { WebhookServicesService } from './webhook-services.service';

@Module({
  imports: [],
  controllers: [WebhookServicesController],
  providers: [WebhookServicesService],
})
export class WebhookServicesModule {}
