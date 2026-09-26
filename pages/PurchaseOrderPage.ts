import { expect, Page } from '@playwright/test';

export class PurchaseOrderPage {
  constructor(private readonly page: Page) {}

  async openNew() { await this.page.goto('/web#id=new&model=purchase.order&view_type=form'); }

  async selectVendor(name: string) {
    const vendor = this.page.getByRole('combobox', { name: 'Vendor?' });
    await vendor.fill(name);
    await this.page.locator('[id^="partner_id_"][id$="_0"]').first().click();
  }

  async addLine(product: string, quantity: number, price: number) {
    await this.page.getByRole('button', { name: 'Add a product' }).click();
    const row = this.page.locator('tr').filter({ has: this.page.getByRole('combobox').last() }).last();
    const productField = row.getByRole('combobox').first();
    await productField.fill(product);
    await this.page.getByText(product, { exact: true }).last().click();
    await row.locator('input').nth(0).fill(String(quantity));
    await row.locator('input').nth(1).fill(String(price));
  }

  async save() { await this.page.getByRole('button', { name: 'Save manually' }).click(); }

  async confirm() {
    await this.save();
    await this.page.getByRole('button', { name: 'Confirm Order' }).click();
    await expect(this.page.getByText('Purchase Order', { exact: true })).toBeVisible();
  }

  async cancel() { await this.page.getByRole('button', { name: 'Cancel' }).click(); }
}
