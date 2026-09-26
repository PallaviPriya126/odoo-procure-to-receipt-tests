import { expect, Page } from '@playwright/test';

export class VendorPage {
  constructor(private readonly page: Page) {}

  async create(name: string) {
    await this.page.goto('/web#id=new&model=res.partner&view_type=form');
    await this.page.getByPlaceholder('e.g. Brandon Freeman').fill(name);
    await this.page.getByRole('button', { name: 'Save manually' }).click();
    await expect(this.page.getByText(name, { exact: true }).first()).toBeVisible();
  }
}
