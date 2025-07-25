import { test, expect, request, APIResponse } from '@playwright/test';
import { urls } from '../../common/urls';
import { dataRequest } from '../../common/data';
import { createApiBase } from '../../common/apiBase';

let uuidUserOne: string;
test.beforeEach('Creating object', async () => {
  uuidUserOne = await (await createApiBase()).createObject(dataRequest.userOne);
});
test.afterEach('Deleting created object', async () => {
  await (await createApiBase()).deleteObject(uuidUserOne);
});
test.describe('Deleting specific created object', async () => {
  test('Valid url and data, with token -> object created', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.delete(`${urls.main}user/${uuidUserOne}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });
    await expect(response).toBeOK();
    expect(response.status()).toBe(200);
    expect(await response.json()).toBeTruthy();
    expect((await response.json())._created).toBeTruthy();
    expect((await response.json())._data_type).toBeTruthy();
    expect((await response.json())._is_deleted).toBe(true);
    expect((await response.json())._modified).toBeTruthy();
    expect((await response.json())._self_link).toBe(
      `${urls.base}${urls.main}user/${(await response.json())._uuid}`
    );
    expect((await response.json())._user).toBeTruthy();
    expect((await response.json())._uuid).toBeTruthy();
    expect((await response.json()).city).toBe(JSON.parse(dataRequest.userOne)[0].city);
    expect((await response.json()).name).toBe(JSON.parse(dataRequest.userOne)[0].name);
    expect((await response.json()).age).toBe(25);
    await requestContext.dispose();
  });

  test('Invaild url -> 404 error', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.delete(
      `asas${urls.main}user/${uuidUserOne}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      },
    );
    expect(response.status()).toBe(404);
    await requestContext.dispose();
  });

  test('Invalid uuid -> 400 error', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.delete(`${urls.main}user/1212121212ggg`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });
    expect(response.status()).toBe(400);
    await requestContext.dispose();
  });

  test('Without token -> 400 error', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.delete(`${urls.main}user/${uuidUserOne}`, {
      headers: {
        Authorization: ``,
      },
    });

    expect((await response.json()).error).toBe('Bad request');
    expect(response.status()).toBe(400);
    await requestContext.dispose();
  });
});
