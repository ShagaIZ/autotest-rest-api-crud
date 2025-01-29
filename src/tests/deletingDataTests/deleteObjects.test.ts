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
test.describe('Deleting objects', async () => {
	test('Valid url and data, with token -> object deleteds', async () => {
		const requestContextDeleteUserOne = await request.newContext()
		let resDeleteUserOne = await requestContextDeleteUserOne.delete(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: `[{"_uuid": "${uuidUserOne}"}]`,
		})

		const requestContextDeleteUserTwo = await request.newContext()
		let resDeleteUserTwo = await requestContextDeleteUserTwo.delete(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: `[{"_uuid": "${uuidUserTwo}"}]`,
		})

		//First block assertation
		await expect(resDeleteUserOne).toBeOK()
		await expect(resDeleteUserOne.status()).toBe(200)
		await expect((await resDeleteUserOne.json()).items[0]).toBeTruthy()
		await expect((await resDeleteUserOne.json()).items[0]._created).toBeTruthy()
		await expect((await resDeleteUserOne.json()).items[0]._data_type).toBeTruthy()
		await expect((await resDeleteUserOne.json()).items[0]._is_deleted).toBe(true)
		await expect((await resDeleteUserOne.json()).items[0]._modified).toBeTruthy()
		await expect((await resDeleteUserOne.json()).items[0]._self_link).toBe(
			`${urls.base}${urls.main}user/${(await resDeleteUserOne.json()).items[0]._uuid}`
		)
		await expect((await resDeleteUserOne.json()).items[0]._user).toBeTruthy()
		await expect((await resDeleteUserOne.json()).items[0]._uuid).toBeTruthy()
		await expect((await resDeleteUserOne.json()).items[0].city).toBe(JSON.parse(dataRequest.userOne)[0].city)
		await expect((await resDeleteUserOne.json()).items[0].name).toBe(JSON.parse(dataRequest.userOne)[0].name)
		await expect((await resDeleteUserOne.json()).items[0].age).toBe(25)
		//Second block assertation
		await expect(resDeleteUserTwo).toBeOK()
		await expect(resDeleteUserTwo.status()).toBe(200)
		await expect((await resDeleteUserTwo.json()).items[0]).toBeTruthy()
		await expect((await resDeleteUserTwo.json()).items[0]._created).toBeTruthy()
		await expect((await resDeleteUserTwo.json()).items[0]._data_type).toBeTruthy()
		await expect((await resDeleteUserTwo.json()).items[0]._is_deleted).toBe(true)
		await expect((await resDeleteUserTwo.json()).items[0]._modified).toBeTruthy()
		await expect((await resDeleteUserTwo.json()).items[0]._self_link).toBe(
			`${urls.base}${urls.main}user/${(await resDeleteUserTwo.json()).items[0]._uuid}`
		)
		await expect((await resDeleteUserTwo.json()).items[0]._user).toBeTruthy()
		await expect((await resDeleteUserTwo.json()).items[0]._uuid).toBeTruthy()
		await expect((await resDeleteUserTwo.json()).items[0].city).toBe(JSON.parse(dataRequest.userTwo)[0].city)
		await expect((await resDeleteUserTwo.json()).items[0].name).toBe(JSON.parse(dataRequest.userTwo)[0].name)
		await expect((await resDeleteUserTwo.json()).items[0].age).toBe(45)
		await requestContextDeleteUserOne.dispose()
		await requestContextDeleteUserTwo.dispose()
	})

	test('Invaild url -> 404 error', async () => {
		const requestContext = await request.newContext()
		let resDelete = await requestContext.delete(`1212${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: `[{"_uuid": "${uuidUserOne}"}]`,
		})
		await expect(resDelete.status()).toBe(404)
		await requestContext.dispose()
	})

	test('Empty data -> 400 error', async () => {
		const requestContext = await request.newContext()
		let response: APIResponse = await requestContext.delete(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: ``,
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
			data: `[{"_uuid": "${uuidUserTwo}"}]`,
		})
		await expect(response.status()).toBe(400)
		await requestContext.dispose()
	})

	test('Without token -> 400 error', async () => {
		const requestContext = await request.newContext()
		let response: APIResponse = await requestContext.delete(`${urls.main}user`, {
			headers: {
				Authorization: ``,
			},
			data: `[{"_uuid": "${uuidUserOne}"}]`,
		})

		await expect((await response.json()).error).toBe('Bad request')
		await expect(response.status()).toBe(400)
		await requestContext.dispose()
	})
})
