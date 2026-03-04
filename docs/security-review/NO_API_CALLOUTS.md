# Simple Sign — Sample API Callouts

## Statement

**Simple Sign does not make any HTTP callouts to external APIs or web services.**

The solution is 100% native to the Salesforce Platform. All communication occurs within the subscriber org:

- **LWC to Apex**: Via Salesforce Lightning Data Service (LDS). No HTTP requests are made by the package.
- **Apex to database**: Standard DML and SOQL against the `Signature__c` custom object.
- **No `Http`, `HttpRequest`, `HttpResponse`, `Callout`**: The package contains no callout code.

## Relevant Code

- **SimpleSignController.cls**: Two `@AuraEnabled` methods only. No `Http`, no `@future(callout=true)`, no `Queueable` with callouts.
- **LWC components**: Use `Wire`/`Imperative` Apex calls. Data flows through the Salesforce framework, not external endpoints.

## Documentation

Because there are no API callouts, there are no sample HTTP requests or responses to provide. This document serves as the required "Sample API Callouts" submission, stating that the solution has no external API integration.
