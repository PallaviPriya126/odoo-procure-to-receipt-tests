import { test as base } from '@playwright/test';
import { OdooTestData } from '../api/OdooTestData';

type Fixtures = { testData: Awaited<ReturnType<OdooTestData['createVendorAndProduct']>> };

export const test = base.extend<Fixtures>({
  testData: async ({ request }, use) => {
    const data = await new OdooTestData(request).createVendorAndProduct();
    await use(data);
  },
});

export { expect } from '@playwright/test';
