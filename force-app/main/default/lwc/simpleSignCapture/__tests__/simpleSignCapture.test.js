import { createElement } from 'lwc';
import SimpleSignCapture from 'c/simpleSignCapture';
import { getRecord } from 'lightning/uiRecordApi';

jest.mock(
    '@salesforce/apex/SimpleSignController.saveSignature',
    () => ({ __esModule: true, default: jest.fn() }),
    { virtual: true }
);
import saveSignature from '@salesforce/apex/SimpleSignController.saveSignature';

// Canvas 2D context mock
const mockContext = {
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    closePath: jest.fn(),
    clearRect: jest.fn(),
    scale: jest.fn(),
    lineWidth: 0,
    lineCap: '',
    strokeStyle: ''
};

function flushPromises() {
    return new Promise((resolve) => setTimeout(resolve, 0));
}

function createComponent(props = {}) {
    const element = createElement('c-simple-sign-capture', {
        is: SimpleSignCapture
    });
    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
}

function getCanvas(element) {
    return element.shadowRoot.querySelector('canvas');
}

function simulateDrawStroke(canvas) {
    canvas.dispatchEvent(
        new MouseEvent('mousedown', { clientX: 10, clientY: 10, bubbles: true })
    );
    canvas.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 50, clientY: 50, bubbles: true })
    );
    canvas.dispatchEvent(
        new MouseEvent('mouseup', { bubbles: true })
    );
}

describe('c-simple-sign-capture', () => {
    beforeEach(() => {
        HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
        HTMLCanvasElement.prototype.toDataURL = jest.fn(
            () => 'data:image/png;base64,testbase64'
        );
        jest.spyOn(
            HTMLCanvasElement.prototype,
            'getBoundingClientRect'
        ).mockReturnValue({
            left: 0,
            top: 0,
            right: 350,
            bottom: 150,
            width: 350,
            height: 150,
            x: 0,
            y: 0
        });
        Object.keys(mockContext).forEach((key) => {
            if (typeof mockContext[key] === 'function') {
                mockContext[key].mockClear();
            }
        });
    });

    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    // ── Rendering ──────────────────────────────────────────────

    describe('rendering', () => {
        it('renders the title label', () => {
            const element = createComponent();
            const title = element.shadowRoot.querySelector('.signature-title');
            expect(title).not.toBeNull();
            expect(title.textContent).toBeTruthy();
        });

        it('renders clear and save buttons', () => {
            const element = createComponent();
            const buttons = element.shadowRoot.querySelectorAll(
                'lightning-button'
            );
            expect(buttons).toHaveLength(2);
        });

        it('renders a canvas element', () => {
            const element = createComponent();
            expect(getCanvas(element)).not.toBeNull();
        });

        it('initializes the canvas 2d context on first render', () => {
            createComponent();
            expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith(
                '2d'
            );
        });

        it('adjusts canvas for HiDPI on render', () => {
            createComponent();
            expect(mockContext.scale).toHaveBeenCalled();
        });

        it('clears the canvas on initial render', () => {
            createComponent();
            expect(mockContext.clearRect).toHaveBeenCalled();
        });
    });

    // ── Save button state ──────────────────────────────────────

    describe('save button state', () => {
        it('disables save button when canvas is empty', () => {
            const element = createComponent();
            const saveBtn = element.shadowRoot.querySelectorAll(
                'lightning-button'
            )[1];
            expect(saveBtn.disabled).toBe(true);
        });

        it('enables save button after a stroke is drawn', async () => {
            const element = createComponent();
            const canvas = getCanvas(element);

            simulateDrawStroke(canvas);
            await flushPromises();

            const saveBtn = element.shadowRoot.querySelectorAll(
                'lightning-button'
            )[1];
            expect(saveBtn.disabled).toBe(false);
        });
    });

    // ── Mouse drawing ──────────────────────────────────────────

    describe('mouse drawing', () => {
        it('begins a path and moves to position on mousedown', async () => {
            const element = createComponent();
            const canvas = getCanvas(element);

            canvas.dispatchEvent(
                new MouseEvent('mousedown', {
                    clientX: 20,
                    clientY: 30,
                    bubbles: true
                })
            );

            expect(mockContext.beginPath).toHaveBeenCalled();
            expect(mockContext.moveTo).toHaveBeenCalledWith(20, 30);
        });

        it('draws a line on mousemove while mouse is down', () => {
            const element = createComponent();
            const canvas = getCanvas(element);

            canvas.dispatchEvent(
                new MouseEvent('mousedown', {
                    clientX: 10,
                    clientY: 10,
                    bubbles: true
                })
            );
            canvas.dispatchEvent(
                new MouseEvent('mousemove', {
                    clientX: 50,
                    clientY: 50,
                    bubbles: true
                })
            );

            expect(mockContext.lineTo).toHaveBeenCalledWith(50, 50);
            expect(mockContext.stroke).toHaveBeenCalled();
        });

        it('does not draw on mousemove when mouse is not down', () => {
            const element = createComponent();
            const canvas = getCanvas(element);

            mockContext.lineTo.mockClear();
            canvas.dispatchEvent(
                new MouseEvent('mousemove', {
                    clientX: 50,
                    clientY: 50,
                    bubbles: true
                })
            );

            expect(mockContext.lineTo).not.toHaveBeenCalled();
        });

        it('stops drawing on mouseup', async () => {
            const element = createComponent();
            const canvas = getCanvas(element);

            simulateDrawStroke(canvas);
            mockContext.lineTo.mockClear();

            canvas.dispatchEvent(
                new MouseEvent('mousemove', {
                    clientX: 80,
                    clientY: 80,
                    bubbles: true
                })
            );

            expect(mockContext.lineTo).not.toHaveBeenCalled();
        });

        it('stops drawing on mouseleave', () => {
            const element = createComponent();
            const canvas = getCanvas(element);

            canvas.dispatchEvent(
                new MouseEvent('mousedown', {
                    clientX: 10,
                    clientY: 10,
                    bubbles: true
                })
            );
            canvas.dispatchEvent(
                new MouseEvent('mouseleave', { bubbles: true })
            );
            mockContext.lineTo.mockClear();

            canvas.dispatchEvent(
                new MouseEvent('mousemove', {
                    clientX: 50,
                    clientY: 50,
                    bubbles: true
                })
            );

            expect(mockContext.lineTo).not.toHaveBeenCalled();
        });
    });

    // ── Touch drawing ──────────────────────────────────────────

    describe('touch drawing', () => {
        function createTouchEvent(type, touches) {
            const event = new Event(type, { bubbles: true });
            event.touches = touches || [];
            event.preventDefault = jest.fn();
            return event;
        }

        it('prevents default on touchstart', () => {
            const element = createComponent();
            const canvas = getCanvas(element);

            const event = createTouchEvent('touchstart', [
                { clientX: 10, clientY: 10 }
            ]);
            canvas.dispatchEvent(event);

            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('begins drawing on touchstart', () => {
            const element = createComponent();
            const canvas = getCanvas(element);

            const event = createTouchEvent('touchstart', [
                { clientX: 20, clientY: 30 }
            ]);
            canvas.dispatchEvent(event);

            expect(mockContext.beginPath).toHaveBeenCalled();
            expect(mockContext.moveTo).toHaveBeenCalledWith(20, 30);
        });

        it('draws on touchmove', () => {
            const element = createComponent();
            const canvas = getCanvas(element);

            canvas.dispatchEvent(
                createTouchEvent('touchstart', [
                    { clientX: 10, clientY: 10 }
                ])
            );
            const moveEvent = createTouchEvent('touchmove', [
                { clientX: 50, clientY: 50 }
            ]);
            canvas.dispatchEvent(moveEvent);

            expect(moveEvent.preventDefault).toHaveBeenCalled();
            expect(mockContext.lineTo).toHaveBeenCalledWith(50, 50);
            expect(mockContext.stroke).toHaveBeenCalled();
        });

        it('stops drawing on touchend', async () => {
            const element = createComponent();
            const canvas = getCanvas(element);

            canvas.dispatchEvent(
                createTouchEvent('touchstart', [
                    { clientX: 10, clientY: 10 }
                ])
            );
            canvas.dispatchEvent(
                createTouchEvent('touchmove', [
                    { clientX: 50, clientY: 50 }
                ])
            );
            canvas.dispatchEvent(createTouchEvent('touchend'));

            await flushPromises();

            const saveBtn = element.shadowRoot.querySelectorAll(
                'lightning-button'
            )[1];
            expect(saveBtn.disabled).toBe(false);
        });
    });

    // ── Clear button ───────────────────────────────────────────

    describe('clear button', () => {
        it('clears the canvas when clicked', async () => {
            const element = createComponent();
            const canvas = getCanvas(element);

            simulateDrawStroke(canvas);
            mockContext.clearRect.mockClear();

            const clearBtn = element.shadowRoot.querySelectorAll(
                'lightning-button'
            )[0];
            clearBtn.click();
            await flushPromises();

            expect(mockContext.clearRect).toHaveBeenCalled();
        });

        it('disables save button after clearing', async () => {
            const element = createComponent();
            const canvas = getCanvas(element);

            simulateDrawStroke(canvas);
            await flushPromises();

            const clearBtn = element.shadowRoot.querySelectorAll(
                'lightning-button'
            )[0];
            clearBtn.click();
            await flushPromises();

            const saveBtn = element.shadowRoot.querySelectorAll(
                'lightning-button'
            )[1];
            expect(saveBtn.disabled).toBe(true);
        });
    });

    // ── Save functionality ─────────────────────────────────────

    describe('save functionality', () => {
        it('calls saveSignature apex with correct parameters', async () => {
            const element = createComponent({
                parentRecordId: '001000000000001AAA',
                relatedFieldName: 'Account__c'
            });
            const canvas = getCanvas(element);

            saveSignature.mockResolvedValueOnce('a01000000000001AAA');
            simulateDrawStroke(canvas);
            await flushPromises();

            const saveBtn = element.shadowRoot.querySelectorAll(
                'lightning-button'
            )[1];
            saveBtn.click();
            await flushPromises();

            expect(saveSignature).toHaveBeenCalledWith({
                base64Image: 'data:image/png;base64,testbase64',
                relatedFieldName: 'Account__c',
                parentRecordId: '001000000000001AAA'
            });
        });

        it('dispatches signature custom event on success', async () => {
            const element = createComponent();
            const canvas = getCanvas(element);
            const handler = jest.fn();
            element.addEventListener('signature', handler);

            saveSignature.mockResolvedValueOnce('a01000000000001AAA');
            simulateDrawStroke(canvas);
            await flushPromises();

            element.shadowRoot
                .querySelectorAll('lightning-button')[1]
                .click();
            await flushPromises();

            expect(handler).toHaveBeenCalled();
            expect(handler.mock.calls[0][0].detail).toEqual({
                dataUrl: 'data:image/png;base64,testbase64',
                recordId: 'a01000000000001AAA'
            });
        });

        it('dispatches success toast on save', async () => {
            const element = createComponent();
            const canvas = getCanvas(element);
            const toastHandler = jest.fn();
            element.addEventListener('lightning__showtoast', toastHandler);

            saveSignature.mockResolvedValueOnce('a01000000000001AAA');
            simulateDrawStroke(canvas);
            await flushPromises();

            element.shadowRoot
                .querySelectorAll('lightning-button')[1]
                .click();
            await flushPromises();

            expect(toastHandler).toHaveBeenCalled();
            expect(toastHandler.mock.calls[0][0].detail.variant).toBe(
                'success'
            );
        });

        it('sets signatureValue after successful save', async () => {
            const element = createComponent();
            const canvas = getCanvas(element);

            saveSignature.mockResolvedValueOnce('a01000000000001AAA');
            simulateDrawStroke(canvas);
            await flushPromises();

            element.shadowRoot
                .querySelectorAll('lightning-button')[1]
                .click();
            await flushPromises();

            expect(element.signatureValue).toBe(
                'data:image/png;base64,testbase64'
            );
        });

        it('resets drawing after successful save', async () => {
            const element = createComponent();
            const canvas = getCanvas(element);

            saveSignature.mockResolvedValueOnce('a01000000000001AAA');
            simulateDrawStroke(canvas);
            await flushPromises();

            mockContext.clearRect.mockClear();
            element.shadowRoot
                .querySelectorAll('lightning-button')[1]
                .click();
            await flushPromises();

            expect(mockContext.clearRect).toHaveBeenCalled();
        });

        it('dispatches error toast on save failure', async () => {
            const element = createComponent();
            const canvas = getCanvas(element);
            const toastHandler = jest.fn();
            element.addEventListener('lightning__showtoast', toastHandler);

            saveSignature.mockRejectedValueOnce({
                body: { message: 'Insufficient permissions' }
            });
            simulateDrawStroke(canvas);
            await flushPromises();

            element.shadowRoot
                .querySelectorAll('lightning-button')[1]
                .click();
            await flushPromises();

            expect(toastHandler).toHaveBeenCalled();
            expect(toastHandler.mock.calls[0][0].detail.variant).toBe('error');
        });

        it('handles error without body gracefully', async () => {
            const element = createComponent();
            const canvas = getCanvas(element);
            const toastHandler = jest.fn();
            element.addEventListener('lightning__showtoast', toastHandler);

            saveSignature.mockRejectedValueOnce(
                new Error('Network failure')
            );
            simulateDrawStroke(canvas);
            await flushPromises();

            element.shadowRoot
                .querySelectorAll('lightning-button')[1]
                .click();
            await flushPromises();

            expect(toastHandler).toHaveBeenCalled();
            const toastMessage = toastHandler.mock.calls[0][0].detail.message;
            expect(toastMessage).toContain('Network failure');
        });

        it('shows last signature card after successful save', async () => {
            const element = createComponent();
            const canvas = getCanvas(element);

            saveSignature.mockResolvedValueOnce('a01000000000001AAA');
            simulateDrawStroke(canvas);
            await flushPromises();

            element.shadowRoot
                .querySelectorAll('lightning-button')[1]
                .click();
            await flushPromises();

            const lastCard =
                element.shadowRoot.querySelector('.signature-last-card');
            expect(lastCard).not.toBeNull();

            const img = element.shadowRoot.querySelector(
                '.signature-last-image'
            );
            expect(img.src).toBe('data:image/png;base64,testbase64');
        });
    });

    // ── Computed properties ────────────────────────────────────

    describe('computed properties', () => {
        it('saveButtonLabel shows default label when not saving', () => {
            const element = createComponent();
            const saveBtn = element.shadowRoot.querySelectorAll(
                'lightning-button'
            )[1];
            expect(saveBtn.label).toBeTruthy();
        });
    });

    // ── Wire service ───────────────────────────────────────────

    describe('wire service', () => {
        it('displays last signature from wire data', async () => {
            const element = createComponent({
                recordId: 'a01000000000001AAA'
            });
            await flushPromises();

            getRecord.emit({
                fields: {
                    SignatureImage__c: {
                        value: 'data:image/png;base64,wiredata'
                    },
                    CreatedDate: { value: '2025-06-15T10:30:00.000Z' },
                    CreatedBy: { displayValue: 'Jane Doe' }
                }
            });
            await flushPromises();

            const img = element.shadowRoot.querySelector(
                '.signature-last-image'
            );
            expect(img).not.toBeNull();
            expect(img.src).toBe('data:image/png;base64,wiredata');
        });

        it('hides last signature when wire returns no image', async () => {
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

            const img = element.shadowRoot.querySelector(
                '.signature-last-image'
            );
            expect(img).toBeNull();
        });

        it('reads CreatedBy name from nested fields as fallback', async () => {
            const element = createComponent({
                recordId: 'a01000000000001AAA'
            });
            await flushPromises();

            getRecord.emit({
                fields: {
                    SignatureImage__c: {
                        value: 'data:image/png;base64,wiredata'
                    },
                    CreatedDate: { value: '2025-06-15T10:30:00.000Z' },
                    CreatedBy: {
                        displayValue: null,
                        value: { fields: { Name: { value: 'Fallback User' } } }
                    }
                }
            });
            await flushPromises();

            const lastInfo = element.shadowRoot.querySelector(
                '.signature-last-info'
            );
            expect(lastInfo).not.toBeNull();
            expect(lastInfo.textContent).toContain('Fallback User');
        });
    });
});
