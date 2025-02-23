import { NestFactory } from '@nestjs/core';
import { MainServicesModule } from './main-services.module';
import configEnv from './config';
import { ValidationPipe } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(MainServicesModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(validationErrors);
      },
      validationError: {
        target: false,
      },
      transform: true,
    }),
  );

  await app.listen(process.env.port ?? 3000);
  console.log('run main service');
  console.log(configEnv);
}
bootstrap();
