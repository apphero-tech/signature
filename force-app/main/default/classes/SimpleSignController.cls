public with sharing class SimpleSignController {

    private static final String BASE64_PNG_PREFIX = 'data:image/png;base64,';

    @AuraEnabled
    public static Id saveSignature(String base64Image, String relatedFieldName, String parentRecordId) {
        if (String.isBlank(base64Image)) {
            throw buildException('Signature image data is required.');
        }

        if (!base64Image.startsWith(BASE64_PNG_PREFIX)) {
            throw buildException('Invalid signature image format.');
        }

        Signature__c sig = new Signature__c();
        sig.put('SignatureImage__c', base64Image);

        if (String.isNotBlank(relatedFieldName) && String.isNotBlank(parentRecordId)) {
            Schema.SObjectField field = Schema.sObjectType.Signature__c.fields.getMap().get(relatedFieldName);
            if (field == null) {
                throw buildException('The specified lookup field does not exist on the Signature object.');
            }

            Schema.DescribeFieldResult fieldDescribe = field.getDescribe();
            if (fieldDescribe.getType() != Schema.DisplayType.REFERENCE) {
                throw buildException('The specified field must be a lookup or master-detail relationship.');
            }

            try {
                Id validParentId = Id.valueOf(parentRecordId);
                sig.put(relatedFieldName, validParentId);
            } catch (Exception e) {
                throw buildException('Invalid parent record ID format.');
            }
        }

        try {
            Database.insert(sig, AccessLevel.USER_MODE);
        } catch (SecurityException e) {
            throw buildException('Insufficient permissions to create Signature records.');
        } catch (DmlException e) {
            throw buildException(e.getDmlMessage(0));
        }

        return sig.Id;
    }

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getLatestSignature(String relatedFieldName, String parentRecordId) {
        if (String.isBlank(relatedFieldName) || String.isBlank(parentRecordId)) {
            return null;
        }

        Schema.SObjectField field = Schema.sObjectType.Signature__c.fields.getMap().get(relatedFieldName);
        if (field == null) {
            throw buildException('The specified lookup field does not exist on the Signature object.');
        }

        Schema.DescribeFieldResult fieldDescribe = field.getDescribe();
        if (fieldDescribe.getType() != Schema.DisplayType.REFERENCE) {
            throw buildException('The specified field must be a lookup or master-detail relationship.');
        }

        Id validParentId;
        try {
            validParentId = Id.valueOf(parentRecordId);
        } catch (Exception e) {
            throw buildException('Invalid parent record ID format.');
        }

        String query = 'SELECT Id, SignatureImage__c, CreatedDate, CreatedBy.Name'
            + ' FROM Signature__c'
            + ' WHERE ' + String.escapeSingleQuotes(fieldDescribe.getName()) + ' = :validParentId'
            + ' ORDER BY CreatedDate DESC, Id DESC'
            + ' LIMIT 1';

        List<Signature__c> results;
        try {
            results = Database.query(query, AccessLevel.USER_MODE);
        } catch (Exception e) {
            throw buildException('Insufficient permissions to read Signature records.');
        }
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

    private static AuraHandledException buildException(String message) {
        AuraHandledException ex = new AuraHandledException(message);
        ex.setMessage(message);
        return ex;
    }
}
