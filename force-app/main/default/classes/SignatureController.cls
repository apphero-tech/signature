public with sharing class SignatureController {
    @AuraEnabled
    public static Id saveSignature(String base64Image, String relatedFieldName, String parentRecordId) {
        Signature__c sig = new Signature__c(SignatureImage__c = base64Image);
        if (String.isNotBlank(relatedFieldName) && String.isNotBlank(parentRecordId)) {
            sig.put(relatedFieldName, parentRecordId);
        }
        insert sig;
        return sig.Id;
    }
} 