import { test, expect } from '@playwright/test'
// import { API_KEY } from '../../../api_key'
import { urls } from '../../common/urls'
import { dataRequest } from '../../common/data'

let uuid: string

test.afterEach('Deleting created object', async ({ request }) => {
	await request.delete(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
		},
		data: `[{"_uuid": "${uuid}"}]`,
	})
})

test.describe('Creating object', async () => {
	test('Valid url and data, with token -> object created', async ({ request }) => {
		let res = await request.post(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: dataRequest.userOne,
		})
		let resJson = await res.json()
		uuid = await resJson.items[0]._uuid
		await expect(res).toBeOK()
		await expect(res.status()).toBe(201)
		await expect(resJson.items[0]).toBeTruthy()
		await expect(resJson.items[0]._created).toBeTruthy()
		await expect(resJson.items[0]._data_type).toBeTruthy()
		await expect(resJson.items[0]._is_deleted).toBe(false)
		await expect(resJson.items[0]._modified).toBeTruthy()
		await expect(resJson.items[0]._self_link).toBe(`${urls.base}${urls.main}user/${resJson.items[0]._uuid}`)
		await expect(resJson.items[0]._user).toBeTruthy()
		await expect(resJson.items[0]._uuid).toBeTruthy()
		await expect(resJson.items[0].city).toBe('Moscow')
		await expect(resJson.items[0].name).toBe('Ivan')
		await expect(resJson.items[0].age).toBe(25)
	})

	test('Invaild url -> 405 error', async ({ request }) => {
		let res = await request.post(`#@#${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: dataRequest.userOne,
		})
		await expect(res.status()).toBe(405)
	})

	test('Empty data -> 400 error', async ({ request }) => {
		let res = await request.post(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: '',
		})
		let resJson = await res.json()
		await expect(resJson.error).toBe('Bad request')
		await expect(res.status()).toBe(400)
	})

	test('Invalid method -> 400 error ', async ({ request }) => {
		let res = await request.get(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: dataRequest.userOne,
		})
		await expect(res.status()).toBe(400)
	})

	test('Without token -> 400 error ', async ({ request }) => {
		let res = await request.post(`${urls.main}user`, {
			headers: {
				Authorization: ``,
			},
			data: dataRequest.userOne,
		})
		let resJson = await res.json()
		await expect(resJson.error).toBe('Bad request')
		await expect(res.status()).toBe(400)
	})
})
