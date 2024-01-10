import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
  testDir: 'src/',
  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,
 
  workers: process.env.CI ? 1 : undefined,

  reporter: 'list',

  use: {
 
    baseURL: 'https://crudapi.co.uk',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },


  
  ],

});
