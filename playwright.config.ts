import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'src/',
  retries: 1,
  workers: 2,
  reporter: process.env.CI ? 'list' : 'html',
  use: {
    baseURL: 'https://crudapi.co.uk',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'autotest-rest-api-crud',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
