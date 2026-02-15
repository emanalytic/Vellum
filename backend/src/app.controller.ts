import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      service: 'Vellum Backend',
      status: 'operational',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development',
    };
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString()
    };
  }
}
