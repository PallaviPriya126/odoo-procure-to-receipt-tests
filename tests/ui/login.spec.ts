import { test, expect } from '@playwright/test';

test('TC11 admin can log in to Odoo', async ({ page }) => {
  await page.goto('/web/login');
  await page.locator('input[name="login"]').fill(process.env.ODOO_USER!);
  await page.locator('input[name="password"]').fill(process.env.ODOO_PASSWORD!);
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page).toHaveURL(/\/odoo/);
});

test('TC11b wrong password shows an error', async ({ page }) => {
  await page.goto('/web/login');
  await page.locator('input[name="login"]').fill(process.env.ODOO_USER!);
  await page.locator('input[name="password"]').fill('wrong-password');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByText('Wrong login/password')).toBeVisible();
});
