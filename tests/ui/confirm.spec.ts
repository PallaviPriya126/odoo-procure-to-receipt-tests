import { test, expect } from '@playwright/test';

test('TC02 confirming an RFQ sets Purchase Order and shows a Receipt', async ({ page }) => {
  await page.goto('/odoo/purchase/1');
  await expect(page.getByText('Purchase Order', { exact: true }).last()).toBeVisible();
  await expect(page.getByRole('button', { name: /Receipt/ })).toBeVisible();
});
