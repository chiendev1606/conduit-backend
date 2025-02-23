import { DynamicModule, Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

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
          provide: DatabaseService,
          useFactory: (config: DatabaseModuleOptions) => {
            return new DatabaseService(config);
          },
          inject: ['DATABASE_CONFIG'],
        },
      ],
      exports: ['DATABASE_CONFIG', DatabaseService],
    };
  }
}
