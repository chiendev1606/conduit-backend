import { Module } from '@nestjs/common';
import { CronServicesController } from './cron-services.controller';
import { CronServicesService } from './cron-services.service';

@Module({
  imports: [],
  controllers: [CronServicesController],
  providers: [CronServicesService],
})
export class CronServicesModule {}
