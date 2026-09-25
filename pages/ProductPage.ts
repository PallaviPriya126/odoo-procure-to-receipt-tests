import { expect, Page } from '@playwright/test';

export class ProductPage {
  constructor(private readonly page: Page) {}

  async createGoods(name: string) {
    await this.page.goto('/odoo/purchase-products/new');
    await this.page.locator('[id^="name_"]').fill(name);
    await this.page.getByRole('radio', { name: 'Goods' }).check();
    await this.page.getByRole('checkbox', { name: 'Track Inventory?' }).check();
    await this.page.getByRole('button', { name: 'Save manually' }).click();
    await expect(this.page.getByRole('heading', { name: new RegExp(name) })).toBeVisible();
  }
}
