import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord, getFieldValue, getFieldDisplayValue } from 'lightning/uiRecordApi';
import saveSignature from '@salesforce/apex/SimpleSignController.saveSignature';

import SIGNATURE_IMAGE_FIELD from '@salesforce/schema/Signature__c.SignatureImage__c';
import CREATED_DATE_FIELD from '@salesforce/schema/Signature__c.CreatedDate';
import CREATED_BY_NAME_FIELD from '@salesforce/schema/Signature__c.CreatedBy.Name';

import labelDrawSignature from '@salesforce/label/c.SimpleSign_DrawYourSignature';
import labelClear from '@salesforce/label/c.SimpleSign_Clear';
import labelSave from '@salesforce/label/c.SimpleSign_Save';
import labelLastSignature from '@salesforce/label/c.SimpleSign_LastSignature';
import labelSignedBy from '@salesforce/label/c.SimpleSign_SignedBy';
import labelSaveSuccess from '@salesforce/label/c.SimpleSign_SaveSuccess';
import labelSaveError from '@salesforce/label/c.SimpleSign_SaveError';
import labelSignatureImageAlt from '@salesforce/label/c.SimpleSign_SignatureImageAlt';

export default class SimpleSignCapture extends LightningElement {
    labels = {
        drawSignature: labelDrawSignature,
        clear: labelClear,
        save: labelSave,
        lastSignature: labelLastSignature,
        signedBy: labelSignedBy,
        saveSuccess: labelSaveSuccess,
        saveError: labelSaveError,
        signatureImageAlt: labelSignatureImageAlt
    };

    canvas;
    context;
    isDrawing = false;
    isEmpty = true;
    lastPoint = null;
    strokeStarted = false;

    @api recordId;
    @api parentRecordId;
    @api relatedFieldName;
    lastSignature = null;

    @wire(getRecord, {
        recordId: '$recordId',
        fields: [SIGNATURE_IMAGE_FIELD, CREATED_DATE_FIELD, CREATED_BY_NAME_FIELD]
    })
    wiredSignature({ error, data }) {
        if (data) {
            const image = getFieldValue(data, SIGNATURE_IMAGE_FIELD);
            if (image) {
                this.lastSignature = {
                    image,
                    date: getFieldValue(data, CREATED_DATE_FIELD),
                    name: getFieldDisplayValue(data, CREATED_BY_NAME_FIELD)
                        || getFieldValue(data, CREATED_BY_NAME_FIELD)
                };
            } else {
                this.lastSignature = null;
            }
        } else {
            this.lastSignature = null;
        }
    }

    @api signatureValue = '';

    renderedCallback() {
        if (!this.canvas) {
            this.canvas = this.template.querySelector('canvas');
            this.context = this.canvas.getContext('2d');
            this.clearCanvas();
        }
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.signatureValue = '';
        this.isEmpty = true;
        this.lastPoint = null;
        this.strokeStarted = false;
        this.context.beginPath();
    }

    handleMouseDown(event) {
        this.isDrawing = true;
        this.lastPoint = null;
        this.strokeStarted = false;
        this.context.beginPath();
        this.draw(event);
    }

    handleMouseMove(event) {
        if (this.isDrawing) {
            this.draw(event);
        }
    }

    handleMouseUp() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.isEmpty = !this.strokeStarted;
        }
    }

    handleTouchStart(event) {
        event.preventDefault();
        this.isDrawing = true;
        this.lastPoint = null;
        this.strokeStarted = false;
        this.context.beginPath();
        this.draw(event.touches[0]);
    }

    handleTouchMove(event) {
        event.preventDefault();
        if (this.isDrawing) {
            this.draw(event.touches[0]);
        }
    }

    handleTouchEnd() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.isEmpty = !this.strokeStarted;
        }
    }

    draw(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = ((event.clientX || event.pageX) - rect.left);
        const y = ((event.clientY || event.pageY) - rect.top);

        if (this.isDrawing) {
            this.context.lineWidth = 2.3;
            this.context.lineCap = 'round';
            this.context.strokeStyle = '#1b96ff';
            if (!this.lastPoint) {
                this.context.moveTo(x, y);
            } else {
                this.context.lineTo(x, y);
                this.context.stroke();
                this.strokeStarted = true;
            }
            this.lastPoint = { x, y };
        } else {
            this.context.closePath();
            this.lastPoint = null;
        }
    }

    handleClear() {
        this.clearCanvas();
    }

    async handleSave() {
        const dataUrl = this.canvas.toDataURL('image/png');
        this.signatureValue = dataUrl;
        try {
            const recordId = await saveSignature({
                base64Image: dataUrl,
                relatedFieldName: this.relatedFieldName,
                parentRecordId: this.parentRecordId
            });
            this.lastSignature = {
                image: dataUrl,
                date: new Date().toISOString(),
                name: 'You'
            };
            this.dispatchEvent(new CustomEvent('signature', {
                detail: { dataUrl, recordId }
            }));
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: this.labels.saveSuccess,
                variant: 'success'
            }));
            this.clearCanvas();
            this.signatureValue = dataUrl;
        } catch (error) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: this.labels.saveError + ' ' + (error.body?.message || error.message),
                variant: 'error'
            }));
        }
    }

    get isSaveDisabled() {
        return this.isEmpty;
    }
}
