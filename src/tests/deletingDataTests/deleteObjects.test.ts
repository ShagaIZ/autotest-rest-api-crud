import { test, expect, request } from '@playwright/test'
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
	let resjsonCreateUserOne = await resCreateUserOne.json()
	await requestContextCreateUserOne.dispose()
	const requestContextCreateUserTwo = await request.newContext()
	let resCreateUserTwo = await requestContextCreateUserTwo.post(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
		},
		data: dataRequest.userTwo,
	})
	let resjsonCreateUserTwo = await resCreateUserTwo.json()
	await requestContextCreateUserTwo.dispose()

	uuidUserOne = await resjsonCreateUserOne.items[0]._uuid
	uuidUserTwo = await resjsonCreateUserTwo.items[0]._uuid
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
		let resDeleteUserOneJson = await resDeleteUserOne.json()
		await requestContextDeleteUserOne.dispose()
		const requestContextDeleteUserTwo = await request.newContext()
		let resDeleteUserTwo = await requestContextDeleteUserTwo.delete(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: `[{"_uuid": "${uuidUserTwo}"}]`,
		})
		let resDeleteUserTwoJson = await resDeleteUserTwo.json()
		await requestContextDeleteUserTwo.dispose()

		//First block assertation
		await expect(resDeleteUserOne).toBeOK()
		await expect(resDeleteUserOne.status()).toBe(200)
		await expect(resDeleteUserOneJson.items[0]).toBeTruthy()
		await expect(resDeleteUserOneJson.items[0]._created).toBeTruthy()
		await expect(resDeleteUserOneJson.items[0]._data_type).toBeTruthy()
		await expect(resDeleteUserOneJson.items[0]._is_deleted).toBe(true)
		await expect(resDeleteUserOneJson.items[0]._modified).toBeTruthy()
		await expect(resDeleteUserOneJson.items[0]._self_link).toBe(`${urls.base}${urls.main}user/${resDeleteUserOneJson.items[0]._uuid}`)
		await expect(resDeleteUserOneJson.items[0]._user).toBeTruthy()
		await expect(resDeleteUserOneJson.items[0]._uuid).toBeTruthy()
		await expect(resDeleteUserOneJson.items[0].city).toBe('Moscow')
		await expect(resDeleteUserOneJson.items[0].name).toBe('Ivan')
		await expect(resDeleteUserOneJson.items[0].age).toBe(25)
		//Second block assertation
		await expect(resDeleteUserTwo).toBeOK()
		await expect(resDeleteUserTwo.status()).toBe(200)
		await expect(resDeleteUserTwoJson.items[0]).toBeTruthy()
		await expect(resDeleteUserTwoJson.items[0]._created).toBeTruthy()
		await expect(resDeleteUserTwoJson.items[0]._data_type).toBeTruthy()
		await expect(resDeleteUserTwoJson.items[0]._is_deleted).toBe(true)
		await expect(resDeleteUserTwoJson.items[0]._modified).toBeTruthy()
		await expect(resDeleteUserTwoJson.items[0]._self_link).toBe(`${urls.base}${urls.main}user/${resDeleteUserTwoJson.items[0]._uuid}`)
		await expect(resDeleteUserTwoJson.items[0]._user).toBeTruthy()
		await expect(resDeleteUserTwoJson.items[0]._uuid).toBeTruthy()
		await expect(resDeleteUserTwoJson.items[0].city).toBe('Chicago')
		await expect(resDeleteUserTwoJson.items[0].name).toBe('Dan')
		await expect(resDeleteUserTwoJson.items[0].age).toBe(45)
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
		let resDelete = await requestContext.delete(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: ``,
		})
		let resJson = await resDelete.json()
		await expect(resJson.error).toBe('Bad request')
		await expect(resDelete.status()).toBe(400)
		await requestContext.dispose()
	})

	test('Invalid method -> 400 error', async () => {
		const requestContext = await request.newContext()
		let resDelete = await requestContext.get(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: `[{"_uuid": "${uuidUserTwo}"}]`,
		})
		await expect(resDelete.status()).toBe(400)
		await requestContext.dispose()
	})

	test('Without token -> 400 error', async () => {
		const requestContext = await request.newContext()
		let resDelete = await requestContext.delete(`${urls.main}user`, {
			headers: {
				Authorization: ``,
			},
			data: `[{"_uuid": "${uuidUserOne}"}]`,
		})
		let resJson = await resDelete.json()
		await expect(resJson.error).toBe('Bad request')
		await expect(resDelete.status()).toBe(400)
		await requestContext.dispose()
	})
})
