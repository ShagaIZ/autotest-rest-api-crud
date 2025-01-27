import { test, expect, request } from '@playwright/test'
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
test.describe('Updating created objects', async () => {
	test('Valid url and data, with token -> objects updated', async () => {
		const requestContextUpdatetUserOne = await request.newContext()
		let resUpdatetUserOne = await requestContextUpdatetUserOne.put(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: getNewUser(uuidUserOne),
		})
		let resUpdatetUserOneJson = await resUpdatetUserOne.json()
		await requestContextUpdatetUserOne.dispose()
		const requestContextUpdatetUserTwo = await request.newContext()
		let resUpdatetUserTwo = await requestContextUpdatetUserTwo.put(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: getNewUser(uuidUserTwo),
		})
		let resUpdatetUserTwoJson = await resUpdatetUserTwo.json()
		await requestContextUpdatetUserTwo.dispose()

		//First block assertation
		await expect(resUpdatetUserOne).toBeOK()
		await expect(resUpdatetUserOne.status()).toBe(200)
		await expect(resUpdatetUserOneJson.items[0]).toBeTruthy()
		await expect(resUpdatetUserOneJson.items[0]._created).toBeTruthy()
		await expect(resUpdatetUserOneJson.items[0]._data_type).toBeTruthy()
		await expect(resUpdatetUserOneJson.items[0]._is_deleted).toBe(false)
		await expect(resUpdatetUserOneJson.items[0]._modified).toBeTruthy()
		await expect(resUpdatetUserOneJson.items[0]._self_link).toBe(`${urls.base}${urls.main}user/${resUpdatetUserOneJson.items[0]._uuid}`)
		await expect(resUpdatetUserOneJson.items[0]._user).toBeTruthy()
		await expect(resUpdatetUserOneJson.items[0]._uuid).toBeTruthy()
		await expect(resUpdatetUserOneJson.items[0].city).toBe('London')
		await expect(resUpdatetUserOneJson.items[0].name).toBe('Roman')
		await expect(resUpdatetUserOneJson.items[0].age).toBe(35)
		//Second block assertation
		await expect(resUpdatetUserTwo).toBeOK()
		await expect(resUpdatetUserTwo.status()).toBe(200)
		await expect(resUpdatetUserTwoJson.items[0]).toBeTruthy()
		await expect(resUpdatetUserTwoJson.items[0]._created).toBeTruthy()
		await expect(resUpdatetUserTwoJson.items[0]._data_type).toBeTruthy()
		await expect(resUpdatetUserTwoJson.items[0]._is_deleted).toBe(false)
		await expect(resUpdatetUserTwoJson.items[0]._modified).toBeTruthy()
		await expect(resUpdatetUserTwoJson.items[0]._self_link).toBe(`${urls.base}${urls.main}user/${resUpdatetUserTwoJson.items[0]._uuid}`)
		await expect(resUpdatetUserTwoJson.items[0]._user).toBeTruthy()
		await expect(resUpdatetUserTwoJson.items[0]._uuid).toBeTruthy()
		await expect(resUpdatetUserTwoJson.items[0].city).toBe('London')
		await expect(resUpdatetUserTwoJson.items[0].name).toBe('Roman')
		await expect(resUpdatetUserTwoJson.items[0].age).toBe(35)
	})

	test('Invalid url -> 404 error', async () => {
		const requestContext = await request.newContext()
		let resUpdatetUserOne = await requestContext.put(`$$#$#${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: getNewUser(uuidUserOne),
		})

		await expect(resUpdatetUserOne.status()).toBe(404)
		await requestContext.dispose()
	})

	test('Empty data -> 400 error', async () => {
		const requestContext = await request.newContext()
		let resUpdatetUserOne = await requestContext.put(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: '',
		})
		let resUpdatetUserOneJson = await resUpdatetUserOne.json()
		await expect(resUpdatetUserOneJson.error).toBe('Bad request')
		await expect(resUpdatetUserOne.status()).toBe(400)
		await requestContext.dispose()
	})

	test('Without token -> 400 error', async () => {
		const requestContext = await request.newContext()
		let resUpdatetUserOne = await requestContext.put(`${urls.main}user`, {
			headers: {
				Authorization: ``,
			},
			data: getNewUser(uuidUserOne),
		})
		let resUpdatetUserOneJson = await resUpdatetUserOne.json()
		await expect(resUpdatetUserOneJson.error).toBe('Bad request')
		await expect(resUpdatetUserOne.status()).toBe(400)
		await requestContext.dispose()
	})

	test('Invalid method -> 400 error', async () => {
		const requestContext = await request.newContext()
		let resUpdatetUserOne = await requestContext.get(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: getNewUser(uuidUserOne),
		})
		await expect(resUpdatetUserOne.status()).toBe(400)
		await requestContext.dispose()
	})
})
