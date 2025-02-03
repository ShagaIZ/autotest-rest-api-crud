import { APIResponse, chromium, Page, request } from '@playwright/test'
import { urls } from './urls'

class ApiBase {
	readonly page: Page

	constructor(page: Page) {
		this.page = page
	}

	async createObject(user: string): Promise<string> {
		const requestContext = await request.newContext()
		let resCreateUserOne: APIResponse = await requestContext.post(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: user,
		})
		let responseUuid: string = await (await resCreateUserOne.json()).items[0]._uuid
		await requestContext.dispose()
		return responseUuid
	}
	async deleteObject(uuid: string): Promise<void> {
		const requestContext = await request.newContext()
		await requestContext.delete(`${urls.main}user`, {
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			data: `[{"_uuid": "${uuid}"}]`,
		})
		await requestContext.dispose()
	}
}

export const createApiBase = async (): Promise<ApiBase> => {
	const browser = await chromium.launch()
	const page = await browser.newPage()
	return new ApiBase(page)
}
