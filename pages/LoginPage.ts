import { expect, Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async login(username: string, password: string) {
    await this.page.goto('/web/login');
    await this.page.locator('input[name="login"]').fill(username);
    await this.page.locator('input[name="password"]').fill(password);
    await this.page.getByRole('button', { name: 'Log in' }).click();
  }

  async loginAsAdmin() {
    await this.login(process.env.ODOO_USER!, process.env.ODOO_PASSWORD!);
    await expect(this.page).toHaveURL(/\/odoo/);
  }
}
