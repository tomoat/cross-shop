import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to Cross Shop API!';
  }

  getStatus(): any {
    return {
      status: 'running',
      timestamp: new Date(),
      service: 'cross-shop-api',
    };
  }
}