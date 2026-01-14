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
}
