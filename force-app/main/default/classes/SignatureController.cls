public with sharing class SignatureController {
    @AuraEnabled
    public static Id saveSignature(String base64Image) {
        Signature__c sig = new Signature__c(SignatureImage__c = base64Image);
        insert sig;
        return sig.Id;
    }
} 