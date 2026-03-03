# Simple Sign - Project Notes

## Salesforce 2GP Testing: FLS/CRUD Cache Issue

In 2GP (Second-Generation Package) context with namespace (`aph`), `Schema.sObjectType.*.isCreateable()` and other CRUD/FLS checks are cached per user session. When a Permission Set is assigned in `@TestSetup`, the Schema describe cache is NOT invalidated for subsequent test methods.

**Symptom**: Apex tests fail with "Insufficient permissions" errors even though the Permission Set is correctly assigned in `@TestSetup`.

**Solution**: Use `System.runAs(testUser)` in each `@isTest` method (not just in `@TestSetup`). This forces Salesforce to establish a new user context and re-evaluate CRUD/FLS permissions.

```apex
@isTest
static void testSaveSignature() {
    User testUser = [SELECT Id FROM User WHERE ...];
    System.runAs(testUser) {
        // CRUD/FLS checks will now reflect the assigned Permission Set
        Test.startTest();
        Id result = SimpleSignController.saveSignature(...);
        Test.stopTest();
    }
}
```

This is a known platform behavior, especially prevalent in namespaced 2GP packages where custom object permissions are more restrictive by default.
