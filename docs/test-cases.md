# Manual test cases: Procure to Receipt

Environment: Odoo 19.0 in Docker, database `p2p`, checked 2026-09-25.

## Technical field notes

These names are the technical fields used by the Odoo purchase and stock models. The displayed labels were verified during the manual walkthrough; names below are the stable automation starting points.

| Business value | Model | Technical field |
| --- | --- | --- |
| Vendor | `purchase.order` | `partner_id` |
| Product on purchase line | `purchase.order.line` | `product_id` |
| Ordered quantity | `purchase.order.line` | `product_qty` |
| Received quantity | `purchase.order.line` | `qty_received` |
| Purchase order status | `purchase.order` | `state` |
| Receipt status | `stock.picking` | `state` |
| Receipt quantity | `stock.move` / `stock.move.line` | `product_uom_qty` / `quantity` |
| Product on hand | `product.product` | `qty_available` |

Observed URLs included `/odoo/purchase/1` for PO P00001 and `/odoo/purchase/1/action-347/1` for receipt WH/IN/00001. Developer mode was enabled with `?debug=1`; the developer menu identified the purchase order model as `purchase.order`.

## Walkthrough result

Created vendor **Test Vendor A** and tracked Goods product **Test Bolt**. Created RFQ **P00001** for 10 units at 50.00 each, confirmed it, opened receipt **WH/IN/00001**, and validated all 10 units. The PO line showed Received = 10 and Test Bolt showed On Hand = 10. Odoo applied the default 15% tax: subtotal 500.00, tax 75.00, total 575.00.

## Test cases

| ID | Title | Steps | Expected | Result |
| --- | --- | --- | --- | --- |
| TC01 | Create RFQ | New RFQ with vendor and one product, quantity 10 | Status RFQ; line total correct | Pass: P00001, subtotal 500.00 |
| TC02 | Confirm RFQ | Confirm Order on TC01 | Status Purchase Order; receipt created | Pass: Purchase Order; one Receipt |
| TC03 | Full receipt | Validate receipt with quantity 10 | Receipt Done; PO received 10; on hand +10 | Pass: WH/IN/00001 Done; received 10; on hand 10 |
| TC04 | Partial receipt | Receive 6 of 10 and create backorder | Receipt Done for 6; backorder for 4 | Not run |
| TC05 | Cancel RFQ | Cancel a draft RFQ | Status Cancelled; no receipt | Not run |
| TC06 | Cancel confirmed PO | Cancel confirmed PO before receipt | Status Cancelled; receipt cancelled | Not run |
| TC07 | Multi-line PO | Three products with different quantities | All three lines appear on receipt | Not run |
| TC08 | Missing vendor | Try to save RFQ without vendor | Error; record not saved | Not run |
| TC09 | Line total | Quantity 7 x price 13.50 | Subtotal 94.50 | Not run |
| TC10 | Vendor on receipt | Confirm PO and open receipt | Receipt partner equals PO vendor | Pass observed: Test Vendor A |
