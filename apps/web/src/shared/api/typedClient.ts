import type { z } from 'zod/v4';
import type { paths } from './generated';
import { apiRequest } from './httpClient';

// Типизированная надстройка над apiRequest, использующая типы из сгенерированного
// OpenAPI-документа (`generated.ts`). Даёт compile-time типобезопасность путей и
// query-параметров, при этом рантайм-валидация тела по-прежнему выполняется Zod.
//
// Ценность: путь ограничен реально существующими GET-роутами, query-параметры
// типизированы из контракта бэка, а тип, который валидирует Zod-схема, обязан
// совпадать с типом ответа из OpenAPI — если контракт бэка «уплывёт», вызов
// перестанет проходить typecheck (детектор дрейфа маршрутов/параметров).

// Пути, у которых есть GET-операция.
type GetPaths = {
  [P in keyof paths]: paths[P] extends { get: unknown } ? P : never;
}[keyof paths];

type GetOp<P extends GetPaths> = paths[P] extends { get: infer G } ? G : never;

type QueryOf<P extends GetPaths> = GetOp<P> extends { parameters: { query?: infer Q } } ? Q : never;

type ResponseOf<P extends GetPaths> =
  GetOp<P> extends { responses: { 200: { content: { 'application/json': infer R } } } } ? R : never;

function buildQuery(query: Record<string, unknown> | undefined): string {
  if (!query) return '';
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) usp.set(key, String(value));
  }
  const qs = usp.toString();
  return qs ? `?${qs}` : '';
}

export async function typedGet<P extends GetPaths, T extends ResponseOf<P>>(
  path: P,
  schema: z.ZodType<T>,
  query?: QueryOf<P>,
): Promise<T> {
  return apiRequest(`${path}${buildQuery(query as Record<string, unknown> | undefined)}`, schema);
}
