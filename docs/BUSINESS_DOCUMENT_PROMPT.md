# Simple Sign — Business Document Prompt

> This document is the single source of truth for generating client-facing documentation via AI tools (NotebookLM, etc.).

---

## 1. Product Identity

| Attribute | Value |
|-----------|-------|
| **Product Name** | Simple Sign |
| **Publisher** | apphero, Inc. |
| **Platform** | Salesforce (Lightning Experience) |
| **Package Type** | Managed 2GP (Second-Generation Package) |
| **Namespace** | `aph` |
| **Target Market** | Salesforce customers needing electronic signature capture inside their CRM |
| **Value Proposition** | A lightweight, mobile-friendly signature pad that lives natively inside Salesforce — on record pages, in flows, and on Experience Cloud portals. No external service needed. |

---

## 2. Applications

### Simple Sign Capture (`simpleSignCapture`)

**Purpose**: Allow users to draw and save electronic signatures directly inside Salesforce.

**Navigation**: Drag-and-drop component available in Lightning App Builder, Screen Flows, and Experience Cloud pages.

**Key Workflows**:
1. User opens a record page or flow screen containing the component
2. User draws a signature on the canvas (touch or mouse)
3. User clicks **Save** — the signature is stored as a base64 PNG image in a `Signature__c` record
4. Optionally, the signature is linked to a parent record via a dynamic lookup field

### Simple Sign Viewer (`simpleSignViewer`)

**Purpose**: Display a previously saved signature image with metadata (date, signer name).

**Navigation**: Place on a `Signature__c` record page via Lightning App Builder.

**Key Workflows**:
1. Component loads the signature image from the current `Signature__c` record
2. Displays the image, creation date, and signer name in a read-only card

---

## 3. Core Modules

### Simple Sign Capture Module

- **Canvas-based drawing**: HTML5 Canvas with smooth line rendering (2.3px blue stroke)
- **Touch and mouse support**: Works on desktop, tablet, and mobile
- **Clear / Save buttons**: Save is disabled until the user draws something
- **Toast confirmation**: Success/error toast notifications after save
- **Flow output**: Exposes the base64 signature value as an output parameter for Screen Flows

### Simple Sign Storage Module

- **Custom Object**: `Signature__c` with auto-numbered names (SIG-0001, SIG-0002, etc.)
- **Image Field**: `SignatureImage__c` — Long Text Area (128 KB) storing base64 PNG data
- **Dynamic Lookup**: Subscribers can add their own lookup fields (e.g., `Account__c`, `Contact__c`) and pass the field API name as a parameter to link signatures to any object

### Simple Sign Viewer Module

- **Read-only viewer**: Shows the saved signature image with creation date and signer name
- **No-signature state**: Displays a friendly message when no signature is found

---

## 4. Security and Permissions

### Permission Sets

| Permission Set | Label | Access Level |
|---------------|-------|-------------|
| `SimpleSignAdmin` | Simple Sign Admin | Full CRUD on `Signature__c`, modify/view all records, delete |
| `SimpleSignUser` | Simple Sign User | Create, read, edit own `Signature__c` records (no delete) |

### Architecture Principles

- Apex controller uses `with sharing` to respect org-wide sharing rules
- All operations enforce CRUD and FLS checks before DML
- Dynamic field assignment validates that the field exists, is a lookup, and is createable
- Parent record ID is validated as a proper Salesforce ID format

---

## 5. Data Model

```
Signature__c (Custom Object)
├── Name (Auto Number: SIG-{0000})
├── SignatureImage__c (Long Text Area, 128 KB)
├── CreatedDate (System)
├── CreatedById (System — Lookup to User)
└── [Subscriber-added lookup fields] (e.g., Account__c, Contact__c)
```

Relationship type: Subscribers add their own lookup or master-detail fields to link signatures to parent objects.

---

## 6. Automation Summary

| Type | Name | Description |
|------|------|-------------|
| Apex Controller | `SimpleSignController` | Saves signature records with CRUD/FLS enforcement and dynamic lookup assignment |

No flows, triggers, or scheduled jobs are included in the package. The component handles everything client-side with a single Apex call.

---

## 7. Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Lightning Web Components (LWC) |
| Backend | Apex (with sharing) |
| Storage | Custom Object (`Signature__c`) |
| Packaging | Salesforce 2GP Managed Package |
| API Version | 66.0 |
| Internationalization | Custom Labels (English/French) |

---

## 8. Glossary

| Term | Definition |
|------|-----------|
| **Signature** | A base64-encoded PNG image of a hand-drawn electronic signature |
| **Simple Sign Capture** | The LWC component that provides the signature drawing canvas |
| **Simple Sign Viewer** | The LWC component that displays a saved signature |
| **Dynamic Lookup** | The ability to link a signature to any parent object by passing a lookup field API name at runtime |
| **2GP** | Second-Generation Package — Salesforce's modern packaging format for AppExchange distribution |
| **Namespace** | The `aph` prefix added to all package components in subscriber orgs |

---

## 9. How to Use This Document

Feed this document to your documentation AI (e.g., NotebookLM) and use prompts like:

- "Write a user guide for Simple Sign aimed at Salesforce administrators"
- "Create an FAQ for end users who need to capture signatures"
- "Generate a technical data sheet for the AppExchange listing"
- "Write installation instructions for a subscriber org"
- "Explain how to use Simple Sign inside a Screen Flow"
- "Describe the security model of Simple Sign for a security review"
