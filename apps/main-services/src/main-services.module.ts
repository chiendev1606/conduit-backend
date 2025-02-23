import { Module } from '@nestjs/common';
import { MainServicesController } from './main-services.controller';
import { MainServicesService } from './main-services.service';
import { ConfigModule } from '@nestjs/config';
import configEnv, { validate } from './config';
import { DatabaseModule } from '@conduit/database';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validate,
    }),
    DatabaseModule.forRoot({
      DB_USERNAME: configEnv.DB_USERNAME,
      DB_PASSWORD: configEnv.DB_PASSWORD,
      DB_HOST: configEnv.DB_HOST,
      DB_PORT: parseInt(configEnv.DB_PORT),
      DB_NAME: configEnv.DB_NAME,
      DB_URL: configEnv.DB_URL,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [MainServicesController],
  providers: [MainServicesService],
})
export class MainServicesModule {}
