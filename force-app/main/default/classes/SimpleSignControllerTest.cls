@IsTest
private class SimpleSignControllerTest {

    private static final String BASE64_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    @IsTest
    static void testSaveSignatureWithoutRelatedField() {
        Test.startTest();
        Id signatureId = SimpleSignController.saveSignature(BASE64_IMAGE, null, null);
        Test.stopTest();

        System.assertNotEquals(null, signatureId, 'Signature record should be created');
        Signature__c saved = [SELECT SignatureImage__c FROM Signature__c WHERE Id = :signatureId];
        System.assertEquals(BASE64_IMAGE, saved.SignatureImage__c);
    }

    @IsTest
    static void testSaveSignatureWithEmptyRelatedField() {
        Test.startTest();
        Id signatureId = SimpleSignController.saveSignature(BASE64_IMAGE, '', '');
        Test.stopTest();

        System.assertNotEquals(null, signatureId);
        Signature__c saved = [SELECT SignatureImage__c FROM Signature__c WHERE Id = :signatureId];
        System.assertEquals(BASE64_IMAGE, saved.SignatureImage__c);
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
        System.assertEquals(largeImage, saved.SignatureImage__c);
    }

    @IsTest
    static void testSaveMultipleSignatures() {
        Test.startTest();
        Id id1 = SimpleSignController.saveSignature('data:image/png;base64,sig1', null, null);
        Id id2 = SimpleSignController.saveSignature('data:image/png;base64,sig2', null, null);
        Test.stopTest();

        System.assertNotEquals(id1, id2);
        System.assertEquals(2, [SELECT COUNT() FROM Signature__c]);
    }

    @IsTest
    static void testSaveSignatureWithBlankImage() {
        Test.startTest();
        try {
            SimpleSignController.saveSignature('', null, null);
            System.assert(false, 'Should have thrown');
        } catch (AuraHandledException e) {
            System.assertNotEquals(null, e);
        }
        Test.stopTest();
    }

    @IsTest
    static void testSaveSignatureWithNullImage() {
        Test.startTest();
        try {
            SimpleSignController.saveSignature(null, null, null);
            System.assert(false, 'Should have thrown');
        } catch (AuraHandledException e) {
            System.assertNotEquals(null, e);
        }
        Test.stopTest();
    }

    @IsTest
    static void testSaveSignatureWithInvalidFieldName() {
        Test.startTest();
        try {
            SimpleSignController.saveSignature(BASE64_IMAGE, 'NonExistentField__c', '001000000000001AAA');
            System.assert(false, 'Should have thrown');
        } catch (AuraHandledException e) {
            System.assertNotEquals(null, e);
        }
        Test.stopTest();
    }

    @IsTest
    static void testSaveSignatureWithNonLookupField() {
        Test.startTest();
        try {
            SimpleSignController.saveSignature(BASE64_IMAGE, 'SignatureImage__c', '001000000000001AAA');
            System.assert(false, 'Should have thrown');
        } catch (AuraHandledException e) {
            System.assertNotEquals(null, e);
        }
        Test.stopTest();
    }

    @IsTest
    static void testSaveSignatureWithInvalidParentId() {
        Test.startTest();
        try {
            SimpleSignController.saveSignature(BASE64_IMAGE, 'OwnerId', 'not-a-valid-id');
            System.assert(false, 'Should have thrown');
        } catch (AuraHandledException e) {
            System.assertNotEquals(null, e);
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
        System.assertEquals(currentUser.Id, saved.OwnerId);
        System.assertEquals(BASE64_IMAGE, saved.SignatureImage__c);
    }

    @IsTest
    static void testSaveSignatureWithNoCreatePermission() {
        Profile minProfile = [SELECT Id FROM Profile WHERE Name = 'Minimum Access - Salesforce' LIMIT 1];
        User minUser = new User(
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
        insert minUser;

        Test.startTest();
        System.runAs(minUser) {
            try {
                SimpleSignController.saveSignature(BASE64_IMAGE, null, null);
                System.assert(false, 'Should have thrown for no CRUD access');
            } catch (AuraHandledException e) {
                System.assertNotEquals(null, e);
            }
        }
        Test.stopTest();
    }
}
