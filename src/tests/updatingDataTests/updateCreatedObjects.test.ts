import { test, expect } from '@playwright/test'
import { API_KEY } from '../../../api_key'
import { urls } from '../../common/urls'
import { dataRequest, getNewUser } from '../../common/data'

let uuidUserOne: string
let uuidUserTwo: string

test.beforeEach('Creating objects', async ({ request }) => {
	let resCreateUserOne = await request.post(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${API_KEY}`,
		},
		data: dataRequest.userOne,
	})
	let resCreateUserTwo = await request.post(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${API_KEY}`,
		},
		data: dataRequest.userTwo,
	})

	let resjsonCreateUserOne = await resCreateUserOne.json()
	let resjsonCreateUserTwo = await resCreateUserTwo.json()
	uuidUserOne = await resjsonCreateUserOne.items[0]._uuid
	uuidUserTwo = await resjsonCreateUserTwo.items[0]._uuid
})

test.afterEach('Deleting created objects', async ({ request }) => {
	await request.delete(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${API_KEY}`,
		},
		data: `[{"_uuid": "${uuidUserOne}"}]`,
	})

	await request.delete(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${API_KEY}`,
		},
		data: `[{"_uuid": "${uuidUserTwo}"}]`,
	})
})
test.describe('Updating created objects', async () => {
	test('Valid url and data, with token -> objects updated', async ({ request }) => {
		let resUpdatetUserOne = await request.put(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
			},
			data: getNewUser(uuidUserOne),
		})
		let resUpdatetUserTwo = await request.put(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
			},
			data: getNewUser(uuidUserTwo),
		})
		let resUpdatetUserOneJson = await resUpdatetUserOne.json()
		let resUpdatetUserTwoJson = await resUpdatetUserTwo.json()
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

	test('Invalid url -> 404 error', async ({ request }) => {
		let resUpdatetUserOne = await request.put(`$$#$#${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
			},
			data: getNewUser(uuidUserOne),
		})

		await expect(resUpdatetUserOne.status()).toBe(404)
	})

	test('Empty data -> 400 error', async ({ request }) => {
		let resUpdatetUserOne = await request.put(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
			},
			data: '',
		})
		let resUpdatetUserOneJson = await resUpdatetUserOne.json()
		await expect(resUpdatetUserOneJson.error).toBe('Bad request')
		await expect(resUpdatetUserOne.status()).toBe(400)
	})

	test('Without token -> 400 error', async ({ request }) => {
		let resUpdatetUserOne = await request.put(`${urls.main}user`, {
			headers: {
				Authorization: ``,
			},
			data: getNewUser(uuidUserOne),
		})
		let resUpdatetUserOneJson = await resUpdatetUserOne.json()
		await expect(resUpdatetUserOneJson.error).toBe('Bad request')
		await expect(resUpdatetUserOne.status()).toBe(400)
	})

	test('Invalid method -> 400 error', async ({ request }) => {
		let resUpdatetUserOne = await request.get(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
			},
			data: getNewUser(uuidUserOne),
		})
		await expect(resUpdatetUserOne.status()).toBe(400)
	})
})
