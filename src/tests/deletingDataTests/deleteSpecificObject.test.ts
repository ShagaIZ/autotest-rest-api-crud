import { test, expect, request, APIResponse } from '@playwright/test'
import { urls } from '../../common/urls'
import { dataRequest } from '../../common/data'

let uuid: string

test.beforeEach('Deleting created object', async () => {
	const requestContext = await request.newContext()
	let response: APIResponse = await requestContext.post(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
		},
		data: dataRequest.userOne,
	})
	uuid = await (await response.json()).items[0]._uuid
	await requestContext.dispose()
})

test.afterEach('Creating object', async () => {
	const requestContext = await request.newContext()
	await requestContext.delete(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
		},
		data: `[{"_uuid": "${uuid}"}]`,
	})
	await requestContext.dispose()
})
test.describe('Deleting specific created object', async () => {
	test('Valid url and data, with token -> object created', async () => {
		const requestContext = await request.newContext()
		let response: APIResponse = await requestContext.delete(`${urls.main}user/${uuid}`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		})
		await expect(response).toBeOK()
		await expect(response.status()).toBe(200)
		await expect(await response.json()).toBeTruthy()
		await expect((await response.json())._created).toBeTruthy()
		await expect((await response.json())._data_type).toBeTruthy()
		await expect((await response.json())._is_deleted).toBe(true)
		await expect((await response.json())._modified).toBeTruthy()
		await expect((await response.json())._self_link).toBe(`${urls.base}${urls.main}user/${(await response.json())._uuid}`)
		await expect((await response.json())._user).toBeTruthy()
		await expect((await response.json())._uuid).toBeTruthy()
		await expect((await response.json()).city).toBe(JSON.parse(dataRequest.userOne)[0].city)
		await expect((await response.json()).name).toBe(JSON.parse(dataRequest.userOne)[0].name)
		await expect((await response.json()).age).toBe(25)
		await requestContext.dispose()
	})

	test('Invaild url -> 404 error', async () => {
		const requestContext = await request.newContext()
		let response: APIResponse = await requestContext.delete(`asas${urls.main}user/${uuid}`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		})
		await expect(response.status()).toBe(404)
		await requestContext.dispose()
	})

	test('Invalid uuid -> 400 error', async () => {
		const requestContext = await request.newContext()
		let response: APIResponse = await requestContext.delete(`${urls.main}user/1212121212ggg`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		})
		await expect(response.status()).toBe(400)
		await requestContext.dispose()
	})

	test('Without token -> 400 error', async () => {
		const requestContext = await request.newContext()
		let response: APIResponse = await requestContext.delete(`${urls.main}user/${uuid}`, {
			headers: {
				Authorization: ``,
			},
		})

		await expect((await response.json()).error).toBe('Bad request')
		await expect(response.status()).toBe(400)
		await requestContext.dispose()
	})
})
