import { APIRequestContext, expect } from '@playwright/test';

export class OdooApiClient {
  private authenticated = false;

  constructor(
    private readonly request: APIRequestContext,
    private readonly baseURL = process.env.ODOO_URL || 'http://localhost:8069',
    private readonly apiKey = process.env.ODOO_API_KEY || '',
    private readonly database = process.env.ODOO_DB || 'p2p',
  ) {}

  async call(model: string, method: string, data: unknown, apiKey = this.apiKey) {
    return this.request.post(`${this.baseURL}/json/2/${model}/${method}`, {
      headers: {
        Authorization: `bearer ${apiKey}`,
        'X-Odoo-Database': this.database,
        'Content-Type': 'application/json',
      },
      data,
    });
  }

  async searchRead(model: string, domain: unknown[], fields: string[], apiKey = this.apiKey) {
    if (!apiKey) return this.rpc(model, 'search_read', [domain], { fields });
    const response = await this.call(model, 'search_read', { domain, fields }, apiKey);
    await expect(response).toBeOK();
    return response.json();
  }

  async create(model: string, values: Record<string, unknown>, apiKey = this.apiKey) {
    if (!apiKey) {
      const result = await this.rpc(model, 'create', [[values]]);
      return Array.isArray(result) ? Number(result[0]) : Number(result);
    }
    const response = await this.call(model, 'create', { vals_list: [values] }, apiKey);
    await expect(response).toBeOK();
    const result = await response.json();
    return Array.isArray(result) ? Number(result[0]) : Number(result);
  }

  async write(model: string, ids: number[], values: Record<string, unknown>, apiKey = this.apiKey) {
    if (!apiKey) return this.rpc(model, 'write', [ids, values]);
    const response = await this.call(model, 'write', { ids, vals: values }, apiKey);
    await expect(response).toBeOK();
    return response.json();
  }

  async execute(model: string, method: string, ids: number[], values: Record<string, unknown> = {}, apiKey = this.apiKey) {
    if (!apiKey) return this.rpc(model, method, [ids], values);
    const response = await this.call(model, method, { ids, ...values }, apiKey);
    await expect(response).toBeOK();
    return response.json();
  }

  private async authenticate() {
    if (this.authenticated) return;
    const response = await this.request.post(`${this.baseURL}/web/session/authenticate`, {
      data: {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          db: this.database,
          login: process.env.ODOO_USER || 'admin',
          password: process.env.ODOO_PASSWORD || 'admin',
        },
      },
    });
    await expect(response).toBeOK();
    const body = await response.json();
    if (body.error || !body.result?.uid) throw new Error(`Odoo session authentication failed: ${JSON.stringify(body.error || body.result)}`);
    this.authenticated = true;
  }

  private async rpc(model: string, method: string, args: unknown[], kwargs: Record<string, unknown> = {}) {
    await this.authenticate();
    const response = await this.request.post(`${this.baseURL}/web/dataset/call_kw/${model}/${method}`, {
      data: {
        jsonrpc: '2.0',
        method: 'call',
        params: { model, method, args, kwargs },
      },
    });
    await expect(response).toBeOK();
    const body = await response.json();
    if (body.error) throw new Error(`Odoo RPC ${model}.${method} failed: ${body.error.data?.message || body.error.message}`);
    return body.result;
  }
}
