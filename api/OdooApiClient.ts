import { APIRequestContext, expect } from '@playwright/test';

export class OdooApiClient {
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
    const response = await this.call(model, 'search_read', { domain, fields }, apiKey);
    await expect(response).toBeOK();
    return response.json();
  }
}
