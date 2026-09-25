import { expect, Page } from '@playwright/test';

export class ReceiptPage {
  constructor(private readonly page: Page) {}

  async openFromPurchaseOrder() {
    await this.page.getByRole('button', { name: /Receipt/ }).click();
    await expect(this.page.getByRole('button', { name: 'Validate' })).toBeVisible();
  }

  async validate() {
    await this.page.getByRole('button', { name: 'Validate' }).click();
    await expect(this.page.getByText('Done', { exact: true })).toBeVisible();
  }
}
