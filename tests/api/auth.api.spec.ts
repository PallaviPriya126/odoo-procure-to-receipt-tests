import { test, expect } from '@playwright/test';
import { OdooApiClient } from '../../api/OdooApiClient';

test('API01 valid key can read the admin user', async ({ request }) => {
  test.skip(!process.env.ODOO_API_KEY, 'Set ODOO_API_KEY in .env to run authenticated API tests');
  const client = new OdooApiClient(request);
  const users = await client.searchRead('res.users', [['login', '=', 'admin']], ['name', 'login']);
  expect(users).toHaveLength(1);
  expect(users[0].login).toBe('admin');
});

test('API02 invalid key is rejected with 401', async ({ request }) => {
  const client = new OdooApiClient(request);
  const response = await client.call('res.users', 'search_read', { domain: [], fields: ['name'] }, 'not-a-real-key');
  expect(response.status()).toBe(401);
});
