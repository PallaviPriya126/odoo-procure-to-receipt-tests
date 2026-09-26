import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test('TC11 admin can log in to Odoo', async ({ page }) => {
  await new LoginPage(page).loginAsAdmin();
  await expect(page).toHaveURL(/\/odoo/);
});

test('TC11b wrong password shows an error', async ({ page }) => {
  await new LoginPage(page).login(process.env.ODOO_USER!, 'wrong-password');
  await expect(page.getByText('Wrong login/password')).toBeVisible();
});
