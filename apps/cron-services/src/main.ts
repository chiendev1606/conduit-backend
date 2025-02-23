import { NestFactory } from '@nestjs/core';
import { CronServicesModule } from './cron-services.module';

async function bootstrap() {
  const app = await NestFactory.create(CronServicesModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
