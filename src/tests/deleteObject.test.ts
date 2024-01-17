import { test, expect } from '@playwright/test';
import { API_KEY } from '../../api_key';
import { urls } from '../common/urls';
import { dataRequest } from '../common/data';

let uuid: string

test.beforeEach('Deleting created object',async({request})=>{
    let res = await request.post(`${urls.main}user`,{
        headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
          data: dataRequest.userOne
        }
    )
    let resJson = await res.json()
    uuid = await resJson.items[0]._uuid
      
})


test('Deleting of reated object user', async({request})=>{
    let resDelete = await request.delete(`${urls.main}user`,{
        headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
          data:`[{"_uuid": "${uuid}"}]`
        })  
    let resDeleteJson = await resDelete.json()
    await expect(resDelete).toBeOK()
    await expect(resDelete.status()).toBe(200)
    await expect(resDeleteJson.items[0]).toBeTruthy()
    await expect(resDeleteJson.items[0]._created).toBeTruthy()
    await expect(resDeleteJson.items[0]._data_type).toBeTruthy()
    await expect(resDeleteJson.items[0]._is_deleted).toBe(true)
    await expect(resDeleteJson.items[0]._modified).toBeTruthy()
    await expect(resDeleteJson.items[0]._self_link).toBe(`${urls.base}${urls.main}user/${resDeleteJson.items[0]._uuid}`)
    await expect(resDeleteJson.items[0]._user).toBeTruthy()
    await expect(resDeleteJson.items[0]._uuid).toBeTruthy()
    await expect(resDeleteJson.items[0].city).toBe('Moscow')
    await expect(resDeleteJson.items[0].name).toBe('Ivan')
    await expect(resDeleteJson.items[0].age).toBe(25)
})