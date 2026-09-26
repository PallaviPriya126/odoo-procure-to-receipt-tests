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
    const templateId = await this.api.create('product.template', {
      name: productName,
      purchase_ok: true,
      sale_ok: false,
      type: 'consu',
      is_storable: true,
    });
    const products = await this.api.searchRead('product.product', [['product_tmpl_id', '=', templateId]], ['id', 'name']);
    const product = products[0];
    if (!product) throw new Error(`Product variant was not created for template ${templateId}`);
    return { vendorId: vendor, vendorName, productId: Number(product.id), productName: String(product.name) };
  }
}
