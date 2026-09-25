# Findings

## Verified behavior

- Odoo 19.0 starts at `http://localhost:8069` with database `p2p`.
- Purchase and Inventory modules install successfully from command-line initialization.
- A confirmed RFQ creates a receipt in Ready state.
- Validating the full receipt changes it to Done, updates the PO line Received quantity, and increases product On Hand stock.
- In the walkthrough, P00001 received 10 Test Bolts and WH/IN/00001 finished in Done state.

## Automation notes

- Stable technical fields include `partner_id`, `product_id`, `product_qty`, `qty_received`, `state`, and `qty_available`.
- The API client uses JSON-2 POST endpoints with bearer authorization and `X-Odoo-Database` headers.
- The valid-key API test is skipped until a local API key is placed in `.env`; the invalid-key test runs without it.
- Purchase-flow UI tests are initial scaffolding and need further live-flow refinement before the entire suite is expected to pass.

## Follow-up

- Create a disposable API key for local and CI test runs without committing it.
- Complete partial-receipt, cancellation, and multi-line UI coverage.
- Add CI API-key creation and publish the Playwright report through GitHub Pages.
