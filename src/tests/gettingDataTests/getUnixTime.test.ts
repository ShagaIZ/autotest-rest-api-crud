import { test, expect, request } from '@playwright/test'
import { urls } from '../../common/urls'
test.describe('Getting unix time', async () => {
	test('Valid url, with token -> getting unix time', async () => {
		const requestContext = await request.newContext()
		let res = await requestContext.get(urls.probe, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		})
		let resJson = await res.json()
		await expect(res).toBeOK()
		await expect(res.status()).toBe(200)
		await expect(resJson.time).toBeTruthy()
		await expect(resJson.time).toBeGreaterThan(1700000000)
		await expect(resJson.time).toBeLessThan(2000000000)
		await requestContext.dispose()
	})

	test('Invalid url -> 400 error', async () => {
		const requestContext = await request.newContext()
		let res = await requestContext.get(`1212${urls.probe}`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		})
		await expect(res.status()).toBe(404)
		await requestContext.dispose()
	})

	test('Without token -> 400 error', async () => {
		const requestContext = await request.newContext()
		let res = await requestContext.get(`${urls.probe}`, {
			headers: {
				Authorization: ``,
			},
		})
		let resJson = await res.json()
		await expect(resJson.error).toBe('Bad request')
		await expect(res.status()).toBe(400)
		await requestContext.dispose()
	})

	test('Invalid method -> 400 error', async () => {
		const requestContext = await request.newContext()
		let res = await requestContext.post(`${urls.probe}`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		})
		let resJson = await res.json()
		await expect(resJson.error).toBe('Bad request')
		await expect(res.status()).toBe(400)
		await requestContext.dispose()
	})
})
