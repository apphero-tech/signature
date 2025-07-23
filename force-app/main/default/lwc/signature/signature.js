import { LightningElement, api, track, wire } from 'lwc';
import saveSignature from '@salesforce/apex/SignatureController.saveSignature';
import { getRecord } from 'lightning/uiRecordApi';

const SIGNATURE_IMAGE_FIELD = 'Signature__c.SignatureImage__c';
const CREATED_DATE_FIELD = 'Signature__c.CreatedDate';
const CREATED_BY_NAME_FIELD = 'Signature__c.CreatedBy.Name';

export default class Signature extends LightningElement {
    canvas;
    context;
    isDrawing = false;
    @track isEmpty = true;
    lastPoint = null;
    strokeStarted = false;

    @api recordId; // Pour charger la signature existante
    @track lastSignature = null; // { image, date, name }

    @wire(getRecord, { recordId: '$recordId', fields: [SIGNATURE_IMAGE_FIELD, CREATED_DATE_FIELD, CREATED_BY_NAME_FIELD] })
    wiredSignature({ error, data }) {
        if (data && data.fields.SignatureImage__c.value) {
            this.lastSignature = {
                image: data.fields.SignatureImage__c.value,
                date: data.fields.CreatedDate.value,
                name: data.fields.CreatedBy.displayValue || data.fields.CreatedBy.value.fields.Name.value
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
        this.signatureValue = this.canvas.toDataURL('image/png');
        try {
            const recordId = await saveSignature({ base64Image: this.signatureValue });
            // Met à jour l'aperçu localement (en attendant le wire refresh)
            this.lastSignature = {
                image: this.signatureValue,
                date: new Date().toISOString(),
                name: 'Vous'
            };
            this.dispatchEvent(new CustomEvent('signature', {
                detail: { dataUrl: this.signatureValue, recordId }
            }));
            alert('Signature saved to Salesforce!');
            // Efface le canvas après sauvegarde
            this.clearCanvas();
        } catch (error) {
            alert('Error saving signature: ' + (error.body && error.body.message ? error.body.message : error.message));
        }
    }

    get isSaveDisabled() {
        return this.isEmpty;
    }
}
