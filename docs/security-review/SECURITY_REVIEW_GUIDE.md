# Simple Sign — Security Review (4 écrans)

> Guide aligné sur les écrans du Partner Console. Chaque section correspond à un écran/étape du Security Review.

---

## Écran 1 : Linked Solution

**Champs à renseigner :**

| Champ | Valeur |
|-------|---------|
| **Select Solution** | Simple Sign |
| **Select Version** | Spring '26 Patch 3 (v1.3.0) |

**Note :** La version affichée (v1.3.0) correspond au dernier build promu (04tON000000JJWnYAO). Si l'avertissement "package version hasn't passed security review" s'affiche, poursuivre la soumission pour lancer la review.

---

## Écran 2 : Technical Details

> Formulaire "Add Technical Details" — texte à copier dans chaque champ.

Le contenu détaillé est dans [docs/listing/APPEXCHANGE_LISTING.md section 11](../listing/APPEXCHANGE_LISTING.md#11-technical-details-security-review--listing-builder).

**Résumé des toggles :**

| Section | Action |
|---------|--------|
| Describe Your Solution | **Enabled** — copier le bloc texte |
| Web app or service | **Disabled** |
| Platforms other than Salesforce | **Disabled** |
| Integration outside Salesforce | **Disabled** |
| API-only app | **Disabled** |
| Salesforce Platform technology | **Enabled** — copier le bloc |
| OAuth / access tokens | **Disabled** |
| Data outside Platform | **Disabled** |
| Japanese text | **Disabled** |
| Mobile App | **Disabled** (pas d'app mobile native ; le composant LWC fonctionne dans le Salesforce Mobile App) |
| Mobile devices / OS | **Disabled** |
| Browser extension | **Disabled** |
| Desktop/client app | **Disabled** |

---

## Écran 3 : Upload Documentation

| Champ Partner Console | Document à fournir | Fichier source | Action |
|-----------------------|-------------------|----------------|--------|
| **Solution Architecture and Usage** | PDF | [SOLUTION_ARCHITECTURE.md](SOLUTION_ARCHITECTURE.md) | Exporter en PDF → Upload |
| **Sample API Callouts** | PDF | [NO_API_CALLOUTS.md](NO_API_CALLOUTS.md) | Exporter en PDF → Upload |
| **Security Scanner Reports** | Rapport Source Scanner | [security.my.salesforce-sites.com/sourcescanner](https://security.my.salesforce-sites.com/sourcescanner/) | Soumettre package 04t… → Télécharger rapport clean → Upload |
| **False Positives Documentation** | PDF | [FALSE_POSITIVES.md](FALSE_POSITIVES.md) | Si le scanner flag FLS Create : exporter en PDF → Upload. Si rapport clean : cocher *"I confirm that there are no false positives"* |
| **Salesforce Code Analyzer** | Rapport HTML | [CodeAnalyzerReport.html](CodeAnalyzerReport.html) | Upload tel quel |
| **Agentforce Questionnaire** | — | — | **Non applicable** — Simple Sign ne contient pas d'éléments Agentforce |
| **Other Documents** | Optionnel | — | Si demandé par les reviewers |

### Détails par document

**Solution Architecture and Usage**  
Contenu : flux d'information, authentification (session Salesforce), chiffrement (TLS/HTTPS), points de contact des données, instructions d'utilisation.

**Sample API Callouts**  
Simple Sign n'effectue aucun callout HTTP. Le document NO_API_CALLOUTS.md le confirme ; à exporter en PDF.

**Security Scanner Reports**  
Le Source Scanner est sur un portail séparé du Partner Console (pas sous partners.salesforce.com) :

1. **[Partner Security Portal](https://security.my.salesforce-sites.com/sourcescanner/)** — URL directe  
2. Prérequis : être connecté au Partner Community + org Dev Hub ouverte (login.salesforce.com)  
3. Sur le portail, cliquer sur *Login* (authentification via ton org)  
4. Soumettre la version du package (04t…) pour scan  
5. Télécharger le rapport (objectif : 0 vulnérabilités critiques/hautes)  
6. Uploader le rapport dans le Partner Console

**Salesforce Code Analyzer**  
Rapport généré : `CodeAnalyzerReport.html`  
- 1 finding restant : ApexSOQLInjection (faux positif, documenté dans FALSE_POSITIVES.md)
- Flow engine désactivé dans `code-analyzer.yml` (pas de Flows dans le package, Python non requis)

Pour régénérer :
```bash
sf code-analyzer run --rule-selector AppExchange --rule-selector Recommended:Security --output-file docs/security-review/CodeAnalyzerReport.html
```

---

## Écran 4 : Review & Submit

- Vérifier que tous les champs obligatoires sont renseignés  
- Vérifier que les documents sont uploadés (écran 3)  
- Soumettre la Security Review

---

## Référence rapide — Fichiers dans `docs/security-review/`

| Fichier | Usage |
|---------|-------|
| `SOLUTION_ARCHITECTURE.md` | → PDF pour Solution Architecture and Usage |
| `NO_API_CALLOUTS.md` | → PDF pour Sample API Callouts |
| `FALSE_POSITIVES.md` | → PDF pour False Positives Documentation (si le scanner flag) |
| `CodeAnalyzerReport.html` | → Upload direct (Code Analyzer) |
