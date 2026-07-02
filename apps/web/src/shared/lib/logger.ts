/* eslint-disable no-console -- this module is the single sanctioned wrapper around console */

// Verbose logging is intentional during development but must be configurable and
// silenced in production. Levels are gated by VITE_LOG_LEVEL (falls back to
// `debug` in dev and `warn` in production builds). This is the only place in the
// app allowed to call `console.*` directly — everything else imports `logger`.

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

const LEVEL_WEIGHT: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: 100,
};

function resolveLevel(): LogLevel {
  const configured = import.meta.env.VITE_LOG_LEVEL;
  if (configured && configured in LEVEL_WEIGHT) {
    return configured as LogLevel;
  }
  return import.meta.env.PROD ? 'warn' : 'debug';
}

const activeWeight = LEVEL_WEIGHT[resolveLevel()];

function enabled(level: LogLevel): boolean {
  return LEVEL_WEIGHT[level] >= activeWeight;
}

export const logger = {
  debug(...args: unknown[]): void {
    if (enabled('debug')) console.debug(...args);
  },
  info(...args: unknown[]): void {
    if (enabled('info')) console.info(...args);
  },
  warn(...args: unknown[]): void {
    if (enabled('warn')) console.warn(...args);
  },
  error(...args: unknown[]): void {
    if (enabled('error')) console.error(...args);
  },
};
