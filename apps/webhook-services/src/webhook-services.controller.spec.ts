import { Test, TestingModule } from '@nestjs/testing';
import { WebhookServicesController } from './webhook-services.controller';
import { WebhookServicesService } from './webhook-services.service';

describe('WebhookServicesController', () => {
  let webhookServicesController: WebhookServicesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WebhookServicesController],
      providers: [WebhookServicesService],
    }).compile();

    webhookServicesController = app.get<WebhookServicesController>(WebhookServicesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(webhookServicesController.getHello()).toBe('Hello World!');
    });
  });
});
