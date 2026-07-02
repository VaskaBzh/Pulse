import { z } from 'zod/v4';

export const envSchema = z.object({
  DATABASE_URL: z.string().regex(/^postgres(ql)?:\/\//, 'must be a postgres connection string'),
  PORT: z.coerce.number().int().positive().default(3000),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  // `nest build` bundles everything into a single dist/main.js (nest-cli.json
  // webpack:true), which breaks Prisma's runtime engine auto-discovery. Setting
  // this makes Prisma load the query engine directly (see apps/api/.env + Dockerfile).
  // Optional & OS-specific — must be declared here so ConfigModule's `validate`
  // does not strip it before it reaches process.env, where Prisma reads it.
  PRISMA_QUERY_ENGINE_LIBRARY: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;
