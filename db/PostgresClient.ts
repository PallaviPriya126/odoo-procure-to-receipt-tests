import { Pool, QueryResultRow } from 'pg';

export class PostgresClient {
  private readonly pool = new Pool({
    host: process.env.PG_HOST || 'localhost',
    port: Number(process.env.PG_PORT || 5432),
    user: process.env.PG_USER || 'odoo',
    password: process.env.PG_PASSWORD || 'odoo',
    database: process.env.PG_DATABASE || 'p2p',
  });

  async query<T extends QueryResultRow = QueryResultRow>(text: string, values: unknown[] = []) {
    return this.pool.query<T>(text, values);
  }

  async close() { await this.pool.end(); }

  async purchaseOrder(reference: string) {
    return this.query(
      'SELECT id, name, state, partner_id FROM purchase_order WHERE name = $1',
      [reference],
    );
  }

  async purchaseLines(orderId: number) {
    return this.query(
      'SELECT product_id, product_qty, qty_received, price_unit FROM purchase_order_line WHERE order_id = $1',
      [orderId],
    );
  }

  async stockReceipts(origin: string) {
    return this.query(
      'SELECT id, name, state, partner_id, origin FROM stock_picking WHERE origin = $1',
      [origin],
    );
  }
}
