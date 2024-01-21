import { test, expect } from '@playwright/test'
import { API_KEY } from '../../api_key'
import { urls } from '../common/urls'
import { dataRequest, getNewUser } from '../common/data'

let uuidUser: string

test.afterEach('Deleting created object', async ({ request }) => {
	await request.delete(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${API_KEY}`,
		},
		data: `[{"_uuid": "${uuidUser}"}]`,
	})
})

test('Updating specific created object', async ({ request }) => {
	let res = await request.post(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${API_KEY}`,
		},
		data: dataRequest.userOne,
	})

	let resJson = await res.json()
	uuidUser = await resJson.items[0]._uuid

	let resUpdatetUser = await request.put(`${urls.main}user/${uuidUser}`, {
		headers: {
			Authorization: `Bearer ${API_KEY}`,
		},
		data: dataRequest.userThree,
	})

	let resUpdateUserJson = await resUpdatetUser.json()
	await expect(resUpdatetUser).toBeOK()
	await expect(resUpdatetUser.status()).toBe(200)
	await expect(resUpdateUserJson).toBeTruthy()
	await expect(resUpdateUserJson._created).toBeTruthy()
	await expect(resUpdateUserJson._data_type).toBeTruthy()
	await expect(resUpdateUserJson._is_deleted).toBe(false)
	await expect(resUpdateUserJson._modified).toBeTruthy()
	await expect(resUpdateUserJson._self_link).toBe(`${urls.base}${urls.main}user/${resUpdateUserJson._uuid}`)
	await expect(resUpdateUserJson._user).toBeTruthy()
	await expect(resUpdateUserJson._uuid).toBeTruthy()
	await expect(resUpdateUserJson.city).toBe('Ufa')
	await expect(resUpdateUserJson.name).toBe('Geran')
	await expect(resUpdateUserJson.age).toBe(20)
})
