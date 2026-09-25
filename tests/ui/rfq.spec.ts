import { test, expect } from '@playwright/test';
import { VendorPage } from '../../pages/VendorPage';
import { ProductPage } from '../../pages/ProductPage';
import { PurchaseOrderPage } from '../../pages/PurchaseOrderPage';

test('TC01 create RFQ shows status RFQ and correct line total', async ({ page }) => {
  const suffix = Date.now();
  const vendor = `Vendor ${suffix}`;
  const product = `Bolt ${suffix}`;
  await new VendorPage(page).create(vendor);
  await new ProductPage(page).createGoods(product);
  const po = new PurchaseOrderPage(page);
  await po.openNew(); await po.selectVendor(vendor); await po.addLine(product, 7, 13.5); await po.save();
  await expect(page.getByText('RFQ', { exact: true })).toBeVisible();
  await expect(page.getByText('$ 94.50')).toBeVisible();
});

test('TC08 saving an RFQ without a vendor shows an error', async ({ page }) => {
  const po = new PurchaseOrderPage(page); await po.openNew(); await po.save();
  await expect(page.getByText(/vendor/i)).toBeVisible();
});
