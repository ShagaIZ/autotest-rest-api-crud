import { test, expect } from '@playwright/test'
// import { process.env.API_KEY } from '../../../process.env.API_KEY'
import { urls } from '../../common/urls'
import { dataRequest } from '../../common/data'

let uuidUserOne: string
let uuidUserTwo: string

test.beforeEach('Creating object', async ({ request }) => {
	let resCreateUserOne = await request.post(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
		},
		data: dataRequest.userOne,
	})
	let resCreateUserTwo = await request.post(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
		},
		data: dataRequest.userTwo,
	})

	let resjsonCreateUserOne = await resCreateUserOne.json()
	let resjsonCreateUserTwo = await resCreateUserTwo.json()
	uuidUserOne = await resjsonCreateUserOne.items[0]._uuid
	uuidUserTwo = await resjsonCreateUserTwo.items[0]._uuid
})

test.afterEach('Creating object', async ({ request }) => {
	await request.delete(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
		},
		data: `[{"_uuid": "${uuidUserOne}"}]`,
	})
	await request.delete(`${urls.main}user`, {
		headers: {
			Authorization: `Bearer ${process.env.API_KEY}`,
		},
		data: `[{"_uuid": "${uuidUserTwo}"}]`,
	})
})
test.describe('Deleting objects', async () => {
	test('Valid url and data, with token -> object deleteds', async ({ request }) => {
		let resDeleteUserOne = await request.delete(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: `[{"_uuid": "${uuidUserOne}"}]`,
		})
		let resDeleteUserOneJson = await resDeleteUserOne.json()
		let resDeleteUserTwo = await request.delete(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: `[{"_uuid": "${uuidUserTwo}"}]`,
		})
		let resDeleteUserTwoJson = await resDeleteUserOne.json()
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
		await expect(resDeleteUserTwoJson.items[0]._self_link).toBe(`${urls.base}${urls.main}user/${resDeleteUserOneJson.items[0]._uuid}`)
		await expect(resDeleteUserTwoJson.items[0]._user).toBeTruthy()
		await expect(resDeleteUserTwoJson.items[0]._uuid).toBeTruthy()
		await expect(resDeleteUserTwoJson.items[0].city).toBe('Moscow')
		await expect(resDeleteUserTwoJson.items[0].name).toBe('Ivan')
		await expect(resDeleteUserTwoJson.items[0].age).toBe(25)
	})

	test('Invaild url -> 404 error', async ({ request }) => {
		let resDelete = await request.delete(`1212${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: `[{"_uuid": "${uuidUserOne}"}]`,
		})
		await expect(resDelete.status()).toBe(404)
	})

	test('Empty data -> 400 error', async ({ request }) => {
		let resDelete = await request.delete(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: ``,
		})
		let resJson = await resDelete.json()
		await expect(resJson.error).toBe('Bad request')
		await expect(resDelete.status()).toBe(400)
	})

	test('Invalid method -> 400 error', async ({ request }) => {
		let resDelete = await request.get(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: `[{"_uuid": "${uuidUserTwo}"}]`,
		})
		await expect(resDelete.status()).toBe(400)
	})

	test('Without token -> 400 error', async ({ request }) => {
		let resDelete = await request.delete(`${urls.main}user`, {
			headers: {
				Authorization: ``,
			},
			data: `[{"_uuid": "${uuidUserOne}"}]`,
		})
		let resJson = await resDelete.json()
		await expect(resJson.error).toBe('Bad request')
		await expect(resDelete.status()).toBe(400)
	})
})
