import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

import labelSignedOn from '@salesforce/label/c.SimpleSign_SignedBy';
import labelNoSignature from '@salesforce/label/c.SimpleSign_NoSignatureFound';
import labelSignatureImageAlt from '@salesforce/label/c.SimpleSign_SignatureImageAlt';

const SIGNATURE_IMAGE_FIELD = 'Signature__c.SignatureImage__c';
const CREATED_DATE_FIELD = 'Signature__c.CreatedDate';
const CREATED_BY_NAME_FIELD = 'Signature__c.CreatedBy.Name';

export default class SimpleSignViewer extends LightningElement {
    labels = {
        signedOn: labelSignedOn,
        noSignature: labelNoSignature,
        signatureImageAlt: labelSignatureImageAlt
    };

    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: [SIGNATURE_IMAGE_FIELD, CREATED_DATE_FIELD, CREATED_BY_NAME_FIELD] })
    signatureRecord;

    get signatureImage() {
        return this.signatureRecord?.data?.fields?.SignatureImage__c?.value || null;
    }

    get createdDate() {
        return this.signatureRecord?.data?.fields?.CreatedDate?.value || null;
    }

    get createdByName() {
        return this.signatureRecord?.data?.fields?.CreatedBy?.displayValue
            || this.signatureRecord?.data?.fields?.CreatedBy?.value?.fields?.Name?.value
            || null;
    }

    get hasSignature() {
        return !!this.signatureImage;
    }
}
