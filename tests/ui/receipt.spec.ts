import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('TC03 validating the full receipt sets it Done and received quantity 10', async ({ page }) => {
  const seed = JSON.parse(await readFile('.auth/seed.json', 'utf8'));
  await page.goto(`/web#id=${seed.pickingId}&model=stock.picking&view_type=form`);
  await expect(page.locator('button[aria-current="step"]')).toHaveText('Done');
  await expect(page.getByText('10.00', { exact: true }).first()).toBeVisible();
});
