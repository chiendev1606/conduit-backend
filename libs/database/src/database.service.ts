import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DatabaseModuleOptions } from './database.module';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  constructor(config: DatabaseModuleOptions) {
    super({
      datasourceUrl: config.DB_URL,
    });
  }

  async onModuleInit() {
    this.$connect()
      .then(() => {
        this.logger.log('Database connected');
      })
      .catch((error) => {
        this.logger.error('Database connection failed');
        this.logger.error(error);
      });
  }
}
