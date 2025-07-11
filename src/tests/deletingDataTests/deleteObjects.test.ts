import { test, expect, APIResponse, request } from '@playwright/test';
import { urls } from '../../common/urls';
import { dataRequest } from '../../common/data';
import { createApiBase } from '../../common/apiBase';

let uuidUserOne: string;
let uuidUserTwo: string;

test.beforeEach('Creating object', async () => {
  uuidUserOne = await (await createApiBase()).createObject(dataRequest.userOne);
  uuidUserTwo = await (await createApiBase()).createObject(dataRequest.userTwo);
});

test.afterEach('Deleting created object', async () => {
  await (await createApiBase()).deleteObject(uuidUserOne);
  await (await createApiBase()).deleteObject(uuidUserTwo);
});
test.describe('Deleting objects', async () => {
  test('Valid url and data, with token -> object deleteds', async () => {
    const requestContextDeleteUserOne = await request.newContext();
    const resDeleteUserOne = await requestContextDeleteUserOne.delete(`${urls.main}user`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      data: `[{"_uuid": "${uuidUserOne}"}]`,
    });

    const requestContextDeleteUserTwo = await request.newContext();
    const resDeleteUserTwo = await requestContextDeleteUserTwo.delete(`${urls.main}user`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      data: `[{"_uuid": "${uuidUserTwo}"}]`,
    });

    //First block assertation
    await expect(resDeleteUserOne).toBeOK();
    expect(resDeleteUserOne.status()).toBe(200);
    expect((await resDeleteUserOne.json()).items[0]).toBeTruthy();
    expect((await resDeleteUserOne.json()).items[0]._created).toBeTruthy();
    expect((await resDeleteUserOne.json()).items[0]._data_type).toBeTruthy();
    expect((await resDeleteUserOne.json()).items[0]._is_deleted).toBe(true);
    expect((await resDeleteUserOne.json()).items[0]._modified).toBeTruthy();
    expect((await resDeleteUserOne.json()).items[0]._self_link).toBe(
      `${urls.base}${urls.main}user/${(await resDeleteUserOne.json()).items[0]._uuid}`
    );
    expect((await resDeleteUserOne.json()).items[0]._user).toBeTruthy();
    expect((await resDeleteUserOne.json()).items[0]._uuid).toBeTruthy();
    expect((await resDeleteUserOne.json()).items[0].city).toBe(
      JSON.parse(dataRequest.userOne)[0].city
    );
    expect((await resDeleteUserOne.json()).items[0].name).toBe(
      JSON.parse(dataRequest.userOne)[0].name
    );
    expect((await resDeleteUserOne.json()).items[0].age).toBe(25);
    //Second block assertation
    await expect(resDeleteUserTwo).toBeOK();
    expect(resDeleteUserTwo.status()).toBe(200);
    expect((await resDeleteUserTwo.json()).items[0]).toBeTruthy();
    expect((await resDeleteUserTwo.json()).items[0]._created).toBeTruthy();
    expect((await resDeleteUserTwo.json()).items[0]._data_type).toBeTruthy();
    expect((await resDeleteUserTwo.json()).items[0]._is_deleted).toBe(true);
    expect((await resDeleteUserTwo.json()).items[0]._modified).toBeTruthy();
    expect((await resDeleteUserTwo.json()).items[0]._self_link).toBe(
      `${urls.base}${urls.main}user/${(await resDeleteUserTwo.json()).items[0]._uuid}`
    );
    expect((await resDeleteUserTwo.json()).items[0]._user).toBeTruthy();
    expect((await resDeleteUserTwo.json()).items[0]._uuid).toBeTruthy();
    expect((await resDeleteUserTwo.json()).items[0].city).toBe(
      JSON.parse(dataRequest.userTwo)[0].city
    );
    expect((await resDeleteUserTwo.json()).items[0].name).toBe(
      JSON.parse(dataRequest.userTwo)[0].name
    );
    expect((await resDeleteUserTwo.json()).items[0].age).toBe(45);
    await requestContextDeleteUserOne.dispose();
    await requestContextDeleteUserTwo.dispose();
  });

  test('Invaild url -> 404 error', async () => {
    const requestContext = await request.newContext();
    const resDelete = await requestContext.delete(`1212${urls.main}user`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      data: `[{"_uuid": "${uuidUserOne}"}]`,
    });
    expect(resDelete.status()).toBe(404);
    await requestContext.dispose();
  });

  test('Empty data -> 400 error', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.delete(`${urls.main}user`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      data: ``,
    });
    expect((await response.json()).error).toBe('Bad request');
    expect(response.status()).toBe(400);
    await requestContext.dispose();
  });

  test('Invalid method -> 400 error', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.get(`${urls.main}user`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      data: `[{"_uuid": "${uuidUserTwo}"}]`,
    });
    expect(response.status()).toBe(400);
    await requestContext.dispose();
  });

  test('Without token -> 400 error', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.delete(`${urls.main}user`, {
      headers: {
        Authorization: ``,
      },
      data: `[{"_uuid": "${uuidUserOne}"}]`,
    });

    expect((await response.json()).error).toBe('Bad request');
    expect(response.status()).toBe(400);
    await requestContext.dispose();
  });
});
