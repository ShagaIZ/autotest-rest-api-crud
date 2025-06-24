import { test, expect, request, APIResponse } from '@playwright/test';
import { urls } from '../../common/urls';
import { dataRequest, getNewUser } from '../../common/data';
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
test.describe('Updating created objects', async () => {
  test('Valid url and data, with token -> objects updated', async () => {
    const requestContextUpdatetUserOne = await request.newContext();
    const resUpdatetUserOne = await requestContextUpdatetUserOne.put(`${urls.main}user`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      data: getNewUser(uuidUserOne),
    });

    const requestContextUpdatetUserTwo = await request.newContext();
    const resUpdatetUserTwo = await requestContextUpdatetUserTwo.put(`${urls.main}user`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      data: getNewUser(uuidUserTwo),
    });
    //First block assertation
    await expect(resUpdatetUserOne).toBeOK();
    expect(resUpdatetUserOne.status()).toBe(200);
    expect((await resUpdatetUserOne.json()).items[0]).toBeTruthy();
    expect((await resUpdatetUserOne.json()).items[0]._created).toBeTruthy();
    expect((await resUpdatetUserOne.json()).items[0]._data_type).toBeTruthy();
    expect((await resUpdatetUserOne.json()).items[0]._is_deleted).toBe(false);
    expect((await resUpdatetUserOne.json()).items[0]._modified).toBeTruthy();
    expect((await resUpdatetUserOne.json()).items[0]._self_link).toBe(
      `${urls.base}${urls.main}user/${(await resUpdatetUserOne.json()).items[0]._uuid}`
    );
    expect((await resUpdatetUserOne.json()).items[0]._user).toBeTruthy();
    expect((await resUpdatetUserOne.json()).items[0]._uuid).toBeTruthy();
    expect((await resUpdatetUserOne.json()).items[0].city).toBe(
      JSON.parse(getNewUser(uuidUserOne))[0].city
    );
    expect((await resUpdatetUserOne.json()).items[0].name).toBe(
      JSON.parse(getNewUser(uuidUserOne))[0].name
    );
    expect((await resUpdatetUserOne.json()).items[0].age).toBe(35);
    //Second block assertation
    await expect(resUpdatetUserTwo).toBeOK();
    expect(resUpdatetUserTwo.status()).toBe(200);
    expect((await resUpdatetUserTwo.json()).items[0]).toBeTruthy();
    expect((await resUpdatetUserTwo.json()).items[0]._created).toBeTruthy();
    expect((await resUpdatetUserTwo.json()).items[0]._data_type).toBeTruthy();
    expect((await resUpdatetUserTwo.json()).items[0]._is_deleted).toBe(false);
    expect((await resUpdatetUserTwo.json()).items[0]._modified).toBeTruthy();
    expect((await resUpdatetUserTwo.json()).items[0]._self_link).toBe(
      `${urls.base}${urls.main}user/${(await resUpdatetUserTwo.json()).items[0]._uuid}`
    );
    expect((await resUpdatetUserTwo.json()).items[0]._user).toBeTruthy();
    expect((await resUpdatetUserTwo.json()).items[0]._uuid).toBeTruthy();
    expect((await resUpdatetUserTwo.json()).items[0].city).toBe(
      JSON.parse(getNewUser(uuidUserTwo))[0].city
    );
    expect((await resUpdatetUserTwo.json()).items[0].name).toBe(
      JSON.parse(getNewUser(uuidUserOne))[0].name
    );
    expect((await resUpdatetUserTwo.json()).items[0].age).toBe(35);
    await requestContextUpdatetUserOne.dispose();
    await requestContextUpdatetUserTwo.dispose();
  });

  test('Invalid url -> 404 error', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.put(`$$#$#${urls.main}user`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      data: getNewUser(uuidUserOne),
    });

    expect(response.status()).toBe(404);
    await requestContext.dispose();
  });

  test('Empty data -> 400 error', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.put(`${urls.main}user`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      data: '',
    });
    expect((await response.json()).error).toBe('Bad request');
    expect(response.status()).toBe(400);
    await requestContext.dispose();
  });

  test('Without token -> 400 error', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.put(`${urls.main}user`, {
      headers: {
        Authorization: ``,
      },
      data: getNewUser(uuidUserOne),
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
      data: getNewUser(uuidUserOne),
    });
    expect(response.status()).toBe(400);
    await requestContext.dispose();
  });
});
