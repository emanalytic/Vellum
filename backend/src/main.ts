import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    
    // Quick request logger to see if requests are reaching the server
    app.use((req, res, next) => {
      console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
      next();
    });

    app.enableCors({
      origin: true, // Mirror the request origin (safer for debugging)
      credentials: true,
    });
    
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.use(json({ limit: '1mb' }));
    app.use(urlencoded({ extended: true, limit: '1mb' }));
    
    const port = process.env.PORT ?? 3000;
    await app.listen(port, '0.0.0.0');
    
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Vellum Backend ready on port ${port}`);
    console.log(`Memory usage: ${Math.round(used * 100) / 100} MB`);
    
  } catch (error) {
    console.error('FATAL STARTUP ERROR:', error);
    process.exit(1);
  }
}
bootstrap();
