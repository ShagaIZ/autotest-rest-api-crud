import { test, expect, request, APIResponse } from '@playwright/test'
import { urls } from '../../common/urls'
import { dataRequest, getNewUser } from '../../common/data'

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
		await expect((await resUpdatetUserOne.json()).items[0].city).toBe('London')
		await expect((await resUpdatetUserOne.json()).items[0].name).toBe('Roman')
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
		await expect((await resUpdatetUserTwo.json()).items[0].city).toBe('London')
		await expect((await resUpdatetUserTwo.json()).items[0].name).toBe('Roman')
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
