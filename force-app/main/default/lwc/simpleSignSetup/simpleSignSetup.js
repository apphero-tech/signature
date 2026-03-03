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
            title: 'Create Lookup Fields',
            description: 'Create a Lookup field on the Signature object to link signatures to specific records (Account, Contact, Opportunity, etc.). You will need the field API name in the next steps.',
            detail: 'Go to Setup → Object Manager → Signature → Fields & Relationships → New → Lookup Relationship → Select the target object (e.g. Account). Note the field API name (e.g. Account__c).',
            icon: 'utility:linked'
        },
        {
            number: '3',
            title: 'Add Simple Sign Capture to Pages',
            description: 'Drag the "Simple Sign Capture" component onto a Lightning Record Page. Set the "Lookup Field API Name" property to the field you created in Step 2. Save and Activate the page.',
            detail: 'In Lightning App Builder, find "Simple Sign Capture" in the component panel. Set "Lookup Field API Name" (e.g. Account__c). The parent record is detected automatically. In Screen Flows, also set "Parent Record ID" to {!recordId}. After saving, click Activate and assign the page as the org default or for specific apps/profiles.',
            icon: 'utility:edit'
        },
        {
            number: '4',
            title: 'Add Simple Sign Viewer to Pages',
            description: 'Drag the "Simple Sign Viewer" component to display saved signatures. Save and Activate the page.',
            detail: 'On a Signature record page: no configuration needed. On other record pages (Account, Contact, etc.): set the "Lookup Field API Name" property to the field you created in Step 2. Remember to Activate the page after saving.',
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
