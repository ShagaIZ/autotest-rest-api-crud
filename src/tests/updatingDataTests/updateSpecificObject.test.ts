import { test, expect, request, APIResponse } from '@playwright/test'
import { urls } from '../../common/urls'
import { dataRequest } from '../../common/data'

let uuidUser: string
test.beforeEach('Creating object', async () => {
	const requestContext = await request.newContext()
	let response: APIResponse = await requestContext.post(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
		},
		data: dataRequest.userOne,
	})
	uuidUser = await (await response.json()).items[0]._uuid
	await requestContext.dispose()
})
test.afterEach('Deleting created object', async () => {
	const requestContext = await request.newContext()
	await requestContext.delete(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
		},
		data: `[{"_uuid": "${uuidUser}"}]`,
	})
	await requestContext.dispose()
})
test.describe('Updating specific created object', async () => {
	test('Valid url and data, with token -> updating specific created object', async () => {
		const requestContext = await request.newContext()
		let response: APIResponse = await requestContext.put(`${urls.main}user/${uuidUser}`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: dataRequest.userThree,
		})
		await expect(response).toBeOK()
		await expect(response.status()).toBe(200)
		await expect((await response.json())).toBeTruthy()
		await expect((await response.json())._created).toBeTruthy()
		await expect((await response.json())._data_type).toBeTruthy()
		await expect((await response.json())._is_deleted).toBe(false)
		await expect((await response.json())._modified).toBeTruthy()
		await expect((await response.json())._self_link).toBe(`${urls.base}${urls.main}user/${(await response.json())._uuid}`)
		await expect((await response.json())._user).toBeTruthy()
		await expect((await response.json())._uuid).toBeTruthy()
		await expect((await response.json()).city).toBe('Ufa')
		await expect((await response.json()).name).toBe('Geran')
		await expect((await response.json()).age).toBe(20)
		await requestContext.dispose()
	})

	test('Invalid url -> 404 error', async () => {
		const requestContext = await request.newContext()
		let response: APIResponse = await requestContext.put(`!@!@${urls.main}user/${uuidUser}`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: dataRequest.userThree,
		})
		await expect(response.status()).toBe(404)
		await requestContext.dispose()
	})

	test('Invalid method -> 405 error', async () => {
		const requestContext = await request.newContext()
		let response: APIResponse = await requestContext.post(`${urls.main}user/${uuidUser}`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: dataRequest.userThree,
		})
		await expect(response.status()).toBe(405)
		await requestContext.dispose()
	})

	test('Invalid uuid -> 405 error', async () => {
		const requestContext = await request.newContext()
		let response: APIResponse = await requestContext.post(`${urls.main}user/${uuidUser}888`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: dataRequest.userThree,
		})
		await expect(response.status()).toBe(405)
		await requestContext.dispose()
	})

	test('Without token -> 400 error', async () => {
		const requestContext = await request.newContext()
		let response: APIResponse = await requestContext.put(`${urls.main}user/${uuidUser}`, {
			headers: {
				Authorization: ``,
			},
			data: dataRequest.userThree,
		})
		await expect((await response.json()).error).toBe('Bad request')
		await expect(response.status()).toBe(400)
		await requestContext.dispose()
	})
})
