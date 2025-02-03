import { test, expect, request, APIResponse } from '@playwright/test'
import { urls } from '../../common/urls'
import { dataRequest, getNewUser } from '../../common/data'
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
test.describe('Updating created objects', async () => {
	test('Valid url and data, with token -> objects updated', async () => {
		const requestContextUpdatetUserOne = await request.newContext()
		let resUpdatetUserOne = await requestContextUpdatetUserOne.put(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: getNewUser(uuidUserOne),
		})

		const requestContextUpdatetUserTwo = await request.newContext()
		let resUpdatetUserTwo = await requestContextUpdatetUserTwo.put(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: getNewUser(uuidUserTwo),
		})
		//First block assertation
		await expect(resUpdatetUserOne).toBeOK()
		await expect(resUpdatetUserOne.status()).toBe(200)
		await expect((await resUpdatetUserOne.json()).items[0]).toBeTruthy()
		await expect((await resUpdatetUserOne.json()).items[0]._created).toBeTruthy()
		await expect((await resUpdatetUserOne.json()).items[0]._data_type).toBeTruthy()
		await expect((await resUpdatetUserOne.json()).items[0]._is_deleted).toBe(false)
		await expect((await resUpdatetUserOne.json()).items[0]._modified).toBeTruthy()
		await expect((await resUpdatetUserOne.json()).items[0]._self_link).toBe(
			`${urls.base}${urls.main}user/${(await resUpdatetUserOne.json()).items[0]._uuid}`
		)
		await expect((await resUpdatetUserOne.json()).items[0]._user).toBeTruthy()
		await expect((await resUpdatetUserOne.json()).items[0]._uuid).toBeTruthy()
		await expect((await resUpdatetUserOne.json()).items[0].city).toBe(JSON.parse(getNewUser(uuidUserOne))[0].city)
		await expect((await resUpdatetUserOne.json()).items[0].name).toBe(JSON.parse(getNewUser(uuidUserOne))[0].name)
		await expect((await resUpdatetUserOne.json()).items[0].age).toBe(35)
		//Second block assertation
		await expect(resUpdatetUserTwo).toBeOK()
		await expect(resUpdatetUserTwo.status()).toBe(200)
		await expect((await resUpdatetUserTwo.json()).items[0]).toBeTruthy()
		await expect((await resUpdatetUserTwo.json()).items[0]._created).toBeTruthy()
		await expect((await resUpdatetUserTwo.json()).items[0]._data_type).toBeTruthy()
		await expect((await resUpdatetUserTwo.json()).items[0]._is_deleted).toBe(false)
		await expect((await resUpdatetUserTwo.json()).items[0]._modified).toBeTruthy()
		await expect((await resUpdatetUserTwo.json()).items[0]._self_link).toBe(
			`${urls.base}${urls.main}user/${(await resUpdatetUserTwo.json()).items[0]._uuid}`
		)
		await expect((await resUpdatetUserTwo.json()).items[0]._user).toBeTruthy()
		await expect((await resUpdatetUserTwo.json()).items[0]._uuid).toBeTruthy()
		await expect((await resUpdatetUserTwo.json()).items[0].city).toBe(JSON.parse(getNewUser(uuidUserTwo))[0].city)
		await expect((await resUpdatetUserTwo.json()).items[0].name).toBe(JSON.parse(getNewUser(uuidUserOne))[0].name)
		await expect((await resUpdatetUserTwo.json()).items[0].age).toBe(35)
		await requestContextUpdatetUserOne.dispose()
		await requestContextUpdatetUserTwo.dispose()
	})

	test('Invalid url -> 404 error', async () => {
		const requestContext = await request.newContext()
		let response: APIResponse = await requestContext.put(`$$#$#${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: getNewUser(uuidUserOne),
		})

		await expect(response.status()).toBe(404)
		await requestContext.dispose()
	})

	test('Empty data -> 400 error', async () => {
		const requestContext = await request.newContext()
		let response: APIResponse = await requestContext.put(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: '',
		})
		await expect((await response.json()).error).toBe('Bad request')
		await expect(response.status()).toBe(400)
		await requestContext.dispose()
	})

	test('Without token -> 400 error', async () => {
		const requestContext = await request.newContext()
		let response: APIResponse = await requestContext.put(`${urls.main}user`, {
			headers: {
				Authorization: ``,
			},
			data: getNewUser(uuidUserOne),
		})
		await expect((await response.json()).error).toBe('Bad request')
		await expect(response.status()).toBe(400)
		await requestContext.dispose()
	})

	test('Invalid method -> 400 error', async () => {
		const requestContext = await request.newContext()
		let response: APIResponse = await requestContext.get(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: getNewUser(uuidUserOne),
		})
		await expect(response.status()).toBe(400)
		await requestContext.dispose()
	})
})
