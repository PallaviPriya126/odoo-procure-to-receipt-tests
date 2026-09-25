# Test strategy: Odoo Procure-to-Receipt

## Scope

In scope: vendor and product setup, RFQ creation, purchase-order confirmation, cancellation paths, full and partial receipts, received quantities, on-hand stock, API responses, and database state.

Out of scope: vendor bills and accounting reconciliation, multi-company, multi-currency, reporting, and performance testing.

## Risks

1. A receipt is marked Done but received quantity or stock is not updated.
2. A confirmed purchase order has no usable receipt.
3. A partial receipt loses the remaining quantity instead of creating a backorder.
4. Quantity and unit price produce the wrong line total.
5. UI, API, and database representations disagree.

## Approach

- Start with manual exploratory testing and preserve the cases in `docs/test-cases.md`.
- Automate the highest-risk receipt and stock assertions first.
- Use stable Odoo field and button names, Playwright auto-waiting, and web-first assertions.
- Keep tests independent and use unique test data when creating records.
- Use the API for fast setup and the UI for the user journey; verify important results in PostgreSQL.

## Environments

Local and CI use pinned Odoo 19.0 and PostgreSQL 16 Docker images. CI starts from an empty database on every run.
