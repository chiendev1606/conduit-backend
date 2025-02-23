import { NestFactory } from '@nestjs/core';
import { MainServicesModule } from './main-services.module';
import configEnv from './config';

async function bootstrap() {
  const app = await NestFactory.create(MainServicesModule);
  await app.listen(process.env.port ?? 3000);
  console.log('run main service');
  console.log(configEnv);
}
bootstrap();
