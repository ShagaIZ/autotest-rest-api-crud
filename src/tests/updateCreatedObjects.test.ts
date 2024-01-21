import { test, expect } from '@playwright/test'
import { API_KEY } from '../../api_key'
import { urls } from '../common/urls'
import { dataRequest, getNewUser } from '../common/data'

let uuidUserOne: string
let uuidUserTwo: string

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

test('Updating created objects', async ({ request }) => {
	await request.post(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${API_KEY}`,
		},
		data: dataRequest.userOne,
	})
	await request.post(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${API_KEY}`,
		},
		data: dataRequest.userTwo,
	})

	let res = await request.get(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${API_KEY}`,
		},
	})
	let resJson = await res.json()
	uuidUserOne = await resJson.items[0]._uuid
	uuidUserTwo = await resJson.items[1]._uuid

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
