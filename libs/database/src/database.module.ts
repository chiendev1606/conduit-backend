import { DynamicModule, Global, Module } from '@nestjs/common';
import { DatabaseServices } from './database.service';

export interface DatabaseModuleOptions {
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_URL: string;
}

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(config: DatabaseModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DATABASE_CONFIG',
          useValue: config,
        },
        {
          provide: DatabaseServices,
          useFactory: (config: DatabaseModuleOptions) => {
            return new DatabaseServices(config);
          },
          inject: ['DATABASE_CONFIG'],
        },
      ],
      exports: ['DATABASE_CONFIG', DatabaseServices],
    };
  }
}
