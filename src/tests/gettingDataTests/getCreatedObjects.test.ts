import { test, expect } from '@playwright/test'
import { API_KEY } from '../../../api_key'
import { urls } from '../../common/urls'
import { dataRequest } from '../../common/data'

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

test.afterEach('Deleting created object', async ({ request }) => {
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
test.describe('Geting data of created objects', async () => {
	test('Valid url, with token -> get objects data', async ({ request }) => {
		let res = await request.get(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
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
	})

	test('Invaild url -> 400 error', async ({ request }) => {
		let res = await request.get(`%%%^${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
			},
		})
		await expect(res.status()).toBe(400)
	})

	test('Invaild method -> 400 error', async ({ request }) => {
		let res = await request.post(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
			},
		})
		let resJson = await res.json()
		await expect(resJson.error).toBe('Bad request')
		await expect(res.status()).toBe(400)
	})

	test('Without token -> 400 error', async ({ request }) => {
		let res = await request.get(`${urls.main}user`, {
			headers: {
				Authorization: ``,
			},
		})
		let resJson = await res.json()
		await expect(resJson.error).toBe('Bad request')
		await expect(res.status()).toBe(400)
	})
})
