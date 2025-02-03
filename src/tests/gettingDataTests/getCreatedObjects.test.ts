import { test, expect, request, APIResponse } from '@playwright/test'
import { urls } from '../../common/urls'
import { dataRequest } from '../../common/data'
import { createApiBase } from '../../common/apiBase'

let uuidUserOne: string
let uuidUserTwo: string

test.beforeEach('Creating object', async () => {
	uuidUserOne = await (await createApiBase()).createObject(dataRequest.userOne)
	uuidUserTwo = await (await createApiBase()).createObject(dataRequest.userTwo)
})

test.afterEach('Deleting created object', async () => {
	await (await createApiBase()).deleteObject(uuidUserOne)
	await (await createApiBase()).deleteObject(uuidUserTwo)
})
test.describe('Geting data of created objects', async () => {
	test('Valid url, with token -> get objects data', async () => {
		const requestContext = await request.newContext()
		let response: APIResponse = await requestContext.get(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		})
		await expect(response).toBeOK()
		await expect(response.status()).toBe(200)
		await expect((await response.json()).items[1]).toBeTruthy()
		await expect((await response.json()).items[1]._created).toBeTruthy()
		await expect((await response.json()).items[1]._data_type).toBeTruthy()
		await expect((await response.json()).items[1]._is_deleted).toBe(false)
		await expect((await response.json()).items[1]._modified).toBeTruthy()
		await expect((await response.json()).items[1]._self_link).toBe(`${urls.base}${urls.main}user/${(await response.json()).items[1]._uuid}`)
		await expect((await response.json()).items[1]._user).toBeTruthy()
		await expect((await response.json()).items[1]._uuid).toBeTruthy()
		await expect((await response.json()).items[1].city).toBe(JSON.parse(dataRequest.userOne)[0].city)
		await expect((await response.json()).items[1].name).toBe(JSON.parse(dataRequest.userOne)[0].name)
		await expect((await response.json()).items[1].age).toBe(25)
		await expect((await response.json()).items[0]).toBeTruthy()
		await expect((await response.json()).items[0]._created).toBeTruthy()
		await expect((await response.json()).items[0]._data_type).toBeTruthy()
		await expect((await response.json()).items[0]._is_deleted).toBe(false)
		await expect((await response.json()).items[0]._modified).toBeTruthy()
		await expect((await response.json()).items[0]._self_link).toBe(`${urls.base}${urls.main}user/${(await response.json()).items[0]._uuid}`)
		await expect((await response.json()).items[0]._user).toBeTruthy()
		await expect((await response.json()).items[0]._uuid).toBeTruthy()
		await expect((await response.json()).items[0].city).toBe(JSON.parse(dataRequest.userTwo)[0].city)
		await expect((await response.json()).items[0].name).toBe(JSON.parse(dataRequest.userTwo)[0].name)
		await expect((await response.json()).items[0].age).toBe(45)
		await requestContext.dispose()
	})

	test('Invaild url -> 400 error', async () => {
		const requestContext = await request.newContext()
		let response: APIResponse = await requestContext.get(`%%%^${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		})
		await expect(response.status()).toBe(400)
		await requestContext.dispose()
	})

	test('Invaild method -> 400 error', async () => {
		const requestContext = await request.newContext()
		let response: APIResponse = await requestContext.post(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		})
		await expect((await response.json()).error).toBe('Bad request')
		await expect(response.status()).toBe(400)
		await requestContext.dispose()
	})

	test('Without token -> 400 error', async () => {
		const requestContext = await request.newContext()
		let response: APIResponse = await requestContext.get(`${urls.main}user`, {
			headers: {
				Authorization: ``,
			},
		})
		await expect((await response.json()).error).toBe('Bad request')
		await expect(response.status()).toBe(400)
		await requestContext.dispose()
	})
})
