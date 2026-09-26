import { APIRequestContext } from '@playwright/test';
import { OdooApiClient } from './OdooApiClient';

export class OdooTestData {
  private readonly api: OdooApiClient;
  constructor(request: APIRequestContext) { this.api = new OdooApiClient(request); }

  async createVendorAndProduct() {
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const vendorName = `QA Vendor ${suffix}`;
    const productName = `QA Product ${suffix}`;
    const vendor = await this.api.create('res.partner', { name: vendorName, supplier_rank: 1 });
    const product = await this.api.create('product.product', { name: productName, detailed_type: 'product', standard_price: 1, list_price: 1 });
    return { vendorId: Number(vendor), vendorName, productId: Number(product), productName };
  }
}
