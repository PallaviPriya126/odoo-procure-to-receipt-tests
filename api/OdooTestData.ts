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

  async ensureValidatedPurchaseFlow() {
    const existing = await this.api.searchRead('purchase.order', [['name', '=', 'P00001']], ['id', 'name', 'picking_ids']);
    if (existing.length) {
      return {
        poId: Number(existing[0].id),
        poName: String(existing[0].name),
        pickingId: Number(existing[0].picking_ids[0]),
      };
    }

    const partners = await this.api.searchRead('res.partner', [['name', '=', 'Test Vendor A']], ['id']);
    const vendorId = partners.length
      ? Number(partners[0].id)
      : await this.api.create('res.partner', { name: 'Test Vendor A', supplier_rank: 1 });

    let products = await this.api.searchRead('product.product', [['name', '=', 'Test Bolt']], ['id']);
    if (!products.length) {
      const templateId = await this.api.create('product.template', {
        name: 'Test Bolt', purchase_ok: true, sale_ok: false, type: 'consu', is_storable: true,
      });
      products = await this.api.searchRead('product.product', [['product_tmpl_id', '=', templateId]], ['id']);
    }
    const productId = Number(products[0].id);
    const poId = await this.api.create('purchase.order', {
      partner_id: vendorId,
      order_line: [[0, 0, { product_id: productId, product_qty: 10, price_unit: 50 }]],
    });
    await this.api.execute('purchase.order', 'button_confirm', [poId]);
    const orders = await this.api.searchRead('purchase.order', [['id', '=', poId]], ['name', 'picking_ids']);
    const pickingId = Number(orders[0].picking_ids[0]);
    const moves = await this.api.searchRead('stock.move', [['picking_id', '=', pickingId]], ['id']);
    await this.api.write('stock.move', [Number(moves[0].id)], { quantity: 10 });
    await this.api.execute('stock.picking', 'button_validate', [pickingId]);
    return { poId, poName: String(orders[0].name), pickingId };
  }
}
