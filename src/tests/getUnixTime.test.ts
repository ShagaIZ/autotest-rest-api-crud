import { test, expect } from '@playwright/test';
import { API_KEY } from '../../api_key';
import { urls } from '../common/urls';




test('Getting unix time from server', async({request})=>{
    let res = await request.get(urls.probe,{
    headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    }
)
    let resJson = await res.json()
    await expect(res).toBeOK()
    await expect(res.status()).toBe(200)
    await expect(resJson.time).toBeTruthy()
    await expect(resJson.time).toBeGreaterThan(1700000000)
    await expect(resJson.time).toBeLessThan(2000000000)
})