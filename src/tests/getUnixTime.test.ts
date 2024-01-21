import { test, expect } from '@playwright/test'
import { API_KEY } from '../../api_key'
import { urls } from '../common/urls'
test.describe('Getting unix time', async()=>{
test('Getting unix time from server', async ({ request }) => {
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

test('Getting unix time from server with invalid url', async ({ request }) => {
	let res = await request.get(`1212${urls.probe}`, {
		headers: {
			Authorization: `Bearer ${API_KEY}`,
		},
	})
	await expect(res.status()).toBe(404)
})

test('Getting unix time from server without token', async ({ request }) => {
	let res = await request.get(`${urls.probe}`, {
		headers: {
			Authorization: ``,
		},
	})
	let resJson = await res.json()
	await expect(resJson.error).toBe('Bad request')
	await expect(res.status()).toBe(400)
})

test('Getting unix time from server with invalid method', async ({ request }) => {
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