# Simple Sign — Project Memory

## Product

- **Name:** Simple Sign
- **Publisher:** apphero, Inc.
- **Namespace:** `aph`
- **Package Type:** Managed 2GP
- **API Version:** 66.0
- **Platform:** Salesforce Lightning Experience

## Key References

- [Improve Your AppExchange Listing Performance (PDF)](https://www.salesforce.com/en-us/wp-content/uploads/sites/4/documents/partners/readiness/improve-your-appexchange-performance.pdf) — Official Salesforce guide for optimizing AppExchange listings (copy, design, conversion)
- [ISVforce Guide — Spring '26 (PDF)](https://resources.docs.salesforce.com/latest/latest/en-us/sfdc/pdf/salesforce_packaging_guide.pdf) — Complete packaging and listing reference
- [AppExchange Partner Console Guide (PDF)](https://www.salesforce.com/en-us/wp-content/uploads/sites/4/documents/partners/readiness/the_appexchange_partner_console_guide.pdf) — Logo specs, listing builder fields
- [Trailhead — AppExchange Partners Publishing](https://trailhead.salesforce.com/content/learn/modules/appexchange-partners-publishing) — Listing builder walkthrough
- [AppExchange SEO Optimization Checklist 2026](https://www.sfapps.info/appexchange-listing-seo-optimization-checklist-to-improve-listing-visibility/)

## Competitors

- **BrightSIGN** (BrightGen/Credera) — Free, stores as attachment/file, no Flow support
- **EZSign** — Paid ($5+/user/mo), native capture
- **Simple Signature** (autre produit) — Paid ($1/user/mo), document generation focus
- **Docusign** — Enterprise, external service, full document workflow

## Architecture

- 3 LWC components: `simpleSignCapture`, `simpleSignViewer`, `simpleSignSetup`
- 1 Apex controller: `SimpleSignController` (with sharing, CRUD/FLS enforced)
- 1 Custom object: `Signature__c` (auto-number SIG-{0000}, base64 PNG storage)
- 2 Permission sets: `SimpleSignUser`, `SimpleSignAdmin`
- Custom Labels: English (en_US) + French (fr)

## Docs

- `docs/APPEXCHANGE_LISTING.md` — Full AppExchange submission guide (title, tagline, description, pricing, screenshots, checklist)
- `docs/BUSINESS_DOCUMENT_PROMPT.md` — AI documentation generation prompt
- `docs/RELEASE_NOTES_PROMPT.md` — Release notes generation prompt
