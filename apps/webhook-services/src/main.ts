import { NestFactory } from '@nestjs/core';
import { WebhookServicesModule } from './webhook-services.module';

async function bootstrap() {
  const app = await NestFactory.create(WebhookServicesModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
