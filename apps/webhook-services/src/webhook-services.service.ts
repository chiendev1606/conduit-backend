import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookServicesService {
  getHello(): string {
    return 'Hello World!';
  }
}
