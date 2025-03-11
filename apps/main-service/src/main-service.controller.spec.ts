import { Test, TestingModule } from '@nestjs/testing';
import { MainServiceController } from './main-service.controller';
import { MainServicesService } from './main-service.service';

describe('MainServicesController', () => {
  let mainServicesController: MainServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MainServiceController],
      providers: [MainServicesService],
    }).compile();

    mainServicesController = app.get<MainServiceController>(
      MainServiceController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(mainServicesController.getHello()).toBe('Hello World!');
    });
  });
});
