import { DatabaseModule } from '@conduit/database';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import configEnv, { validate } from './config';
import { MainServiceController } from './main-service.controller';
import { MainServicesService } from './main-service.service';
import { ArticlesModule } from './modules/articles/articles.module';
import { AuthGuard } from './modules/guards/auth.guard';
import { ProfileModule } from './modules/profile/profile.module';
import { UsersModule } from './modules/users/user.module';

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
    JwtModule.register({
      global: true,
      secret: configEnv.JWT_SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
    UsersModule,
    ProfileModule,
    ArticlesModule,
  ],
  controllers: [MainServiceController],
  providers: [
    MainServicesService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class MainServiceModule {}
