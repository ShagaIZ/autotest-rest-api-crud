import { test, expect, request, APIResponse } from '@playwright/test';
import { urls } from '../../common/urls';
import { dataRequest } from '../../common/data';
import { createApiBase } from '../../common/apiBase';
let uuid: string;

test.afterEach('Deleting created object', async () => {
  await (await createApiBase()).deleteObject(uuid);
});

test.describe('Creating object', async () => {
  test.only('Valid url and data, with token -> object created', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.post(`${urls.main}user`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      data: dataRequest.userOne,
    });
    uuid = await (await response.json()).items[0]._uuid;
    await expect(response).toBeOK();
    expect(response.status()).toBe(201);
    expect((await response.json()).items[0]).toBeTruthy();
    expect((await response.json()).items[0]._created).toBeTruthy();
    expect((await response.json()).items[0]._data_type).toBeTruthy();
    expect((await response.json()).items[0]._is_deleted).toBe(false);
    expect((await response.json()).items[0]._modified).toBeTruthy();
    expect((await response.json()).items[0]._self_link).toBe(
      `${urls.base}${urls.main}user/${(await response.json()).items[0]._uuid}`
    );
    expect((await response.json()).items[0]._user).toBeTruthy();
    expect((await response.json()).items[0]._uuid).toBeTruthy();
    expect((await response.json()).items[0].city).toBe(
      JSON.parse(dataRequest.userOne)[0].city
    );
    expect((await response.json()).items[0].name).toBe(
      JSON.parse(dataRequest.userOne)[0].name
    );
    expect((await response.json()).items[0].age).toBe(25);
    await requestContext.dispose();
  });

  test('Invaild url -> 405 error', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.post(`#@#${urls.main}user`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      data: dataRequest.userOne,
    });
    expect(response.status()).toBe(405);
    await requestContext.dispose();
  });

  test('Empty data -> 400 error', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.post(`${urls.main}user`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      data: '',
    });

    expect((await response.json()).error).toBe('Bad request');
    expect(response.status()).toBe(400);
    await requestContext.dispose();
  });

  test('Invalid method -> 400 error ', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.get(`${urls.main}user`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      data: dataRequest.userOne,
    });
    expect(response.status()).toBe(400);
    await requestContext.dispose();
  });

  test('Without token -> 400 error ', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.post(`${urls.main}user`, {
      headers: {
        Authorization: ``,
      },
      data: dataRequest.userOne,
    });

    expect((await response.json()).error).toBe('Bad request');
    expect(response.status()).toBe(400);
    await requestContext.dispose();
  });
});
