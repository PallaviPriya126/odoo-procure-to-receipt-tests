import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('TC02 confirming an RFQ sets Purchase Order and shows a Receipt', async ({ page }) => {
  const seed = JSON.parse(await readFile('.auth/seed.json', 'utf8'));
  await page.goto(`/odoo/action-${seed.purchaseOrderActionId}/${seed.poId}?action=${seed.purchaseOrderActionId}&model=purchase.order&resId=${seed.poId}`);
  await expect(page.getByText('Purchase Order', { exact: true }).last()).toBeVisible();
  await expect(page.getByRole('button', { name: /Receipt/ })).toBeVisible();
});
