import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.ODOO_URL || 'http://localhost:8069',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'setup', testMatch: /.*auth\.setup\.ts/ },
    { name: 'login', testMatch: /.*login\.spec\.ts/, use: { ...devices['Desktop Chrome'] } },
    { name: 'chromium', dependencies: ['setup'], use: { ...devices['Desktop Chrome'] }, testIgnore: /login\.spec\.ts/ },
  ],
});
