import { test, expect, request, APIResponse } from '@playwright/test';
import { urls } from '../../common/urls';
import { dataRequest } from '../../common/data';
import { createApiBase } from '../../common/apiBase';

let uuidUserTwo: string;

test.beforeEach('Creating object', async () => {
  uuidUserTwo = await (await createApiBase()).createObject(dataRequest.userTwo);
});

test.afterEach('Deleting created object', async () => {
  await (await createApiBase()).deleteObject(uuidUserTwo);
});
test.describe('Geting data of specific created object', async () => {
  test('Valid url, with token -> get specific object data', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.get(`${urls.main}user/${uuidUserTwo}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });
    await expect(response).toBeOK();
    await expect(response.status()).toBe(200);
    await expect(await response.json()).toBeTruthy();
    await expect((await response.json())._created).toBeTruthy();
    await expect((await response.json())._data_type).toBeTruthy();
    await expect((await response.json())._is_deleted).toBe(false);
    await expect((await response.json())._modified).toBeTruthy();
    await expect((await response.json())._self_link).toBe(
      `${urls.base}${urls.main}user/${(await response.json())._uuid}`,
    );
    await expect((await response.json())._user).toBeTruthy();
    await expect((await response.json())._uuid).toBeTruthy();
    await expect((await response.json()).city).toBe(JSON.parse(dataRequest.userTwo)[0].city);
    await expect((await response.json()).name).toBe(JSON.parse(dataRequest.userTwo)[0].name);
    await expect((await response.json()).age).toBe(45);
    await requestContext.dispose();
  });

  test('Invaild url -> 400 error', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.get(`%$%$%${urls.main}user/${uuidUserTwo}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });
    await expect(response.status()).toBe(400);
    await requestContext.dispose();
  });

  test('Invalid method -> 405 error', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.post(`${urls.main}user/${uuidUserTwo}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });
    await expect(response.status()).toBe(405);
    await requestContext.dispose();
  });

  test('Without token -> 400 error', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.get(`${urls.main}user/${uuidUserTwo}`, {
      headers: {
        Authorization: ``,
      },
    });
    await expect((await response.json()).error).toBe('Bad request');
    await expect(response.status()).toBe(400);
    await requestContext.dispose();
  });

  test('Invalid uuid -> 405 error', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.post(`${urls.main}user/&^&^&^&`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });
    await expect(response.status()).toBe(405);
    await requestContext.dispose();
  });
});
