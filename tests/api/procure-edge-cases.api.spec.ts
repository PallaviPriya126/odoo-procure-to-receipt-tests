import { test, expect } from '../fixtures';
import { OdooApiClient } from '../../api/OdooApiClient';

type Line = { productId: number; quantity: number; price: number };

async function createOrder(api: OdooApiClient, vendorId: number, lines: Line[]) {
  return api.create('purchase.order', {
    partner_id: vendorId,
    partner_ref: `PW-${Date.now()}`,
    order_line: lines.map(({ productId, quantity, price }) => [0, 0, {
      product_id: productId,
      product_qty: quantity,
      price_unit: price,
    }]),
  });
}

async function order(api: OdooApiClient, id: number) {
  const rows = await api.searchRead('purchase.order', [['id', '=', id]], [
    'name', 'state', 'amount_untaxed', 'partner_id', 'picking_ids', 'order_line',
  ]);
  expect(rows).toHaveLength(1);
  return rows[0];
}

async function createProduct(api: OdooApiClient, suffix: string) {
  const templateId = await api.create('product.template', {
    name: `QA Product ${suffix}`,
    purchase_ok: true,
    sale_ok: false,
    type: 'consu',
    is_storable: true,
  });
  const products = await api.searchRead('product.product', [['product_tmpl_id', '=', templateId]], ['id', 'name']);
  expect(products).toHaveLength(1);
  return Number(products[0].id);
}

test('TC04 partial receipt creates a backorder for the remaining quantity', async ({ request, testData }) => {
  const api = new OdooApiClient(request);
  const poId = await createOrder(api, testData.vendorId, [{ productId: testData.productId, quantity: 10, price: 50 }]);
  await api.execute('purchase.order', 'button_confirm', [poId]);
  const confirmed = await order(api, poId);
  const pickingId = Number(confirmed.picking_ids[0]);
  const moves = await api.searchRead('stock.move', [['picking_id', '=', pickingId]], ['id', 'product_uom_qty', 'quantity']);
  expect(moves).toHaveLength(1);
  await api.write('stock.move', [Number(moves[0].id)], { quantity: 6 });
  const validation = await api.execute('stock.picking', 'button_validate', [pickingId]);
  if (validation && typeof validation === 'object' && validation.res_model === 'stock.backorder.confirmation') {
    const wizardId = await api.create('stock.backorder.confirmation', {
      pick_ids: [[6, 0, [pickingId]]],
    });
    await api.execute('stock.backorder.confirmation', 'process', [wizardId], { context: validation.context });
  }
  const receipts = await api.searchRead('stock.picking', [['origin', '=', confirmed.name]], ['state', 'backorder_id', 'move_ids']);
  expect(receipts.some((receipt: any) => receipt.state === 'done')).toBeTruthy();
  expect(receipts.some((receipt: any) => receipt.state !== 'done' && receipt.backorder_id)).toBeTruthy();
});

test('TC05 cancelling a draft RFQ sets it to cancelled and creates no receipt', async ({ request, testData }) => {
  const api = new OdooApiClient(request);
  const poId = await createOrder(api, testData.vendorId, [{ productId: testData.productId, quantity: 2, price: 10 }]);
  await api.execute('purchase.order', 'button_cancel', [poId]);
  const cancelled = await order(api, poId);
  expect(cancelled.state).toBe('cancel');
  expect(cancelled.picking_ids).toEqual([]);
});

test('TC06 cancelling a confirmed PO cancels its unprocessed receipt', async ({ request, testData }) => {
  const api = new OdooApiClient(request);
  const poId = await createOrder(api, testData.vendorId, [{ productId: testData.productId, quantity: 3, price: 10 }]);
  await api.execute('purchase.order', 'button_confirm', [poId]);
  const confirmed = await order(api, poId);
  expect(confirmed.picking_ids).toHaveLength(1);
  await api.execute('purchase.order', 'button_cancel', [poId]);
  const cancelled = await order(api, poId);
  const receipts = await api.searchRead('stock.picking', [['id', 'in', confirmed.picking_ids]], ['state']);
  expect(cancelled.state).toBe('cancel');
  expect(receipts.every((receipt: any) => receipt.state === 'cancel')).toBeTruthy();
});

test('TC07 a three-line PO creates a receipt containing all three products', async ({ request, testData }) => {
  const api = new OdooApiClient(request);
  const suffix = `${Date.now()}`;
  const secondProduct = await createProduct(api, `${suffix}-2`);
  const thirdProduct = await createProduct(api, `${suffix}-3`);
  const productIds = [testData.productId, secondProduct, thirdProduct];
  const poId = await createOrder(api, testData.vendorId, [
    { productId: productIds[0], quantity: 1, price: 10 },
    { productId: productIds[1], quantity: 2, price: 20 },
    { productId: productIds[2], quantity: 3, price: 30 },
  ]);
  await api.execute('purchase.order', 'button_confirm', [poId]);
  const confirmed = await order(api, poId);
  const moves = await api.searchRead('stock.move', [['picking_id', '=', Number(confirmed.picking_ids[0])]], ['product_id', 'product_uom_qty']);
  expect(moves).toHaveLength(3);
  expect(moves.map((move: any) => Number(move.product_id[0])).sort()).toEqual([...productIds].sort());
});

test('TC09 quantity 7 at 13.50 produces an untaxed total of 94.50', async ({ request, testData }) => {
  const api = new OdooApiClient(request);
  const poId = await createOrder(api, testData.vendorId, [{ productId: testData.productId, quantity: 7, price: 13.5 }]);
  const draft = await order(api, poId);
  expect(Number(draft.amount_untaxed)).toBeCloseTo(94.5, 2);
});

test('TC10 the receipt vendor matches the purchase-order vendor', async ({ request, testData }) => {
  const api = new OdooApiClient(request);
  const poId = await createOrder(api, testData.vendorId, [{ productId: testData.productId, quantity: 1, price: 10 }]);
  await api.execute('purchase.order', 'button_confirm', [poId]);
  const confirmed = await order(api, poId);
  const receipts = await api.searchRead('stock.picking', [['id', '=', Number(confirmed.picking_ids[0])]], ['partner_id']);
  expect(Number(receipts[0].partner_id[0])).toBe(testData.vendorId);
});
