import { Test, TestingModule } from '@nestjs/testing';
import { MainServicesController } from './main-services.controller';
import { MainServicesService } from './main-services.service';

describe('MainServicesController', () => {
  let mainServicesController: MainServicesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MainServicesController],
      providers: [MainServicesService],
    }).compile();

    mainServicesController = app.get<MainServicesController>(
      MainServicesController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(mainServicesController.getHello()).toBe('Hello World!');
    });
  });
});
