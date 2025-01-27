import { test, expect, request } from '@playwright/test'
import { urls } from '../../common/urls'
import { dataRequest } from '../../common/data'

let uuid: string

test.beforeEach('Deleting created object', async () => {
	const requestContext = await request.newContext()
	let res = await requestContext.post(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
		},
		data: dataRequest.userOne,
	})
	let resJson = await res.json()
	uuid = await resJson.items[0]._uuid
	await requestContext.dispose()
})

test.afterEach('Creating object', async () => {
	const requestContext = await request.newContext()
	await requestContext.delete(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
		},
		data: `[{"_uuid": "${uuid}"}]`,
	})
	await requestContext.dispose()
})
test.describe('Deleting specific created object', async () => {
	test('Valid url and data, with token -> object created', async () => {
		const requestContext = await request.newContext()
		let resDelete = await requestContext.delete(`${urls.main}user/${uuid}`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
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
		await requestContext.dispose()
	})

	test('Invaild url -> 404 error', async () => {
		const requestContext = await request.newContext()
		let resDelete = await requestContext.delete(`asas${urls.main}user/${uuid}`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		})
		await expect(resDelete.status()).toBe(404)
		await requestContext.dispose()
	})

	test('Invalid uuid -> 400 error', async () => {
		const requestContext = await request.newContext()
		let resDelete = await requestContext.delete(`${urls.main}user/1212121212ggg`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		})
		await expect(resDelete.status()).toBe(400)
		await requestContext.dispose()
	})

	test('Without token -> 400 error', async () => {
		const requestContext = await request.newContext()
		let resDelete = await requestContext.delete(`${urls.main}user/${uuid}`, {
			headers: {
				Authorization: ``,
			},
		})
		let resJson = await resDelete.json()
		await expect(resJson.error).toBe('Bad request')
		await expect(resDelete.status()).toBe(400)
		await requestContext.dispose()
	})
})
