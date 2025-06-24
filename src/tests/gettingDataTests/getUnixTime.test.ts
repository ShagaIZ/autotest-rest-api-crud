import { test, expect, request, APIResponse } from '@playwright/test';
import { urls } from '../../common/urls';
test.describe('Getting unix time', async () => {
  test('Valid url, with token -> getting unix time', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.get(urls.probe, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });
    await expect(response).toBeOK();
    expect(response.status()).toBe(200);
    expect((await response.json()).time).toBeTruthy();
    expect((await response.json()).time).toBeGreaterThan(1700000000);
    expect((await response.json()).time).toBeLessThan(2000000000);
    await requestContext.dispose();
  });

  test('Invalid url -> 400 error', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.get(`1212${urls.probe}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });
    expect(response.status()).toBe(404);
    await requestContext.dispose();
  });

  test('Without token -> 400 error', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.get(`${urls.probe}`, {
      headers: {
        Authorization: ``,
      },
    });
    expect((await response.json()).error).toBe('Bad request');
    expect(response.status()).toBe(400);
    await requestContext.dispose();
  });

  test('Invalid method -> 400 error', async () => {
    const requestContext = await request.newContext();
    const response: APIResponse = await requestContext.post(`${urls.probe}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });
    expect((await response.json()).error).toBe('Bad request');
    expect(response.status()).toBe(400);
    await requestContext.dispose();
  });
});
