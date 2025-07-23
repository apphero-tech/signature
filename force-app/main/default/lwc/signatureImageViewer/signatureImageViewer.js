import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

const SIGNATURE_IMAGE_FIELD = 'Signature__c.SignatureImage__c';
const CREATED_DATE_FIELD = 'Signature__c.CreatedDate';
const CREATED_BY_NAME_FIELD = 'Signature__c.CreatedBy.Name';

export default class SignatureImageViewer extends LightningElement {
    @api recordId;
    @wire(getRecord, { recordId: '$recordId', fields: [SIGNATURE_IMAGE_FIELD, CREATED_DATE_FIELD, CREATED_BY_NAME_FIELD] })
    signatureRecord;

    get signatureImage() {
        return this.signatureRecord.data
            ? this.signatureRecord.data.fields.SignatureImage__c.value
            : null;
    }

    get createdDate() {
        return this.signatureRecord.data
            ? this.signatureRecord.data.fields.CreatedDate.value
            : null;
    }

    get createdByName() {
        return this.signatureRecord.data
            ? this.signatureRecord.data.fields.CreatedBy.displayValue || this.signatureRecord.data.fields.CreatedBy.value.fields.Name.value
            : null;
    }
} 