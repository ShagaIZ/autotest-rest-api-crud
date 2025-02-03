import { test, expect, request, APIResponse } from '@playwright/test'
import { urls } from '../../common/urls'
import { dataRequest } from '../../common/data'
import { createApiBase } from '../../common/apiBase'
let uuid: string

test.afterEach('Deleting created object', async () => {
	await (await createApiBase()).deleteObject(uuid)
})

test.describe('Creating object', async () => {
	test('Valid url and data, with token -> object created', async () => {
		const requestContext = await request.newContext()
		let response: APIResponse = await requestContext.post(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: dataRequest.userOne,
		})
		uuid = await (await response.json()).items[0]._uuid
		await expect(response).toBeOK()
		await expect(response.status()).toBe(201)
		await expect((await response.json()).items[0]).toBeTruthy()
		await expect((await response.json()).items[0]._created).toBeTruthy()
		await expect((await response.json()).items[0]._data_type).toBeTruthy()
		await expect((await response.json()).items[0]._is_deleted).toBe(false)
		await expect((await response.json()).items[0]._modified).toBeTruthy()
		await expect((await response.json()).items[0]._self_link).toBe(`${urls.base}${urls.main}user/${(await response.json()).items[0]._uuid}`)
		await expect((await response.json()).items[0]._user).toBeTruthy()
		await expect((await response.json()).items[0]._uuid).toBeTruthy()
		await expect((await response.json()).items[0].city).toBe(JSON.parse(dataRequest.userOne)[0].city)
		await expect((await response.json()).items[0].name).toBe(JSON.parse(dataRequest.userOne)[0].name)
		await expect((await response.json()).items[0].age).toBe(25)
		await requestContext.dispose()
	})

	test('Invaild url -> 405 error', async () => {
		const requestContext = await request.newContext()
		let response: APIResponse = await requestContext.post(`#@#${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: dataRequest.userOne,
		})
		await expect(response.status()).toBe(405)
		await requestContext.dispose()
	})

	test('Empty data -> 400 error', async () => {
		const requestContext = await request.newContext()
		let response: APIResponse = await requestContext.post(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: '',
		})

		await expect((await response.json()).error).toBe('Bad request')
		await expect(response.status()).toBe(400)
		await requestContext.dispose()
	})

	test('Invalid method -> 400 error ', async () => {
		const requestContext = await request.newContext()
		let response: APIResponse = await requestContext.get(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: dataRequest.userOne,
		})
		await expect(response.status()).toBe(400)
		await requestContext.dispose()
	})

	test('Without token -> 400 error ', async () => {
		const requestContext = await request.newContext()
		let response: APIResponse = await requestContext.post(`${urls.main}user`, {
			headers: {
				Authorization: ``,
			},
			data: dataRequest.userOne,
		})

		await expect((await response.json()).error).toBe('Bad request')
		await expect(response.status()).toBe(400)
		await requestContext.dispose()
	})
})
