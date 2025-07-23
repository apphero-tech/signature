# Signature

A responsive Salesforce Lightning Web Component (LWC) for capturing, saving, and displaying electronic signatures on any object record. Designed for a pixel-perfect, Lightning-aligned user experience on both desktop and mobile.

## Features
- Draw and save a signature directly in Salesforce
- Responsive design: works on desktop and mobile
- Save signature as a base64 PNG in a custom object
- Miniature preview of the last saved signature with date/time and signer name
- Clean, modern UI using SLDS and custom styles
- Button states and canvas behavior optimized for usability

## Setup & Deployment
1. **Authorize your Salesforce org:**
   ```sh
   sf org login web --alias MyDevOrg
   ```
2. **Deploy the component:**
   ```sh
   sf project deploy start --source-dir force-app --target-org MyDevOrg
   ```
3. **Add the LWC to a Lightning Record Page:**
   - Go to Setup > Object Manager > [Your Object] > Lightning Record Pages
   - Edit the page and drag the `signature` component where desired
   - Save and activate the page

## Usage
- Draw your signature in the canvas area
- The "Save" button is enabled only after a stroke is drawn
- Click "Save" to store the signature; the canvas is cleared and a preview appears below
- The preview shows the last saved signature, date/time, and signer name
- Works seamlessly on mobile and desktop

## Customization
- You can adjust the max width, colors, or add new features (undo, download, etc.) in the LWC files
- The signature is stored as a base64 PNG in the `Signature__c.SignatureImage__c` field

## Requirements
- Salesforce DX project
- API version 63.0+

## License
MIT
