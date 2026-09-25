import { expect, Page } from '@playwright/test';

export class VendorPage {
  constructor(private readonly page: Page) {}

  async create(name: string) {
    await this.page.goto('/odoo/vendors/new');
    await this.page.getByRole('combobox').first().fill(name);
    await this.page.getByRole('button', { name: 'Save manually' }).click();
    await expect(this.page.getByRole('heading', { name })).toBeVisible();
  }
}
