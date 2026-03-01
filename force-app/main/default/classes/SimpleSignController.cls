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

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getLatestSignature(String relatedFieldName, String parentRecordId) {
        if (String.isBlank(relatedFieldName) || String.isBlank(parentRecordId)) {
            return null;
        }

        if (!Schema.sObjectType.Signature__c.isAccessible()) {
            throw new AuraHandledException('Insufficient permissions to read Signature records.');
        }

        Schema.SObjectField field = Schema.sObjectType.Signature__c.fields.getMap().get(relatedFieldName);
        if (field == null) {
            throw new AuraHandledException('Invalid field: ' + relatedFieldName);
        }

        Schema.DescribeFieldResult fieldDescribe = field.getDescribe();
        if (fieldDescribe.getType() != Schema.DisplayType.REFERENCE) {
            throw new AuraHandledException('Field must be a lookup or master-detail field: ' + relatedFieldName);
        }

        if (!fieldDescribe.isAccessible()) {
            throw new AuraHandledException('Insufficient permissions for field: ' + relatedFieldName);
        }

        Id validParentId;
        try {
            validParentId = Id.valueOf(parentRecordId);
        } catch (Exception e) {
            throw new AuraHandledException('Invalid parent record ID format.');
        }

        String query = 'SELECT Id, SignatureImage__c, CreatedDate, CreatedBy.Name'
            + ' FROM Signature__c'
            + ' WHERE ' + String.escapeSingleQuotes(fieldDescribe.getName()) + ' = :validParentId'
            + ' ORDER BY CreatedDate DESC, Id DESC'
            + ' LIMIT 1';

        List<Signature__c> results = Database.query(query);
        if (results.isEmpty()) {
            return null;
        }

        Signature__c sig = results[0];
        Map<String, Object> result = new Map<String, Object>();
        result.put('id', sig.Id);
        result.put('signatureImage', sig.SignatureImage__c);
        result.put('createdDate', sig.CreatedDate);
        result.put('createdByName', sig.CreatedBy.Name);
        return result;
    }
}
