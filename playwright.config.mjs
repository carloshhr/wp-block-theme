import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://localhost:8888', browserName: 'chromium' },
  reporter: 'list',
});
