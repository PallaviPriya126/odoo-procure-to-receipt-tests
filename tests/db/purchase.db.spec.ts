import { test, expect } from '@playwright/test';
import { PostgresClient } from '../../db/PostgresClient';

test('DB01 validated purchase order has received quantity and receipt', async () => {
  const db = new PostgresClient();
  try {
    const order = await db.purchaseOrder('P00001');
    expect(order.rows).toHaveLength(1);
    expect(order.rows[0].state).toBe('purchase');
    const lines = await db.purchaseLines(order.rows[0].id);
    expect(Number(lines.rows[0].qty_received)).toBe(10);
    const receipts = await db.stockReceipts('P00001');
    expect(receipts.rows.some((row) => row.state === 'done')).toBeTruthy();
  } finally {
    await db.close();
  }
});

test('DB02 Purchase and Inventory modules are installed', async () => {
  const db = new PostgresClient();
  try {
    const result = await db.query<{ name: string; state: string }>(
      'SELECT name, state FROM ir_module_module WHERE name = ANY($1::text[])',
      [['purchase', 'stock']],
    );
    expect(result.rows).toEqual(expect.arrayContaining([
      { name: 'purchase', state: 'installed' },
      { name: 'stock', state: 'installed' },
    ]));
  } finally {
    await db.close();
  }
});
