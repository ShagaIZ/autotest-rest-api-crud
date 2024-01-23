import { test, expect } from '@playwright/test'
import { API_KEY } from '../../../api_key'
import { urls } from '../../common/urls'
test.describe('Getting unix time', async () => {
	test('Valid url, with token -> getting unix time', async ({ request }) => {
		let res = await request.get(urls.probe, {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
			},
		})
		let resJson = await res.json()
		await expect(res).toBeOK()
		await expect(res.status()).toBe(200)
		await expect(resJson.time).toBeTruthy()
		await expect(resJson.time).toBeGreaterThan(1700000000)
		await expect(resJson.time).toBeLessThan(2000000000)
	})

	test('Invalid url -> 400 error', async ({ request }) => {
		let res = await request.get(`1212${urls.probe}`, {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
			},
		})
		await expect(res.status()).toBe(404)
	})

	test('Without token -> 400 error', async ({ request }) => {
		let res = await request.get(`${urls.probe}`, {
			headers: {
				Authorization: ``,
			},
		})
		let resJson = await res.json()
		await expect(resJson.error).toBe('Bad request')
		await expect(res.status()).toBe(400)
	})

	test('Invalid method -> 400 error', async ({ request }) => {
		let res = await request.post(`${urls.probe}`, {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
			},
		})
		let resJson = await res.json()
		await expect(resJson.error).toBe('Bad request')
		await expect(res.status()).toBe(400)
	})
})
