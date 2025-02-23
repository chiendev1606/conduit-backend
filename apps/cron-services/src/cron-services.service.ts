import { Injectable } from '@nestjs/common';

@Injectable()
export class CronServicesService {
  getHello(): string {
    return 'Hello World!';
  }
}
