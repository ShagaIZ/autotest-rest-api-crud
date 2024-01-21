import { test, expect } from '@playwright/test'
import { API_KEY } from '../../api_key'
import { urls } from '../common/urls'
import { dataRequest } from '../common/data'

let uuidUserTwo: string

test.beforeEach('Deleting created object', async ({ request }) => {
	let res = await request.post(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${API_KEY}`,
		},
		data: dataRequest.userTwo,
	})
	let resJson = await res.json()
	uuidUserTwo = await resJson.items[0]._uuid
})

test.afterEach('Deleting created object', async ({ request }) => {
	await request.delete(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${API_KEY}`,
		},
		data: `[{"_uuid": "${uuidUserTwo}"}]`,
	})
})
test.describe('Geting data of specific created object', async () => {
	test('Valid url, with token -> get specific object data', async ({ request }) => {
		let resGetObject = await request.get(`${urls.main}user/${uuidUserTwo}`, {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
			},
		})
		let resGetObjectJson = await resGetObject.json()
		await expect(resGetObject).toBeOK()
		await expect(resGetObject.status()).toBe(200)
		await expect(resGetObjectJson).toBeTruthy()
		await expect(resGetObjectJson._created).toBeTruthy()
		await expect(resGetObjectJson._data_type).toBeTruthy()
		await expect(resGetObjectJson._is_deleted).toBe(false)
		await expect(resGetObjectJson._modified).toBeTruthy()
		await expect(resGetObjectJson._self_link).toBe(`${urls.base}${urls.main}user/${resGetObjectJson._uuid}`)
		await expect(resGetObjectJson._user).toBeTruthy()
		await expect(resGetObjectJson._uuid).toBeTruthy()
		await expect(resGetObjectJson.city).toBe('Chicago')
		await expect(resGetObjectJson.name).toBe('Dan')
		await expect(resGetObjectJson.age).toBe(45)
	})

	test('Invaild url -> 400 error', async ({ request }) => {
		let resGetObject = await request.get(`%$%$%${urls.main}user/${uuidUserTwo}`, {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
			},
		})
		await expect(resGetObject.status()).toBe(400)
	})

	test('Invalid method -> 405 error', async ({ request }) => {
		let resGetObject = await request.post(`${urls.main}user/${uuidUserTwo}`, {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
			},
		})
		await expect(resGetObject.status()).toBe(405)
	})

	test('Without token -> 400 error', async ({ request }) => {
		let resGetObject = await request.get(`${urls.main}user/${uuidUserTwo}`, {
			headers: {
				Authorization: ``,
			},
		})
		let resGetObjectJson = await resGetObject.json()
		await expect(resGetObjectJson.error).toBe('Bad request')
		await expect(resGetObject.status()).toBe(400)
	})

	test('Invalid uuid -> 405 error', async ({ request }) => {
		let resGetObject = await request.post(`${urls.main}user/&^&^&^&`, {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
			},
		})
		await expect(resGetObject.status()).toBe(405)
	})
})
