import { test, expect } from '@playwright/test'
// import { process.env.API_KEY } from '../../../process.env.API_KEY'
import { urls } from '../../common/urls'
import { dataRequest, getNewUser } from '../../common/data'

let uuidUser: string
test.beforeEach('Creating object', async ({ request }) => {
	let res = await request.post(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
		},
		data: dataRequest.userOne,
	})

	let resJson = await res.json()
	uuidUser = await resJson.items[0]._uuid
})
test.afterEach('Deleting created object', async ({ request }) => {
	await request.delete(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
		},
		data: `[{"_uuid": "${uuidUser}"}]`,
	})
})
test.describe('Updating specific created object', async () => {
	test('Valid url and data, with token -> updating specific created object', async ({ request }) => {
		let resUpdatetUser = await request.put(`${urls.main}user/${uuidUser}`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
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

	test('Invalid url -> 404 error', async ({ request }) => {
		let resUpdatetUser = await request.put(`!@!@${urls.main}user/${uuidUser}`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: dataRequest.userThree,
		})
		await expect(resUpdatetUser.status()).toBe(404)
	})

	test('Invalid method -> 405 error', async ({ request }) => {
		let resUpdatetUser = await request.post(`${urls.main}user/${uuidUser}`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: dataRequest.userThree,
		})
		await expect(resUpdatetUser.status()).toBe(405)
	})

	test('Invalid uuid -> 405 error', async ({ request }) => {
		let resUpdatetUser = await request.post(`${urls.main}user/${uuidUser}888`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: dataRequest.userThree,
		})
		await expect(resUpdatetUser.status()).toBe(405)
	})

	test('Without token -> 400 error', async ({ request }) => {
		let resUpdatetUser = await request.put(`${urls.main}user/${uuidUser}`, {
			headers: {
				Authorization: ``,
			},
			data: dataRequest.userThree,
		})
		let resUpdateUserJson = await resUpdatetUser.json()
		await expect(resUpdateUserJson.error).toBe('Bad request')
		await expect(resUpdatetUser.status()).toBe(400)
	})
})
