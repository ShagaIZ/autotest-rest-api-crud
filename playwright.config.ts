import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
	testDir: 'src/',
	retries: 2,
	workers: 1,
	reporter: 'list',
	use: {
		baseURL: 'https://crudapi.co.uk',
		trace: 'retain-on-failure',
	},

	projects: [
		{
			name: 'autotest-rest-api-crud',
			use: { ...devices['Desktop Chrome'] },
		},
	],
})
