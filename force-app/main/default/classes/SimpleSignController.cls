public with sharing class SimpleSignController {
    @AuraEnabled
    public static Id saveSignature(String base64Image, String relatedFieldName, String parentRecordId) {
        if (String.isBlank(base64Image)) {
            throw new AuraHandledException('Signature image data is required.');
        }

        if (!Schema.sObjectType.Signature__c.isCreateable()) {
            throw new AuraHandledException('Insufficient permissions to create Signature records.');
        }

        if (!Schema.sObjectType.Signature__c.fields.SignatureImage__c.isCreateable()) {
            throw new AuraHandledException('Insufficient field-level permissions for Signature Image.');
        }

        Signature__c sig = new Signature__c(SignatureImage__c = base64Image);

        if (String.isNotBlank(relatedFieldName) && String.isNotBlank(parentRecordId)) {
            Schema.SObjectField field = Schema.sObjectType.Signature__c.fields.getMap().get(relatedFieldName);
            if (field == null) {
                throw new AuraHandledException('Invalid field: ' + relatedFieldName);
            }

            Schema.DescribeFieldResult fieldDescribe = field.getDescribe();
            if (fieldDescribe.getType() != Schema.DisplayType.REFERENCE) {
                throw new AuraHandledException('Field must be a lookup or master-detail field: ' + relatedFieldName);
            }

            if (!fieldDescribe.isCreateable()) {
                throw new AuraHandledException('Insufficient permissions for field: ' + relatedFieldName);
            }

            try {
                Id validParentId = Id.valueOf(parentRecordId);
                sig.put(relatedFieldName, validParentId);
            } catch (Exception e) {
                throw new AuraHandledException('Invalid parent record ID format.');
            }
        }

        try {
            insert sig;
        } catch (DmlException e) {
            throw new AuraHandledException(e.getDmlMessage(0));
        }

        return sig.Id;
    }
}
