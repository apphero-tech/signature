# Simple Sign — False Positive Documentation

> For AppExchange Security Review — Source Scanner (Checkmarx) and Salesforce Code Analyzer findings.

---

## Finding: FLS Create — Signature__c.SignatureImage__c

| Attribute | Value |
|-----------|-------|
| **Query** | FLS Create |
| **Group** | Apex Serious Security Risk |
| **File** | `classes/SimpleSignController.cls` |
| **Object** | `Signature__c` |
| **Field** | `SignatureImage__c` |

### Why This Is a False Positive

The Source Scanner description states:

> *"This may be a false positive if your code accesses only objects whose security is managed by your app and not the admin."*

This applies directly to Simple Sign:

1. **Package-managed object**: `Signature__c` is a custom object defined inside the Simple Sign managed package (`aph` namespace). It is not an org-standard object or an object created by the subscriber admin.

2. **Package-managed permissions**: CRUD and FLS for `Signature__c` and all its fields (including `SignatureImage__c`) are granted exclusively through the package's permission sets:
   - **Simple Sign User** (`SimpleSignUser`) — Create, Read on `Signature__c`; Read/Edit on `SignatureImage__c`
   - **Simple Sign Admin** (`SimpleSignAdmin`) — Full CRUD on `Signature__c`; Read/Edit on `SignatureImage__c`

   Without one of these permission sets assigned, a user has zero access to the object.

3. **USER_MODE DML enforcement**: The `insert` operation uses `Database.insert(sig, AccessLevel.USER_MODE)`, which enforces CRUD and FLS at the platform level. If the running user lacks Create permission on `Signature__c` or Edit permission on `SignatureImage__c`, the platform throws a `DmlException` before any record is written.

4. **USER_MODE SOQL enforcement**: The `SELECT` query uses `Database.query(query, AccessLevel.USER_MODE)`, which enforces object and field accessibility at the platform level.

5. **with sharing**: The controller class uses `with sharing`, enforcing row-level security (sharing rules, org-wide defaults).

### Security Controls Summary

| Layer | Mechanism | Scope |
|-------|-----------|-------|
| **Object CRUD** | `AccessLevel.USER_MODE` on DML and SOQL | Platform-enforced |
| **Field FLS** | `AccessLevel.USER_MODE` on DML and SOQL | Platform-enforced |
| **Row-level security** | `with sharing` | Controller-level |
| **Input validation** | Format check, Id validation, field type check | Controller-level |
| **Permission grants** | Package permission sets only | Package-level |

### Conclusion

No user can create or read `Signature__c` records without an explicitly assigned permission set from the package. The DML and SOQL operations use `AccessLevel.USER_MODE`, which is the Salesforce-recommended pattern for enforcing CRUD/FLS at the platform level (Spring '23+). This finding is a false positive.

---

## Finding: ApexSOQLInjection — Salesforce Code Analyzer (PMD)

| Attribute | Value |
|-----------|-------|
| **Rule** | ApexSOQLInjection |
| **Engine** | PMD |
| **Severity** | High (2) |
| **File** | `SimpleSignController.cls`, line 79 |
| **Message** | "Avoid untrusted/unescaped variables in DML query" |

### Why This Is a False Positive

PMD flags any `Database.query()` call that uses a string variable. It does not perform semantic analysis to determine whether the variable content is safe.

In `getLatestSignature`, the dynamic field name in the SOQL WHERE clause goes through three layers of validation before reaching the query:

1. **Schema validation**: `Schema.sObjectType.Signature__c.fields.getMap().get(relatedFieldName)` — the field name must exist on `Signature__c`. If it doesn't, the method throws an exception. No arbitrary string can reach the query.

2. **Type validation**: `fieldDescribe.getType() != Schema.DisplayType.REFERENCE` — the field must be a lookup or master-detail relationship. This further restricts the set of valid values to a handful of reference fields.

3. **Canonical name**: `fieldDescribe.getName()` returns the API name from the schema describe result, not the raw user input. Even if the user passes `"ownerid"`, the describe returns `"OwnerId"` — the canonical form.

4. **Escape**: `String.escapeSingleQuotes()` is applied to the describe name as defense in depth.

5. **Bind variable**: The filter value (`validParentId`) is a bind variable (`:validParentId`), not concatenated into the query string. It is also validated via `Id.valueOf()` before use.

### Conclusion

The dynamic portion of the query is a field name validated against the schema, not raw user input. No SOQL injection is possible. This is a known PMD limitation — it flags all dynamic queries regardless of context.
