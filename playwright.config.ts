import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  outputDir: 'test/scratch/playwright',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173/preview/',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node tests/serve.mjs',
    url: 'http://127.0.0.1:4173/preview/',
    reuseExistingServer: false,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
});
