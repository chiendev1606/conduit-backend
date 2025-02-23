import { Test, TestingModule } from '@nestjs/testing';
import { CronServicesController } from './cron-services.controller';
import { CronServicesService } from './cron-services.service';

describe('CronServicesController', () => {
  let cronServicesController: CronServicesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CronServicesController],
      providers: [CronServicesService],
    }).compile();

    cronServicesController = app.get<CronServicesController>(CronServicesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(cronServicesController.getHello()).toBe('Hello World!');
    });
  });
});
