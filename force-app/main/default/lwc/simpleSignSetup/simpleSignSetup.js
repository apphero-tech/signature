import { LightningElement } from 'lwc';

export default class SimpleSignSetup extends LightningElement {

    steps = [
        {
            number: '1',
            title: 'Assign Permission Sets',
            description: 'Assign Simple Sign Admin to administrators and Simple Sign User to standard users who need to capture signatures.',
            detail: 'Go to Setup → Permission Sets → Select "Simple Sign Admin" or "Simple Sign User" → Manage Assignments → Add Assignments.',
            icon: 'utility:lock'
        },
        {
            number: '2',
            title: 'Create Lookup Fields (Optional)',
            description: 'If you want to link signatures to specific records (Account, Contact, Opportunity, etc.), create a Lookup field on the Signature object.',
            detail: 'Go to Setup → Object Manager → Signature → Fields & Relationships → New → Lookup Relationship → Select the target object (e.g. Account). Note the field API name (e.g. Account__c) — you will need it in the next steps.',
            icon: 'utility:linked'
        },
        {
            number: '3',
            title: 'Add Simple Sign Capture to Pages',
            description: 'Drag the "Simple Sign Capture" component onto any Lightning Record Page, App Page, Home Page, or Screen Flow.',
            detail: 'In Lightning App Builder, find "Simple Sign Capture" in the component panel. If you created a lookup field, set the "Lookup Field API Name" property (e.g. Account__c) and the "Parent Record ID" (use {!recordId} in Flows).',
            icon: 'utility:edit'
        },
        {
            number: '4',
            title: 'Add Simple Sign Viewer to Pages',
            description: 'Drag the "Simple Sign Viewer" component to display saved signatures.',
            detail: 'On a Signature record page: no configuration needed. On other record pages (Account, Contact, etc.): set the "Lookup Field API Name" property to the field you created in Step 2.',
            icon: 'utility:preview'
        },
        {
            number: '5',
            title: 'Test Your Setup',
            description: 'Open a record page where you added the capture component, draw a signature, and save it. Then verify it appears in the viewer.',
            detail: 'Navigate to the Signatures tab to see all saved signatures. Check that the lookup field links back to the correct parent record.',
            icon: 'utility:check'
        }
    ];
}
