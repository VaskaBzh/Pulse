import { Logger } from '@nestjs/common';
import { envSchema, type EnvConfig } from './env.schema';

const logger = new Logger('EnvValidation');

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    logger.error(`Invalid environment configuration: ${JSON.stringify(parsed.error.issues)}`);
    throw new Error(
      `Invalid environment configuration: ${parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')}`,
    );
  }

  logger.debug(
    `Environment validated: PORT=${parsed.data.PORT} CORS_ORIGIN=${parsed.data.CORS_ORIGIN}`,
  );
  return parsed.data;
}
