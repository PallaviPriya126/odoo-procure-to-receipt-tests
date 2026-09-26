import { expect, Page } from '@playwright/test';

export class VendorPage {
  constructor(private readonly page: Page) {}

  async create(name: string, actionId: number) {
    await this.page.goto(`/odoo/action-${actionId}/new?action=${actionId}&model=res.partner&resId=new`);
    await this.page.getByRole('heading').getByRole('combobox').fill(name);
    await this.page.getByRole('button', { name: 'Save manually' }).click();
    await expect(this.page.getByText(name, { exact: true }).first()).toBeVisible();
  }
}
