import { test, expect } from '@playwright/test';
import { API_KEY } from '../../api_key';
import { urls } from '../common/urls';
import { dataRequest } from '../common/data';

let uuidUserOne: string
let uuidUserTwo: string

test.afterEach('Deleting created object',async({request})=>{
    await request.delete(`${urls.main}user`,{
      headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
        data:`[{"_uuid": "${uuidUserOne}"}]`
      })   

    await request.delete(`${urls.main}user`,{
      headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
        data:`[{"_uuid": "${uuidUserTwo}"}]`
      }) 
})


test('Geting data of created objects', async({request})=>{
    await request.post(`${urls.main}user`,{
    headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      data: dataRequest.userOne
    }
)
     await request.post(`${urls.main}user`,{
     headers: {
      Authorization: `Bearer ${API_KEY}`,
      },
       data: dataRequest.userTwo
    }
)
    
    let res = await request.get(`${urls.main}user`,{
        headers: {
            Authorization: `Bearer ${API_KEY}`,
          }
    
        }
    )
    let resJson = await res.json()
    uuidUserOne = await resJson.items[0]._uuid
    uuidUserTwo = await resJson.items[1]._uuid
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