import { test as setup, expect } from '@playwright/test';

const authFile = '.auth/admin.json';

setup('authenticate admin', async ({ page }) => {
  await page.goto('/web/login');
  await page.locator('input[name="login"]').fill(process.env.ODOO_USER!);
  await page.locator('input[name="password"]').fill(process.env.ODOO_PASSWORD!);
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page).toHaveURL(/\/odoo/);
  await page.context().storageState({ path: authFile });
});
