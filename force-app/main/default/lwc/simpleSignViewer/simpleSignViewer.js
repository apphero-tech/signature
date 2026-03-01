import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue, getFieldDisplayValue } from 'lightning/uiRecordApi';
import getLatestSignature from '@salesforce/apex/SimpleSignController.getLatestSignature';

import SIGNATURE_IMAGE_FIELD from '@salesforce/schema/Signature__c.SignatureImage__c';
import CREATED_DATE_FIELD from '@salesforce/schema/Signature__c.CreatedDate';
import CREATED_BY_NAME_FIELD from '@salesforce/schema/Signature__c.CreatedBy.Name';

import labelSignedOn from '@salesforce/label/c.SimpleSign_SignedBy';
import labelNoSignature from '@salesforce/label/c.SimpleSign_NoSignatureFound';
import labelSignatureImageAlt from '@salesforce/label/c.SimpleSign_SignatureImageAlt';
import labelLastSignature from '@salesforce/label/c.SimpleSign_LastSignature';

export default class SimpleSignViewer extends LightningElement {
    labels = {
        signedOn: labelSignedOn,
        noSignature: labelNoSignature,
        signatureImageAlt: labelSignatureImageAlt,
        lastSignature: labelLastSignature
    };

    @api recordId;
    @api relatedFieldName;

    @wire(getRecord, {
        recordId: '$directRecordId',
        fields: [SIGNATURE_IMAGE_FIELD, CREATED_DATE_FIELD, CREATED_BY_NAME_FIELD]
    })
    signatureRecord;

    @wire(getLatestSignature, {
        relatedFieldName: '$relatedFieldName',
        parentRecordId: '$parentRecordId'
    })
    latestSignatureResult;

    get isLookupMode() {
        return !!this.relatedFieldName;
    }

    get directRecordId() {
        return this.isLookupMode ? null : this.recordId;
    }

    get parentRecordId() {
        return this.isLookupMode ? this.recordId : null;
    }

    get signatureImage() {
        if (this.isLookupMode) {
            return this.latestSignatureResult?.data?.signatureImage || null;
        }
        return getFieldValue(this.signatureRecord?.data, SIGNATURE_IMAGE_FIELD) || null;
    }

    get createdDate() {
        if (this.isLookupMode) {
            return this.latestSignatureResult?.data?.createdDate || null;
        }
        return getFieldValue(this.signatureRecord?.data, CREATED_DATE_FIELD) || null;
    }

    get createdByName() {
        if (this.isLookupMode) {
            return this.latestSignatureResult?.data?.createdByName || null;
        }
        return getFieldDisplayValue(this.signatureRecord?.data, CREATED_BY_NAME_FIELD)
            || getFieldValue(this.signatureRecord?.data, CREATED_BY_NAME_FIELD)
            || null;
    }

    get hasSignature() {
        return !!this.signatureImage;
    }
}
