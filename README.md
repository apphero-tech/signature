# Simple Sign for Salesforce

[![Salesforce](https://img.shields.io/badge/Salesforce-00A1E0?style=flat&logo=salesforce&logoColor=white)](https://www.salesforce.com)
[![Lightning](https://img.shields.io/badge/Lightning-Experience-purple)](https://developer.salesforce.com/docs/component-library/overview/components)
[![API Version](https://img.shields.io/badge/API-66.0-blue)](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/)

A professional, responsive Lightning Web Component (LWC) for capturing, storing, and displaying electronic signatures in Salesforce. Designed for enterprise use with full AppExchange compatibility.

## Features

- **Signature Drawing** - Smooth canvas-based signature capture with touch and mouse support
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Secure Storage** - Signatures saved as base64 PNG in custom object records
- **Flow Integration** - Full Screen Flow support with input/output parameters
- **Multi-language** - Built-in internationalization (English/French)
- **SLDS Styling** - Native Lightning Design System look and feel
- **Experience Cloud Ready** - Works in Community/Experience Cloud pages

## Package Contents

| Component | Type | Description |
|-----------|------|-------------|
| `simpleSignCapture` | LWC | Main signature capture component |
| `simpleSignViewer` | LWC | Read-only signature display component |
| `SimpleSignController` | Apex Class | Backend controller for saving signatures |
| `Signature__c` | Custom Object | Stores signature records |
| `SimpleSignUser` | Permission Set | Standard user access |
| `SimpleSignAdmin` | Permission Set | Admin access with full permissions |

## Installation

### Option 1: Install from AppExchange (Recommended)
Search for "Simple Sign" on [Salesforce AppExchange](https://appexchange.salesforce.com/).

### Option 2: Install via Salesforce CLI

```bash
# Install package in production/sandbox
sf package install --package "Simple Sign@1.0.0-1" --target-org YourOrgAlias --wait 10

# Assign permission set to users
sf org assign permset --name SimpleSignUser --target-org YourOrgAlias
```

### Option 3: Deploy Source (Development Only)

```bash
# Clone repository
git clone https://github.com/apphero-tech/signature.git
cd signature

# Authorize your org
sf org login web --alias MyDevOrg

# Deploy metadata
sf project deploy start --source-dir force-app --target-org MyDevOrg
```

## Configuration

### 1. Assign Permission Sets

Assign the appropriate permission set to users:

- **Simple Sign User** - For users who need to capture and view signatures
- **Simple Sign Admin** - For administrators who need full access including delete

```bash
sf org assign permset --name SimpleSignUser --target-org YourOrgAlias --on-behalf-of user@example.com
```

### 2. Add Component to Lightning Pages

1. Go to **Setup** > **Object Manager** > Select your object > **Lightning Record Pages**
2. Edit the page and drag the `simpleSignCapture` component to your desired location
3. Save and activate the page

### 3. Use in Screen Flows

Add the `simpleSignCapture` component to a Screen Flow:

| Property | Type | Description |
|----------|------|-------------|
| `parentRecordId` | Input | The ID of the parent record to link (e.g., `{!recordId}`) |
| `relatedFieldName` | Input | API name of the lookup field (e.g., `Account__c`) |
| `signatureValue` | Output | Base64 PNG data URL of captured signature |

## Supported Targets

| Target | Supported |
|--------|-----------|
| Lightning Record Page | Yes |
| Lightning App Page | Yes |
| Lightning Home Page | Yes |
| Screen Flow | Yes |
| Experience Cloud Page | Yes |

## Internationalization

The component supports multiple languages out of the box:

- **English (en_US)** - Default
- **French (fr)** - Full translation included

To add additional languages, create translation files in the `translations/` directory.

## Security

- Uses `with sharing` Apex controller for proper record-level security
- Respects object and field-level permissions via Permission Sets
- Signature data stored as text, not as files (no file storage consumption)
- SOQL injection safe with parameterized queries

## Data Model

### Signature__c Object

| Field | API Name | Type | Description |
|-------|----------|------|-------------|
| Name | `Name` | Auto Number | SIG-{0000} format |
| Signature Image | `SignatureImage__c` | Long Text Area (128KB) | Base64 PNG data |
| Created Date | `CreatedDate` | DateTime | When signature was captured |
| Created By | `CreatedById` | Lookup(User) | Who captured the signature |

## Development

### Prerequisites

- Salesforce CLI (`sf`)
- Node.js 18+ (for local LWC development)
- A Salesforce DevHub for scratch org development

### Create Scratch Org

```bash
# Create scratch org
sf org create scratch --definition-file config/project-scratch-def.json --alias SigDev --duration-days 7

# Push source
sf project deploy start --target-org SigDev

# Assign permission set
sf org assign permset --name SimpleSignAdmin --target-org SigDev

# Open org
sf org open --target-org SigDev
```

### Run Tests

```bash
sf apex run test --code-coverage --result-format human --target-org SigDev
```

### Create Package Version

```bash
# Create beta version
sf package version create --package "Simple Sign" --installation-key-bypass --wait 10

# Promote to released
sf package version promote --package "Simple Sign@1.0.0-1"
```

## Requirements

- Salesforce Enterprise Edition or higher
- Lightning Experience enabled
- API Version 66.0+
- My Domain enabled

## Support

For issues and feature requests, please create an issue in this repository or contact support.

## License

This package is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

**Namespace:** `aph`
**Publisher:** apphero, Inc.
**Version:** 1.0.0
