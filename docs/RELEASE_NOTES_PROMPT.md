# Simple Sign — Release Notes Prompt

> Use this template to generate release notes for each new package version. Feed it to an AI tool along with the git diff or commit log.

---

## Instructions

1. Run `git log --oneline <previous-tag>..HEAD` to get the list of commits since the last release
2. Feed this prompt + the commit log to your AI tool
3. Review and publish the output

---

## Prompt Template

```
You are writing release notes for Simple Sign, a Salesforce AppExchange managed package
(namespace: aph) that provides electronic signature capture for Lightning Experience.

Product context:
- Simple Sign Capture (simpleSignCapture): canvas-based signature drawing component
- Simple Sign Viewer (simpleSignViewer): read-only signature display component
- SimpleSignController: Apex backend with CRUD/FLS enforcement
- Signature__c: custom object storing base64 PNG signatures
- Permission Sets: SimpleSignAdmin, SimpleSignUser

Target audience: Salesforce administrators and developers who install the package.

Using the commit log below, generate release notes with these sections:

1. **What's New** — new features or capabilities
2. **Improvements** — enhancements to existing functionality
3. **Bug Fixes** — issues resolved
4. **Security** — any security-related changes
5. **Breaking Changes** — anything that requires subscriber action after upgrade
6. **Technical Notes** — API version changes, dependency updates, internal refactoring

Rules:
- Write in English
- Use simple, non-technical language for What's New and Improvements
- Be specific about Breaking Changes (include migration steps if needed)
- Omit empty sections
- Include the version number and date at the top

Commit log:
<paste commits here>
```

---

## Example Output

```markdown
# Simple Sign v1.0.0 — Release Notes (March 2026)

## What's New
- Electronic signature capture component for Lightning record pages, app pages,
  home pages, Screen Flows, and Experience Cloud portals
- Read-only signature viewer component for displaying saved signatures
- Two permission sets: Simple Sign Admin (full access) and Simple Sign User (standard access)

## Security
- Apex controller enforces CRUD and FLS checks before all DML operations
- Dynamic lookup field validation prevents unauthorized field assignment
- Parent record ID format validation prevents injection attacks

## Technical Notes
- API Version: 66.0
- Namespace: aph
- Package Type: Managed 2GP
```
