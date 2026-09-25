import { test, expect } from '@playwright/test';

test('TC03 validating the full receipt sets it Done and received quantity 10', async ({ page }) => {
  await page.goto('/odoo/purchase/1/action-347/1');
  await expect(page.locator('button[aria-current="step"]')).toHaveText('Done');
  await expect(page.getByText('10.00', { exact: true }).first()).toBeVisible();
});
