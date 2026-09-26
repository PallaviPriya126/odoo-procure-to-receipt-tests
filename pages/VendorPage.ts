import { expect, Page } from '@playwright/test';

export class VendorPage {
  constructor(private readonly page: Page) {}

  async create(name: string, actionId: number) {
    await this.page.goto(`/web#action=${actionId}&model=res.partner&view_type=form&id=new`);
    await this.page.getByRole('heading').getByRole('combobox').fill(name);
    await this.page.getByRole('button', { name: 'Save manually' }).click();
    await expect(this.page.getByText(name, { exact: true }).first()).toBeVisible();
  }
}
