import { test as setup, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { OdooTestData } from '../api/OdooTestData';

const authFile = '.auth/admin.json';

setup('authenticate admin', async ({ page, request }) => {
  await page.goto('/web/login');
  await page.locator('input[name="login"]').fill(process.env.ODOO_USER!);
  await page.locator('input[name="password"]').fill(process.env.ODOO_PASSWORD!);
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page).toHaveURL(/\/odoo/);
  const testData = new OdooTestData(request);
  const seed = {
    ...await testData.ensureValidatedPurchaseFlow(),
    ...await testData.getUiActionIds(),
  };
  await mkdir('.auth', { recursive: true });
  await writeFile('.auth/seed.json', JSON.stringify(seed), 'utf8');
  await page.context().storageState({ path: authFile });
});
