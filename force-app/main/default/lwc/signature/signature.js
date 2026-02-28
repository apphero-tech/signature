import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import saveSignature from '@salesforce/apex/SignatureController.saveSignature';
import { getRecord } from 'lightning/uiRecordApi';

// Custom Labels for i18n
import labelDrawSignature from '@salesforce/label/c.Sig_DrawYourSignature';
import labelClear from '@salesforce/label/c.Sig_Clear';
import labelSave from '@salesforce/label/c.Sig_Save';
import labelLastSignature from '@salesforce/label/c.Sig_LastSignature';
import labelSignedBy from '@salesforce/label/c.Sig_SignedBy';
import labelSaveSuccess from '@salesforce/label/c.Sig_SaveSuccess';
import labelSaveError from '@salesforce/label/c.Sig_SaveError';
import labelSignatureImageAlt from '@salesforce/label/c.Sig_SignatureImageAlt';

const SIGNATURE_IMAGE_FIELD = 'Signature__c.SignatureImage__c';
const CREATED_DATE_FIELD = 'Signature__c.CreatedDate';
const CREATED_BY_NAME_FIELD = 'Signature__c.CreatedBy.Name';

export default class Signature extends LightningElement {
    // Expose labels to template
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
    @track isEmpty = true;
    lastPoint = null;
    strokeStarted = false;

    @api recordId; // Pour charger la signature existante
    @api parentRecordId; // ex: {!varInteractionId}
    @api relatedFieldName; // ex: "Interaction__c"
    @track lastSignature = null; // { image, date, name }

    @wire(getRecord, { recordId: '$recordId', fields: [SIGNATURE_IMAGE_FIELD, CREATED_DATE_FIELD, CREATED_BY_NAME_FIELD] })
    wiredSignature({ error, data }) {
        if (data?.fields?.SignatureImage__c?.value) {
            this.lastSignature = {
                image: data.fields.SignatureImage__c.value,
                date: data.fields.CreatedDate?.value,
                name: data.fields.CreatedBy?.displayValue || data.fields.CreatedBy?.value?.fields?.Name?.value
            };
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
            this.context.lineCap = "round";
            this.context.strokeStyle = "#1b96ff";
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
            // Preserve signature value for Flow output after canvas clear
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
