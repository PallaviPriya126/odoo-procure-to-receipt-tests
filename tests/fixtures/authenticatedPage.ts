import { test as base, expect, Page } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    await new LoginPage(page).loginAsAdmin();
    await use(page);
  },
});

export { expect };
