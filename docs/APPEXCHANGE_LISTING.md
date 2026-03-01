# Simple Sign — AppExchange Listing Guide

> Ce document prépare toutes les informations nécessaires pour soumettre Simple Sign sur le Salesforce AppExchange via le Listing Builder de la Partner Console. Chaque section correspond à un champ ou une étape du processus de soumission.

---

## 1. Listing Identity

| Champ | Valeur recommandée |
|-------|-------------------|
| **Listing Title** | Simple Sign |
| **Publisher** | apphero, Inc. |
| **Listing Type** | Lightning Component |
| **Package Type** | Managed — Second-Generation Package (2GP) |
| **Package ID** | `0HoON00000000hZ0AQ` |
| **Namespace** | `aph` |
| **API Version** | 66.0 |
| **Version Name** | Spring '26 |
| **Version Number** | 1.0.0 |

---

## 2. Tagline (sous-titre)

> Le tagline apparaît directement sous le titre dans les résultats de recherche AppExchange. Il doit être concis, orienté bénéfice, et inclure des mots-clés recherchés.

### Proposition principale

> **Capture electronic signatures natively in Salesforce — on pages, flows & portals.**

### Alternatives

| # | Tagline | Angle |
|---|---------|-------|
| 1 | Capture electronic signatures natively in Salesforce — on pages, flows & portals. | Exhaustivité des surfaces |
| 2 | Draw, save & display e-signatures without leaving Salesforce. | Simplicité du workflow |
| 3 | Lightweight signature pad for Lightning pages, Screen Flows & Experience Cloud. | Technique / admin-friendly |
| 4 | Native e-signature capture — no external service, no file storage consumed. | Différenciation coût |

---

## 3. Overview / Description

> La description complète apparaît sur la page de listing. Elle doit suivre la structure : problème → solution → bénéfices → fonctionnalités → appel à l'action.

### Version anglaise

---

**Stop exporting data to external signature services.** Simple Sign lets your users draw, save, and display electronic signatures directly inside Salesforce — with zero external dependencies.

Built as a native Lightning Web Component, Simple Sign works everywhere your users work: on record pages, in Screen Flows, on App and Home pages, and even in Experience Cloud portals. Signatures are stored as lightweight base64 images inside Salesforce — no file storage consumed, no data leaving your org.

**Why Simple Sign?**

- **100% native** — No external services, no API callouts, no additional licenses to manage
- **Zero file storage impact** — Signatures stored as text data, not as Salesforce files or attachments
- **Works on any object** — Add a lookup field to link signatures to Accounts, Contacts, Opportunities, or any custom object
- **Screen Flow ready** — Full input/output parameter support for flow-based automation and approval processes
- **Mobile & tablet friendly** — Responsive touch-enabled canvas that works in the Salesforce mobile app
- **Experience Cloud compatible** — Embed signature capture in customer and partner portals
- **Enterprise-grade security** — CRUD/FLS enforcement, `with sharing` Apex, parameterized SOQL, validated inputs
- **Multi-language** — Ships with English and French; ready for Translation Workbench

**What's included:**

- `Simple Sign Capture` — Interactive signature drawing canvas with clear/save controls
- `Simple Sign Viewer` — Read-only display of saved signatures with signer name and date
- `Simple Sign Setup` — Step-by-step post-installation guide for admins
- `Signature` custom object with auto-numbered records (SIG-0001, SIG-0002...)
- Two permission sets: Simple Sign User (standard) and Simple Sign Admin (full access)

**Get started in minutes.** Install the package, assign a permission set, drop the component on a Lightning page, and you're ready to capture signatures.

---

### Version française

---

**Arrêtez d'exporter vos données vers des services de signature externes.** Simple Sign permet à vos utilisateurs de dessiner, enregistrer et afficher des signatures électroniques directement dans Salesforce — sans aucune dépendance externe.

Conçu comme un Lightning Web Component natif, Simple Sign fonctionne partout : sur les pages d'enregistrement, dans les Screen Flows, sur les pages d'application et d'accueil, et même dans les portails Experience Cloud. Les signatures sont stockées sous forme d'images base64 légères dans Salesforce — aucun espace fichier consommé, aucune donnée ne quitte votre org.

**Pourquoi Simple Sign ?**

- **100% natif** — Aucun service externe, aucun callout API, aucune licence supplémentaire
- **Zéro impact stockage** — Les signatures sont stockées en texte, pas en fichiers Salesforce
- **Compatible tout objet** — Ajoutez un champ lookup pour lier les signatures à n'importe quel objet
- **Prêt pour les Flows** — Support complet des paramètres d'entrée/sortie pour l'automatisation
- **Mobile & tablette** — Canvas tactile responsive, compatible avec l'app mobile Salesforce
- **Compatible Experience Cloud** — Intégrez la capture de signature dans vos portails clients et partenaires
- **Sécurité enterprise** — Contrôles CRUD/FLS, Apex `with sharing`, SOQL paramétré
- **Multi-langue** — Livré en anglais et français, prêt pour Translation Workbench

---

## 4. Key Highlights / Benefits

> Les highlights (ou "key benefits") sont affichés en bullets sur la page de listing. Ils doivent être courts et percutants.

| # | Highlight | Description |
|---|-----------|-------------|
| 1 | **100% Native to Salesforce** | No external services, APIs, or third-party accounts required. Everything runs inside your org. |
| 2 | **Zero File Storage Impact** | Signatures stored as text data — no Salesforce file storage consumed. |
| 3 | **Works Everywhere** | Lightning pages, Screen Flows, App pages, Home pages, and Experience Cloud portals. |
| 4 | **Mobile & Touch Ready** | Responsive HTML5 canvas works on desktops, tablets, and the Salesforce mobile app. |
| 5 | **Link to Any Object** | Create a lookup field and connect signatures to Accounts, Contacts, Cases, or any custom object. |
| 6 | **Enterprise Security** | CRUD/FLS enforcement, sharing rules respected, input validation, SOQL injection protection. |

---

## 5. Categories & Search Terms

### Catégories recommandées

| Catégorie primaire | Catégorie secondaire |
|-------------------|---------------------|
| **Productivity** | **Document Management** |

> Les concurrents directs (BrightSIGN, EZSign) sont listés sous "Productivity" et "Lightning Components".

### Search Terms (mots-clés)

> Les search terms aident les utilisateurs à trouver votre listing via la recherche AppExchange.

| Priorité | Terme |
|----------|-------|
| Haute | `electronic signature` |
| Haute | `e-signature` |
| Haute | `signature capture` |
| Haute | `signature pad` |
| Moyenne | `digital signature` |
| Moyenne | `sign document` |
| Moyenne | `signature component` |
| Moyenne | `esign` |
| Basse | `canvas signature` |
| Basse | `mobile signature` |
| Basse | `flow signature` |
| Basse | `experience cloud signature` |

---

## 6. Pricing Strategy

### Analyse concurrentielle

| Concurrent | Prix | Modèle |
|-----------|------|--------|
| **BrightSIGN** | Gratuit | Free managed package |
| **EZSign** | À partir de $5/user/mois | Freemium + paid tiers |
| **Simple Signature** (autre) | $1/user/mois | Paid |
| **Docusign** | $$$$ | Enterprise licensing |
| **SignNow** | $$$ | Per-user licensing |

### Recommandations de pricing

| Option | Modèle | Justification |
|--------|--------|---------------|
| **A — Freemium (recommandé)** | Gratuit + plan payant | Maximise les installations et la visibilité. Le plan gratuit attire le trafic, le plan payant monétise les fonctionnalités avancées. |
| **B — Free** | 100% gratuit | Gagne rapidement en adoption et en avis. Monétisation indirecte via services/consulting. |
| **C — Paid only** | $1-3/user/mois | Revenu immédiat mais frein à l'adoption face aux alternatives gratuites. |

### Plan Freemium suggéré

| Fonctionnalité | Free | Pro |
|----------------|------|-----|
| Capture de signature sur record pages | Oui | Oui |
| Viewer sur record pages | Oui | Oui |
| Intégration Screen Flow | Non | Oui |
| Experience Cloud support | Non | Oui |
| Multi-language | Non | Oui |
| Support prioritaire | Non | Oui |

> **Note :** La version actuelle du code ne segmente pas les fonctionnalités. Si vous choisissez le modèle freemium, il faudra implémenter un mécanisme de feature gating (custom metadata, feature parameter, etc.).

---

## 7. Visual Assets

### Logo requirements

| Asset | Dimensions | Format | Notes |
|-------|-----------|--------|-------|
| **Small logo** | 128 x 128 px | JPG ou PNG | Icône du produit. Simple, lisible en petit. |
| **Large logo** | 448 x 328 px | JPG ou PNG | Bannière du listing. Inclure le nom du produit. |

### Recommandations pour le logo

- Utiliser le motif "stylo/plume" cohérent avec l'icône du tab Salesforce (Pen motif déjà configuré)
- Couleurs : bleu Salesforce (#1b96ff) + blanc, pour rester dans l'écosystème visuel
- Style : flat/minimal, professionnel, lisible à 32px

### Screenshots recommandées

| # | Screenshot | Description | Surface montrée |
|---|-----------|-------------|-----------------|
| 1 | **Capture en action** | Canvas avec une signature dessinée, boutons Clear/Save visibles | Record Page Lightning |
| 2 | **Signature sauvegardée** | Vue après sauvegarde montrant le toast de succès et la dernière signature | Record Page Lightning |
| 3 | **Viewer sur un Account** | Viewer affichant la signature liée à un enregistrement Account | Account Record Page |
| 4 | **Screen Flow intégration** | Signature capture dans un Screen Flow avec les paramètres visibles | Flow Builder + Runtime |
| 5 | **Mobile / Tablet** | Capture de signature sur appareil mobile ou tablette | Salesforce Mobile App |
| 6 | **Setup Guide** | L'assistant de configuration post-installation | App Page |

### Recommandations screenshots

- Résolution haute (2x minimum pour Retina)
- Annotations légères : flèches ou encadrés pour guider l'oeil
- Données réalistes (pas de "Test Signature" ou "Lorem Ipsum")
- Montrer le contexte Salesforce autour du composant (navigation, record header)

### Demo Video

| Élément | Recommandation |
|---------|---------------|
| **Durée** | 60-90 secondes |
| **Format** | MP4, hébergé sur YouTube ou Vimeo |
| **Contenu** | 1. Installation rapide → 2. Configuration → 3. Capture de signature → 4. Affichage dans le viewer → 5. Utilisation dans un Flow |
| **Narration** | Voix off professionnelle en anglais, sous-titres français disponibles |

---

## 8. Requirements & Compatibility

### Éditions Salesforce supportées

| Édition | Compatible |
|---------|-----------|
| Enterprise | Oui |
| Unlimited | Oui |
| Performance | Oui |
| Developer | Oui |
| Professional | Non (pas de Apex/LWC) |
| Essentials | Non |

### Prérequis techniques

| Prérequis | Détail |
|-----------|--------|
| Lightning Experience | Requis (pas de support Classic) |
| My Domain | Requis (standard pour Lightning) |
| API Version | 66.0+ |
| Navigateurs | Chrome, Firefox, Edge, Safari (dernières versions) |
| Mobile | Salesforce Mobile App (iOS & Android) |

---

## 9. Support & Documentation

### Liens à fournir dans le listing

| Type | URL recommandée |
|------|----------------|
| **Documentation / Help** | `https://github.com/apphero-tech/signature/wiki` (ou site dédié) |
| **Support Email** | `support@apphero.com` |
| **Demo URL** | URL d'un org de demo ou vidéo YouTube |
| **Release Notes** | `https://github.com/apphero-tech/signature/releases` |
| **Privacy Policy** | `https://apphero.com/privacy` |
| **Terms of Service** | `https://apphero.com/terms` |

> **Action requise :** Créer les pages Privacy Policy et Terms of Service avant la soumission. Elles sont obligatoires pour le listing AppExchange.

---

## 10. Competitive Positioning

### Matrice de différenciation

| Critère | Simple Sign | BrightSIGN | EZSign | Docusign |
|---------|-------------|------------|--------|----------|
| **Prix** | Free / Freemium | Free | $5+/user/mois | $$$$  |
| **Installation** | 2GP Managed | Managed (1GP) | Managed | Connected App |
| **Stockage** | Texte (0 file storage) | Attachment/File | File | Externe |
| **Screen Flow** | Oui (natif) | Non | Partiel | Via API |
| **Experience Cloud** | Oui | Non documenté | Non | Oui |
| **Mobile/Touch** | Oui (HTML5 Canvas) | Oui | Oui | Oui |
| **Multi-langue** | Oui (EN/FR) | Non | Non | Oui |
| **Sécurité CRUD/FLS** | Oui (hardened) | Oui | Inconnu | N/A |
| **Setup Guide intégré** | Oui (composant) | Non | Non | Docs externes |

### Messages clés face à la concurrence

**vs. BrightSIGN** (concurrent gratuit le plus proche) :
> "Unlike legacy solutions, Simple Sign stores signatures as lightweight text — zero file storage consumed. Plus, it works natively in Screen Flows and Experience Cloud."

**vs. solutions payantes (EZSign, Docusign)** :
> "Get enterprise-grade signature capture without the enterprise price tag. Simple Sign is free, native, and requires zero external accounts."

**vs. solutions maison (custom development)** :
> "Why build when you can install? Simple Sign is a tested, security-reviewed, AppExchange-certified component — ready in minutes, not months."

---

## 11. Checklist de soumission AppExchange

### Pré-soumission

- [ ] Security Review passée (Checkmarx scan, manual review)
- [ ] Package version promoted (`sf package version promote`)
- [ ] Tests Apex avec couverture > 75% (actuellement : ~95%)
- [ ] Aucun code en dur (hardcoded IDs, URLs, credentials)
- [ ] Custom Labels utilisées pour tout texte UI
- [ ] Permission Sets correctement configurées
- [ ] Documentation technique prête

### Listing Builder — Contenu

- [ ] Listing Title renseigné
- [ ] Tagline rédigée
- [ ] Description complète (EN)
- [ ] Key Highlights / Benefits (4-6 bullets)
- [ ] Categories sélectionnées
- [ ] Search Terms ajoutés
- [ ] Pricing plan configuré
- [ ] Supported Editions cochées
- [ ] Requirements listés

### Listing Builder — Visuels

- [ ] Small logo uploadé (128x128 px, PNG)
- [ ] Large logo uploadé (448x328 px, PNG)
- [ ] Screenshots uploadées (4-6 minimum)
- [ ] Demo video URL renseignée (YouTube/Vimeo)

### Listing Builder — Liens

- [ ] Documentation URL
- [ ] Support email
- [ ] Privacy Policy URL
- [ ] Terms of Service URL
- [ ] Demo/Trial URL (optionnel)

### Post-soumission

- [ ] Listing approuvé par Salesforce
- [ ] Test d'installation sur un org sandbox
- [ ] Annonce sur réseaux sociaux / blog
- [ ] Demander des avis aux beta-testeurs (objectif : 5+ avis dans les 30 premiers jours)

---

## 12. Growth Strategy (post-lancement)

### Quick wins pour les 90 premiers jours

| Action | Impact | Effort |
|--------|--------|--------|
| Demander des avis AppExchange à 10 contacts | Visibilité +++ | Faible |
| Publier un article blog "How to capture signatures in Salesforce" | SEO + crédibilité | Moyen |
| Créer un Trailhead-style guide (step by step) | Adoption | Moyen |
| Poster sur les communautés Salesforce (Trailblazer, Reddit, X) | Trafic | Faible |
| Ajouter un listing video de 60s | Conversion +40% (source: Salesforce) | Moyen |

### Roadmap fonctionnelle suggérée (pour versions futures)

| Version | Fonctionnalité | Valeur business |
|---------|---------------|----------------|
| 1.1 | Signature multiple (plusieurs signataires sur un même document) | Contrats B2B |
| 1.2 | Export PDF avec signature intégrée | Compliance / archivage |
| 1.3 | Signature avec date/heure stamp overlay | Audit trail visuel |
| 1.4 | Intégration avec Salesforce Files (ContentVersion) | Organisations qui préfèrent Files |
| 2.0 | Template de document + zones de signature | Génération de documents signés |

---

## Annexe : Sources et références

- [Salesforce AppExchange Partner Education](https://partners.salesforce.com/s/education/general/AppExchange_Listing?language=en)
- [Improve Your AppExchange Listing Performance (PDF)](https://www.salesforce.com/en-us/wp-content/uploads/sites/4/documents/partners/readiness/improve-your-appexchange-performance.pdf)
- [ISVforce Guide — Spring '26](https://resources.docs.salesforce.com/latest/latest/en-us/sfdc/pdf/salesforce_packaging_guide.pdf)
- [Trailhead — Optimize Your AppExchange Listing](https://trailhead.salesforce.com/content/learn/modules/appexchange-partners-publishing/appexchange-listing-builder)
- [AppExchange Listing SEO Optimization Checklist 2026](https://www.sfapps.info/appexchange-listing-seo-optimization-checklist-to-improve-listing-visibility/)
- [AppExchange Partner Console Guide (PDF)](https://www.salesforce.com/en-us/wp-content/uploads/sites/4/documents/partners/readiness/the_appexchange_partner_console_guide.pdf)
- Concurrents analysés : [BrightSIGN](https://appexchange.salesforce.com/appxListingDetail?listingId=a0N30000000q5XOEAY), [EZSign](https://appexchange.salesforce.com/appxListingDetail?listingId=a0N30000008YDCCEA4), [Simple Signature](https://appexchange.salesforce.com/appxListingDetail?listingId=a0N3A00000DqCoUUAV)
