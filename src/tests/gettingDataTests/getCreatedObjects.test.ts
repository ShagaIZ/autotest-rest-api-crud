import { test, expect, request, APIResponse } from '@playwright/test'
import { urls } from '../../common/urls'
import { dataRequest } from '../../common/data'

let uuidUserOne: string
let uuidUserTwo: string

test.beforeEach('Creating object', async () => {
	const requestContextCreateUserOne = await request.newContext()
	let resCreateUserOne = await requestContextCreateUserOne.post(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
		},
		data: dataRequest.userOne,
	})
	uuidUserOne = await (await resCreateUserOne.json()).items[0]._uuid
	await requestContextCreateUserOne.dispose()
	const requestContextCreateUserTwo = await request.newContext()
	let resCreateUserTwo = await requestContextCreateUserTwo.post(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
		},
		data: dataRequest.userTwo,
	})
	uuidUserTwo = await (await resCreateUserTwo.json()).items[0]._uuid
	await requestContextCreateUserTwo.dispose()

	
	
})

test.afterEach('Deleting created object', async () => {
	const requestContextDeleteUserOne = await request.newContext()
	await requestContextDeleteUserOne.delete(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
		},
		data: `[{"_uuid": "${uuidUserOne}"}]`,
	})
	await requestContextDeleteUserOne.dispose()
	const requestContextDeleteUserTwo = await request.newContext()
	await requestContextDeleteUserTwo.delete(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
		},
		data: `[{"_uuid": "${uuidUserTwo}"}]`,
	})
	await requestContextDeleteUserTwo.dispose()
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
		await expect((await response.json()).items[1].city).toBe('Moscow')
		await expect((await response.json()).items[1].name).toBe('Ivan')
		await expect((await response.json()).items[1].age).toBe(25)
		await expect((await response.json()).items[0]).toBeTruthy()
		await expect((await response.json()).items[0]._created).toBeTruthy()
		await expect((await response.json()).items[0]._data_type).toBeTruthy()
		await expect((await response.json()).items[0]._is_deleted).toBe(false)
		await expect((await response.json()).items[0]._modified).toBeTruthy()
		await expect((await response.json()).items[0]._self_link).toBe(`${urls.base}${urls.main}user/${(await response.json()).items[0]._uuid}`)
		await expect((await response.json()).items[0]._user).toBeTruthy()
		await expect((await response.json()).items[0]._uuid).toBeTruthy()
		await expect((await response.json()).items[0].city).toBe('Chicago')
		await expect((await response.json()).items[0].name).toBe('Dan')
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
