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
test.describe('Geting data of created objects', async () => {
	test('Valid url, with token -> get objects data', async () => {
		const requestContext = await request.newContext()
		let res = await requestContext.get(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		})
		let resJson = await res.json()
		await expect(res).toBeOK()
		await expect(res.status()).toBe(200)
		await expect(resJson.items[1]).toBeTruthy()
		await expect(resJson.items[1]._created).toBeTruthy()
		await expect(resJson.items[1]._data_type).toBeTruthy()
		await expect(resJson.items[1]._is_deleted).toBe(false)
		await expect(resJson.items[1]._modified).toBeTruthy()
		await expect(resJson.items[1]._self_link).toBe(`${urls.base}${urls.main}user/${resJson.items[1]._uuid}`)
		await expect(resJson.items[1]._user).toBeTruthy()
		await expect(resJson.items[1]._uuid).toBeTruthy()
		await expect(resJson.items[1].city).toBe('Moscow')
		await expect(resJson.items[1].name).toBe('Ivan')
		await expect(resJson.items[1].age).toBe(25)
		await expect(resJson.items[0]).toBeTruthy()
		await expect(resJson.items[0]._created).toBeTruthy()
		await expect(resJson.items[0]._data_type).toBeTruthy()
		await expect(resJson.items[0]._is_deleted).toBe(false)
		await expect(resJson.items[0]._modified).toBeTruthy()
		await expect(resJson.items[0]._self_link).toBe(`${urls.base}${urls.main}user/${resJson.items[0]._uuid}`)
		await expect(resJson.items[0]._user).toBeTruthy()
		await expect(resJson.items[0]._uuid).toBeTruthy()
		await expect(resJson.items[0].city).toBe('Chicago')
		await expect(resJson.items[0].name).toBe('Dan')
		await expect(resJson.items[0].age).toBe(45)
		await requestContext.dispose()
	})

	test('Invaild url -> 400 error', async () => {
		const requestContext = await request.newContext()
		let res = await requestContext.get(`%%%^${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		})
		await expect(res.status()).toBe(400)
		await requestContext.dispose()
	})

	test('Invaild method -> 400 error', async () => {
		const requestContext = await request.newContext()
		let res = await requestContext.post(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		})
		let resJson = await res.json()
		await expect(resJson.error).toBe('Bad request')
		await expect(res.status()).toBe(400)
		await requestContext.dispose()
	})

	test('Without token -> 400 error', async () => {
		const requestContext = await request.newContext()
		let res = await requestContext.get(`${urls.main}user`, {
			headers: {
				Authorization: ``,
			},
		})
		let resJson = await res.json()
		await expect(resJson.error).toBe('Bad request')
		await expect(res.status()).toBe(400)
		await requestContext.dispose()
	})
})
