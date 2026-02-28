@IsTest
private class SignatureControllerTest {
    
    @IsTest
    static void testSaveSignatureWithoutRelatedField() {
        // Test saving a signature without linking to a parent record
        String base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        
        Test.startTest();
        Id signatureId = SignatureController.saveSignature(base64Image, null, null);
        Test.stopTest();
        
        System.assertNotEquals(null, signatureId, 'Signature record should be created');
        
        Signature__c savedSignature = [SELECT Id, SignatureImage__c FROM Signature__c WHERE Id = :signatureId];
        System.assertEquals(base64Image, savedSignature.SignatureImage__c, 'Signature image should be saved correctly');
    }
    
    @IsTest
    static void testSaveSignatureWithEmptyRelatedField() {
        // Test saving a signature with empty related field values
        String base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        
        Test.startTest();
        Id signatureId = SignatureController.saveSignature(base64Image, '', '');
        Test.stopTest();
        
        System.assertNotEquals(null, signatureId, 'Signature record should be created with empty related fields');
        
        Signature__c savedSignature = [SELECT Id, SignatureImage__c FROM Signature__c WHERE Id = :signatureId];
        System.assertEquals(base64Image, savedSignature.SignatureImage__c, 'Signature image should be saved correctly');
    }
    
    @IsTest
    static void testSaveSignatureWithLargeImage() {
        // Test saving a larger base64 signature
        String base64Image = 'data:image/png;base64,';
        // Generate a larger base64 string to simulate real signature data
        for (Integer i = 0; i < 100; i++) {
            base64Image += 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk';
        }
        
        Test.startTest();
        Id signatureId = SignatureController.saveSignature(base64Image, null, null);
        Test.stopTest();
        
        System.assertNotEquals(null, signatureId, 'Signature record should be created with large image');
        
        Signature__c savedSignature = [SELECT Id, SignatureImage__c FROM Signature__c WHERE Id = :signatureId];
        System.assertEquals(base64Image, savedSignature.SignatureImage__c, 'Large signature image should be saved correctly');
    }
    
    @IsTest
    static void testSaveMultipleSignatures() {
        // Test saving multiple signatures
        String base64Image1 = 'data:image/png;base64,signature1base64data';
        String base64Image2 = 'data:image/png;base64,signature2base64data';
        
        Test.startTest();
        Id signatureId1 = SignatureController.saveSignature(base64Image1, null, null);
        Id signatureId2 = SignatureController.saveSignature(base64Image2, null, null);
        Test.stopTest();
        
        System.assertNotEquals(signatureId1, signatureId2, 'Each signature should have a unique ID');
        
        List<Signature__c> signatures = [SELECT Id, SignatureImage__c FROM Signature__c ORDER BY CreatedDate];
        System.assertEquals(2, signatures.size(), 'Two signatures should be created');
    }

    @IsTest
    static void testSaveSignatureWithBlankImage() {
        Test.startTest();
        try {
            SignatureController.saveSignature('', null, null);
            System.assert(false, 'Expected AuraHandledException for blank image');
        } catch (AuraHandledException e) {
            System.assert(
                e.getMessage().contains('Signature image data is required'),
                'Expected error about required image data, got: ' + e.getMessage()
            );
        }
        Test.stopTest();
    }

    @IsTest
    static void testSaveSignatureWithNullImage() {
        Test.startTest();
        try {
            SignatureController.saveSignature(null, null, null);
            System.assert(false, 'Expected AuraHandledException for null image');
        } catch (AuraHandledException e) {
            System.assert(
                e.getMessage().contains('Signature image data is required'),
                'Expected error about required image data, got: ' + e.getMessage()
            );
        }
        Test.stopTest();
    }

    @IsTest
    static void testSaveSignatureWithInvalidFieldName() {
        String base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

        Test.startTest();
        try {
            SignatureController.saveSignature(base64Image, 'NonExistentField__c', '001000000000001AAA');
            System.assert(false, 'Expected AuraHandledException for invalid field');
        } catch (AuraHandledException e) {
            System.assert(
                e.getMessage().contains('Invalid field'),
                'Expected error about invalid field, got: ' + e.getMessage()
            );
        }
        Test.stopTest();
    }

    @IsTest
    static void testSaveSignatureWithNonLookupField() {
        String base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

        Test.startTest();
        try {
            // SignatureImage__c is a LongTextArea, not a lookup field
            SignatureController.saveSignature(base64Image, 'SignatureImage__c', '001000000000001AAA');
            System.assert(false, 'Expected AuraHandledException for non-lookup field');
        } catch (AuraHandledException e) {
            System.assert(
                e.getMessage().contains('lookup or master-detail'),
                'Expected error about field type, got: ' + e.getMessage()
            );
        }
        Test.stopTest();
    }

    @IsTest
    static void testSaveSignatureWithInvalidParentId() {
        String base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

        Test.startTest();
        try {
            // OwnerId is a valid lookup field on all custom objects
            SignatureController.saveSignature(base64Image, 'OwnerId', 'not-a-valid-id');
            System.assert(false, 'Expected AuraHandledException for invalid parent ID');
        } catch (AuraHandledException e) {
            System.assert(
                e.getMessage().contains('Invalid parent record ID'),
                'Expected error about invalid parent ID format, got: ' + e.getMessage()
            );
        }
        Test.stopTest();
    }
}
