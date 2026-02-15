import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): object {
    return {
      status: 'ok',
      message: 'Vellum Backend is Running!',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`
      }
    };
  }

  @Get('health')
  healthCheck(): object {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString()
    };
  }
}
