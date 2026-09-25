# Rules for this project

## About me

I am a QA engineer learning Playwright and TypeScript. I know Java, Selenium concepts, and manual testing. Explain changes in simple words, comparing to Java, Selenium, or TestNG where useful.

## Project

Playwright and TypeScript tests for Odoo 19 Community (Purchase and Inventory), running locally in Docker at `http://localhost:8069`, database `p2p`. Business flow: vendor -> product -> RFQ -> confirm PO -> receipt -> validate.

## Rules

- Make small changes. One feature per request.
- Keep Page Object locators in `/pages`, never in tests once Page Objects exist.
- Prefer `getByRole`, `getByLabel`, `getByText`, and Odoo's stable `name` attributes.
- Never use fixed waits. Use Playwright auto-waiting and web-first assertions.
- Each test is independent and creates unique data when it needs data.
- Test names start with the manual test case ID.
- Read secrets from `process.env`; never put passwords or API keys in test code.
- Run the relevant tests after changes and report the result.
