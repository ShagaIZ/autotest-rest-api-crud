import { test, expect } from '@playwright/test'
import { urls } from '../../common/urls'
import { dataRequest } from '../../common/data'

let uuid: string

test.beforeEach('Deleting created object', async ({ request }) => {
	let res = await request.post(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
		},
		data: dataRequest.userOne,
	})
	let resJson = await res.json()
	uuid = await resJson.items[0]._uuid
})

test.afterEach('Creating object', async ({ request }) => {
	await request.delete(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
		},
		data: `[{"_uuid": "${uuid}"}]`,
	})
})
test.describe('Deleting specific created object', async () => {
	test('Valid url and data, with token -> object created', async ({ request }) => {
		let resDelete = await request.delete(`${urls.main}user/${uuid}`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		})
		let resDeleteJson = await resDelete.json()
		await expect(resDelete).toBeOK()
		await expect(resDelete.status()).toBe(200)
		await expect(resDeleteJson).toBeTruthy()
		await expect(resDeleteJson._created).toBeTruthy()
		await expect(resDeleteJson._data_type).toBeTruthy()
		await expect(resDeleteJson._is_deleted).toBe(true)
		await expect(resDeleteJson._modified).toBeTruthy()
		await expect(resDeleteJson._self_link).toBe(`${urls.base}${urls.main}user/${resDeleteJson._uuid}`)
		await expect(resDeleteJson._user).toBeTruthy()
		await expect(resDeleteJson._uuid).toBeTruthy()
		await expect(resDeleteJson.city).toBe('Moscow')
		await expect(resDeleteJson.name).toBe('Ivan')
		await expect(resDeleteJson.age).toBe(25)
	})

	test('Invaild url -> 404 error', async ({ request }) => {
		let resDelete = await request.delete(`asas${urls.main}user/${uuid}`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		})
		await expect(resDelete.status()).toBe(404)
	})

	test('Invalid uuid -> 400 error', async ({ request }) => {
		let resDelete = await request.delete(`${urls.main}user/1212121212ggg`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		})
		await expect(resDelete.status()).toBe(400)
	})

	test('Without token -> 400 error', async ({ request }) => {
		let resDelete = await request.delete(`${urls.main}user/${uuid}`, {
			headers: {
				Authorization: ``,
			},
		})
		let resJson = await resDelete.json()
		await expect(resJson.error).toBe('Bad request')
		await expect(resDelete.status()).toBe(400)
	})
})
