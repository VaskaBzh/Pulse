import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
const port = isCI ? 4173 : 5173;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: isCI
      ? `npx vite preview --port ${port} --host 127.0.0.1`
      : `npx vite dev --port ${port} --host 127.0.0.1`,
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
