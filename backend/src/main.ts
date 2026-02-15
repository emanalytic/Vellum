import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
      bufferLogs: true,
    });

    // Security & Performance Middleware
    app.use(helmet());
    app.use(compression());
    
    // Application Lifecycle
    app.enableShutdownHooks();

    // CORS Configuration
    // In production, you might want to restrict this to specific domains
    app.enableCors({
      origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://www.vellum.foo',
        process.env.FRONTEND_URL || '',
      ].filter(Boolean),
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
    
    // Validation
    app.useGlobalPipes(new ValidationPipe({ 
      whitelist: true, 
      transform: true,
      forbidNonWhitelisted: true, // stricter validation
    }));

    // Body Parsers
    app.use(json({ limit: '10mb' })); // Increased limit slightly for larger payloads if needed
    app.use(urlencoded({ extended: true, limit: '10mb' }));
    
    // Port Configuration
    const port = process.env.PORT ?? 3000;
    
    await app.listen(port, '0.0.0.0');
    
    logger.log(`Vellum Backend is running on port ${port}`);
    logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    
  } catch (error) {
    logger.error('Fatal error during application startup', error);
    process.exit(1);
  }
}

// Global Error Handling for Bootstrap
bootstrap().catch((error) => {
  // Use console.error here as Logger might not be initialized
  console.error('UNHANDLED BOOTSTRAP ERROR:', error);
  process.exit(1);
});

// Explicit Signal Handling (Optional since enableShutdownHooks is on, but good for container orchestrators)
process.on('SIGTERM', () => {
  // NestJS handleShutdownHooks will take care of Graceful Shutdown usually
  // But strictly logging it is good
  const logger = new Logger('Process');
  logger.log('Received SIGTERM signal');
});

