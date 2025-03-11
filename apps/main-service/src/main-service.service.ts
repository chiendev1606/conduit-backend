import { Injectable } from '@nestjs/common';

@Injectable()
export class MainServicesService {
  getHello(): string {
    return 'Hello World!';
  }
}
