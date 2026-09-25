# Odoo Procure-to-Receipt Test Automation

End-to-end UI, API, and database checks for the Odoo 19 purchase-to-receipt flow. The project uses Playwright and TypeScript, runs Odoo and PostgreSQL in Docker, and is wired for GitHub Actions.

## Flow covered

Vendor -> tracked Goods product -> RFQ -> purchase order -> receipt -> validation -> received quantity and on-hand stock.

## Test layers

| Layer | Tool | Location |
| --- | --- | --- |
| UI | Playwright + TypeScript + Page Objects | `tests/ui`, `pages` |
| API | Odoo JSON-2 API | `tests/api`, `api` |
| Database | PostgreSQL via `pg` | `tests/db`, `db` |
| Manual | Exploratory cases and field notes | `docs/test-cases.md` |

## Run locally

```powershell
docker compose up -d db
docker compose run --rm odoo odoo -d p2p -i purchase,stock --stop-after-init
docker compose up -d odoo
npm ci
npx playwright install chromium
Copy-Item .env.example .env
npx playwright test
npx playwright show-report
```

Add `ODOO_API_KEY` to `.env` to enable the valid-key API test; never commit `.env`.

## Project structure

```text
pages/       Odoo Page Objects
api/         JSON-2 API client
db/          PostgreSQL client
tests/ui/    UI tests
tests/api/   API tests
tests/db/    Database checks
docs/        Manual cases, strategy, and findings
```

See [docs/test-strategy.md](docs/test-strategy.md), [docs/test-cases.md](docs/test-cases.md), and [docs/findings.md](docs/findings.md).
