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
test.describe('Updating specific created object', async () => {
  test('Valid url and data, with token -> updating specific created object', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.put(`${urls.main}user/${uuidUserOne}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      data: dataRequest.userThree,
    });
    await expect(response).toBeOK();
    expect(response.status()).toBe(200);
    expect(await response.json()).toBeTruthy();
    expect((await response.json())._created).toBeTruthy();
    expect((await response.json())._data_type).toBeTruthy();
    expect((await response.json())._is_deleted).toBe(false);
    expect((await response.json())._modified).toBeTruthy();
    expect((await response.json())._self_link).toBe(
      `${urls.base}${urls.main}user/${(await response.json())._uuid}`
    );
    expect((await response.json())._user).toBeTruthy();
    expect((await response.json())._uuid).toBeTruthy();
    expect((await response.json()).city).toBe(JSON.parse(dataRequest.userThree).city);
    expect((await response.json()).name).toBe(JSON.parse(dataRequest.userThree).name);
    expect((await response.json()).age).toBe(20);
    await requestContext.dispose();
  });

  test('Invalid url -> 404 error', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.put(`!@!@${urls.main}user/${uuidUserOne}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      data: dataRequest.userThree,
    });
    expect(response.status()).toBe(404);
    await requestContext.dispose();
  });

  test('Invalid method -> 405 error', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.post(`${urls.main}user/${uuidUserOne}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      data: dataRequest.userThree,
    });
    expect(response.status()).toBe(405);
    await requestContext.dispose();
  });

  test('Invalid uuid -> 405 error', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.post(`${urls.main}user/${uuidUserOne}888`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      data: dataRequest.userThree,
    });
    expect(response.status()).toBe(405);
    await requestContext.dispose();
  });

  test('Without token -> 400 error', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.put(`${urls.main}user/${uuidUserOne}`, {
      headers: {
        Authorization: ``,
      },
      data: dataRequest.userThree,
    });
    expect((await response.json()).error).toBe('Bad request');
    expect(response.status()).toBe(400);
    await requestContext.dispose();
  });
});
