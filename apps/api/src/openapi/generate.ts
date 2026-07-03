import './preload-env';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { AppModule } from '../app.module';

// Offline-генерация OpenAPI-документа БЕЗ запущенного бэкенда и БЕЗ PostgreSQL.
//
// `NestFactory.create(AppModule, { preview: true })` строит граф модулей и читает
// декораторы (@Controller/@Get/@ApiOkResponse/DTO), НО не инстанцирует провайдеры —
// поэтому PrismaService.onModuleInit() не вызывается и подключение к БД не нужно.
// Это делает генерацию детерминированной и пригодной для CI (drift-gate).
//
// Глобальный префикс 'api' здесь НЕ ставится намеренно: web-клиент обращается к
// путям вида `/orders` (базовый VITE_API_URL уже содержит `/api`), поэтому в
// сгенерированном документе пути должны быть `/orders`, а не `/api/orders`.

const OUTPUT_PATH = join(__dirname, '..', '..', 'openapi.json');

async function generate(): Promise<void> {
  // DATABASE_URL выставляется в ./preload-env (импортируется первым), т.к.
  // validateEnv срабатывает уже при импорте AppModule.
  const app = await NestFactory.create(AppModule, {
    preview: true,
    logger: false,
    abortOnError: false,
  });

  const config = new DocumentBuilder()
    .setTitle('Pulse API')
    .setDescription('Analytics dashboard backend API')
    .setVersion('1.0')
    .build();

  const document = cleanupOpenApiDoc(SwaggerModule.createDocument(app, config));

  writeFileSync(OUTPUT_PATH, `${JSON.stringify(document, null, 2)}\n`, 'utf8');
  await app.close();

  const pathCount = Object.keys(document.paths ?? {}).length;
  process.stdout.write(`OpenAPI document written to ${OUTPUT_PATH} (${pathCount} paths)\n`);
}

generate().catch((err) => {
  process.stderr.write(`Failed to generate OpenAPI document: ${String(err)}\n`);
  process.exit(1);
});
