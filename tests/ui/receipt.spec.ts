import { test, expect } from '../fixtures/authenticatedPage';
import { readFile } from 'node:fs/promises';

test('TC03 validating the full receipt sets it Done and received quantity 10', async ({ authenticatedPage: page }) => {
  const seed = JSON.parse(await readFile('.auth/seed.json', 'utf8'));
  await page.goto(`/odoo/action-${seed.receiptActionId}/${seed.pickingId}?action=${seed.receiptActionId}&model=stock.picking&resId=${seed.pickingId}`);
  await expect(page.locator('button[aria-current="step"]')).toHaveText('Done');
  await expect(page.getByText('10.00', { exact: true }).first()).toBeVisible();
});
