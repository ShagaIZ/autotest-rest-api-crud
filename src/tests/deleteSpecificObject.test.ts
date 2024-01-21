import { test, expect } from '@playwright/test'
import { API_KEY } from '../../api_key'
import { urls } from '../common/urls'
import { dataRequest } from '../common/data'

let uuid: string

test.beforeEach('Deleting created object', async ({ request }) => {
	let res = await request.post(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${API_KEY}`,
		},
		data: dataRequest.userOne,
	})
	let resJson = await res.json()
	uuid = await resJson.items[0]._uuid
})

test('Deleting specific created object user', async ({ request }) => {
	let resDelete = await request.delete(`${urls.main}user/${uuid}`, {
		headers: {
			Authorization: `Bearer ${API_KEY}`,
		}
	})
	let resDeleteJson = await resDelete.json()
	await expect(resDelete).toBeOK()
	await expect(resDelete.status()).toBe(200)
	await expect(resDeleteJson).toBeTruthy()
	await expect(resDeleteJson._created).toBeTruthy()
	await expect(resDeleteJson._data_type).toBeTruthy()
	await expect(resDeleteJson._is_deleted).toBe(true)
	await expect(resDeleteJson._modified).toBeTruthy()
	await expect(resDeleteJson._self_link).toBe(`${urls.base}${urls.main}user/${resDeleteJson._uuid}`)
	await expect(resDeleteJson._user).toBeTruthy()
	await expect(resDeleteJson._uuid).toBeTruthy()
	await expect(resDeleteJson.city).toBe('Moscow')
	await expect(resDeleteJson.name).toBe('Ivan')
	await expect(resDeleteJson.age).toBe(25)
})
