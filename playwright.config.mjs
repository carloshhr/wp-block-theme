import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  testIgnore: process.env.WP_BASE_URL === 'http://localhost:8890' ? [] : ['**/editor-persistence.spec.mjs'],
  use: { baseURL: process.env.WP_BASE_URL || 'http://localhost:8888', browserName: 'chromium' },
  reporter: 'list',
});
