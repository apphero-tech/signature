import { createElement } from 'lwc';
import SimpleSignViewer from 'c/simpleSignViewer';
import { getRecord } from 'lightning/uiRecordApi';

function flushPromises() {
    return new Promise((resolve) => setTimeout(resolve, 0));
}

function createComponent(props = {}) {
    const element = createElement('c-simple-sign-viewer', {
        is: SimpleSignViewer
    });
    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
}

const MOCK_SIGNATURE_DATA = {
    fields: {
        SignatureImage__c: { value: 'data:image/png;base64,signaturedata' },
        CreatedDate: { value: '2025-06-15T10:30:00.000Z' },
        CreatedBy: { displayValue: 'John Doe' }
    }
};

describe('c-simple-sign-viewer', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    // ── With signature data ────────────────────────────────────

    describe('with signature data', () => {
        it('displays the signature image', async () => {
            const element = createComponent({
                recordId: 'a01000000000001AAA'
            });
            await flushPromises();

            getRecord.emit(MOCK_SIGNATURE_DATA);
            await flushPromises();

            const img = element.shadowRoot.querySelector('.viewer-image');
            expect(img).not.toBeNull();
            expect(img.src).toBe('data:image/png;base64,signaturedata');
        });

        it('displays the created date', async () => {
            const element = createComponent({
                recordId: 'a01000000000001AAA'
            });
            await flushPromises();

            getRecord.emit(MOCK_SIGNATURE_DATA);
            await flushPromises();

            const dateTime = element.shadowRoot.querySelector(
                'lightning-formatted-date-time'
            );
            expect(dateTime).not.toBeNull();
            expect(dateTime.value).toBe('2025-06-15T10:30:00.000Z');
        });

        it('displays the creator name from displayValue', async () => {
            const element = createComponent({
                recordId: 'a01000000000001AAA'
            });
            await flushPromises();

            getRecord.emit(MOCK_SIGNATURE_DATA);
            await flushPromises();

            const meta = element.shadowRoot.querySelector('.viewer-meta');
            expect(meta.textContent).toContain('John Doe');
        });

        it('falls back to nested Name field for creator', async () => {
            const element = createComponent({
                recordId: 'a01000000000001AAA'
            });
            await flushPromises();

            getRecord.emit({
                fields: {
                    SignatureImage__c: {
                        value: 'data:image/png;base64,signaturedata'
                    },
                    CreatedDate: { value: '2025-06-15T10:30:00.000Z' },
                    CreatedBy: {
                        displayValue: null,
                        value: {
                            fields: { Name: { value: 'Nested Name User' } }
                        }
                    }
                }
            });
            await flushPromises();

            const meta = element.shadowRoot.querySelector('.viewer-meta');
            expect(meta.textContent).toContain('Nested Name User');
        });

        it('does not show the no-signature message', async () => {
            const element = createComponent({
                recordId: 'a01000000000001AAA'
            });
            await flushPromises();

            getRecord.emit(MOCK_SIGNATURE_DATA);
            await flushPromises();

            const noSig = element.shadowRoot.querySelector(
                '.slds-illustration'
            );
            expect(noSig).toBeNull();
        });

        it('sets correct alt text on the image', async () => {
            const element = createComponent({
                recordId: 'a01000000000001AAA'
            });
            await flushPromises();

            getRecord.emit(MOCK_SIGNATURE_DATA);
            await flushPromises();

            const img = element.shadowRoot.querySelector('.viewer-image');
            expect(img.alt).toBeTruthy();
        });
    });

    // ── Without signature data ─────────────────────────────────

    describe('without signature data', () => {
        it('shows the no-signature message when image is null', async () => {
            const element = createComponent({
                recordId: 'a01000000000001AAA'
            });
            await flushPromises();

            getRecord.emit({
                fields: {
                    SignatureImage__c: { value: null },
                    CreatedDate: { value: null },
                    CreatedBy: { displayValue: null }
                }
            });
            await flushPromises();

            const noSig = element.shadowRoot.querySelector(
                '.slds-illustration'
            );
            expect(noSig).not.toBeNull();
        });

        it('shows the no-signature message when no wire data', async () => {
            const element = createComponent({
                recordId: 'a01000000000001AAA'
            });
            await flushPromises();

            const noSig = element.shadowRoot.querySelector(
                '.slds-illustration'
            );
            expect(noSig).not.toBeNull();
        });

        it('does not render an image element', async () => {
            const element = createComponent({
                recordId: 'a01000000000001AAA'
            });
            await flushPromises();

            getRecord.emit({
                fields: {
                    SignatureImage__c: { value: null },
                    CreatedDate: { value: null },
                    CreatedBy: { displayValue: null }
                }
            });
            await flushPromises();

            const img = element.shadowRoot.querySelector('.viewer-image');
            expect(img).toBeNull();
        });
    });

    // ── Wire error handling ────────────────────────────────────

    describe('wire error handling', () => {
        it('shows no-signature message on wire error', async () => {
            const element = createComponent({
                recordId: 'a01000000000001AAA'
            });
            await flushPromises();

            getRecord.error({ message: 'Record not found' });
            await flushPromises();

            const noSig = element.shadowRoot.querySelector(
                '.slds-illustration'
            );
            expect(noSig).not.toBeNull();
        });
    });

    // ── Computed properties ────────────────────────────────────

    describe('computed properties', () => {
        it('hasSignature is false when no data', async () => {
            const element = createComponent({
                recordId: 'a01000000000001AAA'
            });
            await flushPromises();

            const img = element.shadowRoot.querySelector('.viewer-image');
            expect(img).toBeNull();
            const card = element.shadowRoot.querySelector('.slds-card');
            expect(card).toBeNull();
        });

        it('hasSignature is true with valid image data', async () => {
            const element = createComponent({
                recordId: 'a01000000000001AAA'
            });
            await flushPromises();

            getRecord.emit(MOCK_SIGNATURE_DATA);
            await flushPromises();

            const card = element.shadowRoot.querySelector('.slds-card');
            expect(card).not.toBeNull();
        });

        it('handles empty string as no signature', async () => {
            const element = createComponent({
                recordId: 'a01000000000001AAA'
            });
            await flushPromises();

            getRecord.emit({
                fields: {
                    SignatureImage__c: { value: '' },
                    CreatedDate: { value: null },
                    CreatedBy: { displayValue: null }
                }
            });
            await flushPromises();

            const img = element.shadowRoot.querySelector('.viewer-image');
            expect(img).toBeNull();
        });
    });
});
