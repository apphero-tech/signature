@IsTest
private class SimpleSignControllerTest {

    private static final String BASE64_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    @TestSetup
    static void setup() {
        Profile minProfile = [SELECT Id FROM Profile WHERE Name = 'Minimum Access - Salesforce' LIMIT 1];
        insert new User(
            Alias = 'minusr',
            Email = 'minuser@simplesign.test',
            EmailEncodingKey = 'UTF-8',
            LastName = 'MinUser',
            LanguageLocaleKey = 'en_US',
            LocaleSidKey = 'en_US',
            ProfileId = minProfile.Id,
            TimeZoneSidKey = 'America/New_York',
            Username = 'minuser' + System.currentTimeMillis() + '@simplesign.test'
        );
    }

    @IsTest
    static void testSaveSignatureWithoutRelatedField() {
        Test.startTest();
        Id signatureId = SimpleSignController.saveSignature(BASE64_IMAGE, null, null);
        Test.stopTest();

        Assert.isNotNull(signatureId, 'Signature record should be created');
        Signature__c saved = [SELECT SignatureImage__c FROM Signature__c WHERE Id = :signatureId];
        Assert.areEqual(BASE64_IMAGE, saved.SignatureImage__c, 'Stored image should match input');
    }

    @IsTest
    static void testSaveSignatureWithEmptyRelatedField() {
        Test.startTest();
        Id signatureId = SimpleSignController.saveSignature(BASE64_IMAGE, '', '');
        Test.stopTest();

        Assert.isNotNull(signatureId, 'Signature record should be created');
        Signature__c saved = [SELECT SignatureImage__c FROM Signature__c WHERE Id = :signatureId];
        Assert.areEqual(BASE64_IMAGE, saved.SignatureImage__c, 'Stored image should match input');
    }

    @IsTest
    static void testSaveSignatureWithLargeImage() {
        String largeImage = 'data:image/png;base64,';
        for (Integer i = 0; i < 100; i++) {
            largeImage += 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk';
        }

        Test.startTest();
        Id signatureId = SimpleSignController.saveSignature(largeImage, null, null);
        Test.stopTest();

        Signature__c saved = [SELECT SignatureImage__c FROM Signature__c WHERE Id = :signatureId];
        Assert.areEqual(largeImage, saved.SignatureImage__c, 'Large image should be stored correctly');
    }

    @IsTest
    static void testSaveMultipleSignatures() {
        Test.startTest();
        Id id1 = SimpleSignController.saveSignature('data:image/png;base64,sig1', null, null);
        Id id2 = SimpleSignController.saveSignature('data:image/png;base64,sig2', null, null);
        Test.stopTest();

        Assert.areNotEqual(id1, id2, 'Each signature should have a unique ID');
        Assert.areEqual(2, [SELECT COUNT() FROM Signature__c], 'Two signatures should exist');
    }

    @IsTest
    static void testSaveSignatureWithBlankImage() {
        Test.startTest();
        try {
            SimpleSignController.saveSignature('', null, null);
            Assert.fail('Should have thrown for blank image');
        } catch (AuraHandledException e) {
            Assert.areEqual('Signature image data is required.', e.getMessage(),
                'Error message should indicate missing image data');
        }
        Test.stopTest();
    }

    @IsTest
    static void testSaveSignatureWithNullImage() {
        Test.startTest();
        try {
            SimpleSignController.saveSignature(null, null, null);
            Assert.fail('Should have thrown for null image');
        } catch (AuraHandledException e) {
            Assert.areEqual('Signature image data is required.', e.getMessage(),
                'Error message should indicate missing image data');
        }
        Test.stopTest();
    }

    @IsTest
    static void testSaveSignatureWithInvalidFormat() {
        Test.startTest();
        try {
            SimpleSignController.saveSignature('not-a-valid-image', null, null);
            Assert.fail('Should have thrown for invalid format');
        } catch (AuraHandledException e) {
            Assert.areEqual('Invalid signature image format.', e.getMessage(),
                'Error message should indicate invalid format');
        }
        Test.stopTest();
    }

    @IsTest
    static void testSaveSignatureWithInvalidFieldName() {
        Test.startTest();
        try {
            SimpleSignController.saveSignature(BASE64_IMAGE, 'NonExistentField__c', '001000000000001AAA');
            Assert.fail('Should have thrown for invalid field');
        } catch (AuraHandledException e) {
            Assert.areEqual('The specified lookup field does not exist on the Signature object.', e.getMessage(),
                'Error message should indicate field does not exist');
        }
        Test.stopTest();
    }

    @IsTest
    static void testSaveSignatureWithNonLookupField() {
        Test.startTest();
        try {
            SimpleSignController.saveSignature(BASE64_IMAGE, 'Name', '001000000000001AAA');
            Assert.fail('Should have thrown for non-lookup field');
        } catch (AuraHandledException e) {
            Assert.areEqual('The specified field must be a lookup or master-detail relationship.', e.getMessage(),
                'Error message should indicate field must be a relationship');
        }
        Test.stopTest();
    }

    @IsTest
    static void testSaveSignatureWithInvalidParentId() {
        Test.startTest();
        try {
            SimpleSignController.saveSignature(BASE64_IMAGE, 'OwnerId', 'not-a-valid-id');
            Assert.fail('Should have thrown for invalid parent ID');
        } catch (AuraHandledException e) {
            Assert.areEqual('Invalid parent record ID format.', e.getMessage(),
                'Error message should indicate invalid ID format');
        }
        Test.stopTest();
    }

    @IsTest
    static void testSaveSignatureWithValidOwnerLookup() {
        User currentUser = [SELECT Id FROM User WHERE Id = :UserInfo.getUserId()];

        Test.startTest();
        Id signatureId = SimpleSignController.saveSignature(BASE64_IMAGE, 'OwnerId', currentUser.Id);
        Test.stopTest();

        Signature__c saved = [SELECT OwnerId, SignatureImage__c FROM Signature__c WHERE Id = :signatureId];
        Assert.areEqual(currentUser.Id, saved.OwnerId, 'Owner should match specified parent');
        Assert.areEqual(BASE64_IMAGE, saved.SignatureImage__c, 'Stored image should match input');
    }

    @IsTest
    static void testSaveSignatureWithNoCreatePermission() {
        User minUser = [SELECT Id FROM User WHERE Email = 'minuser@simplesign.test' LIMIT 1];

        Test.startTest();
        System.runAs(minUser) {
            try {
                SimpleSignController.saveSignature(BASE64_IMAGE, null, null);
                Assert.fail('Should have thrown for no CRUD access');
            } catch (AuraHandledException e) {
                Assert.areEqual('Insufficient permissions to create Signature records.', e.getMessage(),
                    'Error message should indicate insufficient permissions');
            }
        }
        Test.stopTest();
    }
}
