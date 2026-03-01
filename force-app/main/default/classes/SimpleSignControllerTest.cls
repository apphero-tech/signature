@IsTest
private class SimpleSignControllerTest {

    private static final String BASE64_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    // ─── saveSignature ───────────────────────────────────────────────

    @IsTest
    static void testSaveSignatureWithoutRelatedField() {
        Test.startTest();
        Id signatureId = SimpleSignController.saveSignature(BASE64_IMAGE, null, null);
        Test.stopTest();

        System.assertNotEquals(null, signatureId);
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

    // ─── getLatestSignature ──────────────────────────────────────────

    @IsTest
    static void testGetLatestSignatureReturnsLatest() {
        User currentUser = [SELECT Id FROM User WHERE Id = :UserInfo.getUserId()];

        SimpleSignController.saveSignature('data:image/png;base64,older', 'OwnerId', currentUser.Id);
        SimpleSignController.saveSignature(BASE64_IMAGE, 'OwnerId', currentUser.Id);

        Test.startTest();
        Map<String, Object> result = SimpleSignController.getLatestSignature('OwnerId', currentUser.Id);
        Test.stopTest();

        System.assertNotEquals(null, result);
        System.assertEquals(BASE64_IMAGE, result.get('signatureImage'));
        System.assertNotEquals(null, result.get('createdDate'));
        System.assertNotEquals(null, result.get('createdByName'));
        System.assertNotEquals(null, result.get('id'));
    }

    @IsTest
    static void testGetLatestSignatureNoResults() {
        User currentUser = [SELECT Id FROM User WHERE Id = :UserInfo.getUserId()];

        Test.startTest();
        Map<String, Object> result = SimpleSignController.getLatestSignature('OwnerId', currentUser.Id);
        Test.stopTest();

        System.assertEquals(null, result);
    }

    @IsTest
    static void testGetLatestSignatureBlankParams() {
        Test.startTest();
        Map<String, Object> result1 = SimpleSignController.getLatestSignature(null, null);
        Map<String, Object> result2 = SimpleSignController.getLatestSignature('', '');
        Map<String, Object> result3 = SimpleSignController.getLatestSignature('OwnerId', null);
        Test.stopTest();

        System.assertEquals(null, result1);
        System.assertEquals(null, result2);
        System.assertEquals(null, result3);
    }

    @IsTest
    static void testGetLatestSignatureInvalidField() {
        Test.startTest();
        try {
            SimpleSignController.getLatestSignature('BogusField__c', '001000000000001AAA');
            System.assert(false, 'Should have thrown');
        } catch (AuraHandledException e) {
            System.assertNotEquals(null, e);
        }
        Test.stopTest();
    }

    @IsTest
    static void testGetLatestSignatureNonLookupField() {
        Test.startTest();
        try {
            SimpleSignController.getLatestSignature('SignatureImage__c', '001000000000001AAA');
            System.assert(false, 'Should have thrown');
        } catch (AuraHandledException e) {
            System.assertNotEquals(null, e);
        }
        Test.stopTest();
    }

    @IsTest
    static void testGetLatestSignatureInvalidParentId() {
        Test.startTest();
        try {
            SimpleSignController.getLatestSignature('OwnerId', 'not-valid');
            System.assert(false, 'Should have thrown');
        } catch (AuraHandledException e) {
            System.assertNotEquals(null, e);
        }
        Test.stopTest();
    }

    @IsTest
    static void testGetLatestSignatureNoReadPermission() {
        Profile minProfile = [SELECT Id FROM Profile WHERE Name = 'Minimum Access - Salesforce' LIMIT 1];
        User minUser = new User(
            Alias = 'nordr',
            Email = 'noread@simplesign.test',
            EmailEncodingKey = 'UTF-8',
            LastName = 'NoRead',
            LanguageLocaleKey = 'en_US',
            LocaleSidKey = 'en_US',
            ProfileId = minProfile.Id,
            TimeZoneSidKey = 'America/New_York',
            Username = 'noread' + System.currentTimeMillis() + '@simplesign.test'
        );
        insert minUser;

        Test.startTest();
        System.runAs(minUser) {
            try {
                SimpleSignController.getLatestSignature('OwnerId', UserInfo.getUserId());
                System.assert(false, 'Should have thrown for no read access');
            } catch (AuraHandledException e) {
                System.assertNotEquals(null, e);
            }
        }
        Test.stopTest();
    }
}
