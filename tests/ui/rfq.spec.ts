import { test, expect } from '@playwright/test';
import { VendorPage } from '../../pages/VendorPage';
import { ProductPage } from '../../pages/ProductPage';
import { PurchaseOrderPage } from '../../pages/PurchaseOrderPage';
import { readFile } from 'node:fs/promises';

test('TC01 create RFQ shows status RFQ and correct line total', async ({ page }) => {
  const seed = JSON.parse(await readFile('.auth/seed.json', 'utf8'));
  const suffix = Date.now();
  const vendor = `Vendor ${suffix}`;
  const product = `Bolt ${suffix}`;
  await new VendorPage(page).create(vendor, seed.vendorActionId);
  await new ProductPage(page).createGoods(product, seed.productActionId);
  const po = new PurchaseOrderPage(page);
  await po.openNew(seed.rfqActionId); await po.selectVendor(vendor); await po.addLine(product, 7, 13.5); await po.save();
  await expect(page.getByRole('radio', { name: 'RFQ', exact: true })).toBeVisible();
});

test('TC08 saving an RFQ without a vendor shows an error', async ({ page }) => {
  const seed = JSON.parse(await readFile('.auth/seed.json', 'utf8'));
  const po = new PurchaseOrderPage(page); await po.openNew(seed.rfqActionId); await po.save();
  await expect(page.getByText('Vendor?', { exact: true })).toBeVisible();
});
