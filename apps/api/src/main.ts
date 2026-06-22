import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT ?? 3000;
  const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:5173';

  app.setGlobalPrefix('api');
  app.enableCors({ origin: corsOrigin, credentials: true });
  app.useGlobalFilters(new GlobalExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Pulse API')
    .setDescription('Analytics dashboard backend API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  logger.log(`API running on http://localhost:${port}`);
  logger.log(`Swagger at http://localhost:${port}/api/docs`);
  logger.log(`CORS origin: ${corsOrigin}`);
}

bootstrap();
