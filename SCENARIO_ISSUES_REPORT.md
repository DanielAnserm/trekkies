# Rapport d'Analyse des Scénarios Trekkie

**Date**: 2025-11-01
**Fichiers analysés**: 57 scénarios, 712 stages, 1454 choix, 4 catégories

---

## 📊 Résumé Exécutif

**94 erreurs critiques** et **105 avertissements** détectés dans les scénarios et catégories.

### Statistiques Globales
- ✅ **Total scénarios**: 57
- ✅ **Total stages**: 712
- ✅ **Total choix**: 1454
- ⚠️ **Choix avec conditions**: 230
- ✅ **Total catégories**: 4
- ✅ **Scénarios dans catégories**: 48
- 📊 **Variables custom détectées**: 29
- ❌ **Erreurs critiques**: 94
- ⚠️ **Avertissements**: 105

---

## 🔴 Erreurs Critiques (94)

### 1. Variables `$goal` Invalides (40 erreurs) - 🚨 PRIORITÉ CRITIQUE

**Problème**: Utilisation de `$goal` au lieu de `_goal`

**Explication**: Selon le tokenizer (`app/infrastructure/utils/tokenizer/tokenizer.ts:141`), seule la variable `$profileId` est acceptée avec le préfixe `$`. **LA VARIABLE `$goal` N'EXISTE PAS** - elle n'est jamais créée dans aucun scénario. La variable correcte est `_goal` qui est créée avec l'opération `set` dans les quiz d'orientation.

**Impact**:
- ❌ **Ces conditions ne fonctionneront JAMAIS**
- ❌ **Bloque l'accès à tous les choix des quiz de réorientation**
- ❌ **Impossible de compléter les quiz de réorientation**

**Scénarios affectés**:
- `reorientation_quiz_migrant` (24 occurrences)
- `reorientation_quiz_csr` (16 occurrences)

**Détails de la variable `_goal`**:
- ✅ **Créée dans**: orientation_quiz_migrant, orientation_quiz_csr, reorientation_quiz_migrant, reorientation_quiz_csr
- ✅ **Utilisée correctement**: 28 fois (dans les catégories validation, renforcement, sélection)
- ✅ **Opération**: `set` avec des valeurs comme `CFC_Peintre`, `CFC_Informaticien`, etc.

**Exemple d'erreur**:

```json
// ❌ INCORRECT - $goal n'existe pas !
{
  "condition": "$goal != 'peintre'"
}

// ✅ CORRECT - _goal est créé avec 'set' dans les quiz
{
  "condition": "_goal != 'peintre'"
}
```

**Action URGENTE**: Rechercher/remplacer `"$goal"` par `"_goal"` dans scenarios.json

---

### 2. Erreurs de Syntaxe JavaScript (45 erreurs) - 🚨 PRIORITÉ CRITIQUE

**Type A: Variables `$goal` invalides** (33 erreurs liées au point 1 ci-dessus)

**Type B: Mot-clé `and` au lieu de `&&`** (12 erreurs)

**Problème**: Utilisation du mot-clé `and` au lieu de l'opérateur JavaScript `&&`

**Scénarios affectés**:
- `selection_ec1_helvetia` (2 erreurs)
- `selection_neutre_1` (2 erreurs)
- `selection_neutre_2` (2 erreurs)
- `selection_neutre_3` (2 erreurs)
- `selection_it1` (2 erreurs)
- `selection_it2_lemanSoft` (2 erreurs)

**Exemple d'erreur**:

```json
// ❌ INCORRECT - 'and' n'est pas valide en JavaScript
{
  "condition": "_ec1Counter >= 12 and _ec1Counter <= 17"
}

// ✅ CORRECT
{
  "condition": "_ec1Counter >= 12 && _ec1Counter <= 17"
}
```

**Localisations**: Stage `decision_finale` - Choix 1 et 2 dans chaque scénario

**Impact**: Crash à l'exécution - condition JavaScript invalide

**Action**: Rechercher/remplacer `" and "` par `" && "` dans les conditions

---

### 3. Variables Utilisées mais Jamais Créées (5 erreurs) - 🔴 PRIORITÉ HAUTE

Ces variables sont utilisées dans des conditions mais ne sont **jamais créées** dans aucun scénario.

#### 3.1 `$goal` ❌

- **Utilisée**: 40 fois
- **Jamais créée**: C'est `_goal` qui est créé, pas `$goal` !
- **Solution**: Voir section 1 ci-dessus

#### 3.2 `_firstExplanation` ❌

- **Utilisée**: 1 fois dans `renforcement_csr_pas_argent_train > Stage R3 > Choice 0`
- **Condition**: `_firstExplanation == 1`
- **Jamais créée**: Variable orpheline
- **Note**: Il existe `_firstExplanation  ` (avec espaces) qui est créé - probablement une erreur de frappe

#### 3.3 `_firstFraud` ❌

- **Utilisée**: 2 fois dans `renforcement_csr_pas_argent_train > Stage R3`
  - Choice 1: `_firstFraud != 1`
  - Choice 2: `_firstFraud == 1`
- **Jamais créée**
- **Note**: Il existe `_firstFraud ` (avec espace) qui est créé - problème d'espaces

#### 3.4 `_calledCoach` ❌

- **Utilisée**: 1 fois dans `renforcement_csr_pas_argent_train > Stage R3 > Choice 3`
- **Condition**: `_calledCoach != 1`
- **Jamais créée**
- **Note**: Il existe `_calledCoach  ` (avec espaces) qui est créé

#### 3.5 `_walked` ❌

- **Utilisée**: 1 fois dans `renforcement_csr_pas_argent_train > Stage R3 > Choice 5`
- **Condition**: `_walked == 1`
- **Jamais créée**
- **Note**: Il existe `_walked  ` (avec espaces) qui est créé

**⚠️ PROBLÈME D'ESPACES DANS LES NOMS DE VARIABLES**

Les variables `_firstExplanation  `, `_firstFraud `, `_calledCoach  `, `_walked  ` existent **AVEC DES ESPACES À LA FIN** dans le scénario `renforcement_csr_pas_argent_train`, mais sont utilisées **SANS ESPACES** dans les conditions.

**Impact**: Les conditions ne matchent jamais car les noms de variables ne correspondent pas exactement.

**Action**: Supprimer les espaces dans les noms de variables dans le JSON

---

### 4. Stages Manquants (4 erreurs) - 🟠 PRIORITÉ MOYENNE

**Problème**: Références à des stages qui n'existent ni dans le JSON ni dans le code

#### `premierStage_Migrant` (3 stages manquants):

```json
// Stage "start" → Choix 0
"next": "incomprehensible"  // ❌ Ce stage n'existe pas

// Stage "1A.1" → Choix 0
"next": "quiz_start"  // ❌ Ce stage n'existe pas

// Stage "2A.1" → Choix 0
"next": "quiz-1"  // ❌ Ce stage n'existe pas
```

#### `perfectionnement_suivi_coach` (1 stage manquant):

```json
"next": "mensonge"  // ❌ Ce stage n'existe pas
```

**Impact**: Erreur ou blocage si le joueur essaie d'accéder à ces stages.

**Action**: Créer les stages manquants ou corriger les références `next`

---

## ⚠️ Avertissements (105)

### 1. Tous les Choix Conditionnels (90 avertissements)

**Risque**: Le joueur pourrait se retrouver bloqué si aucune condition n'est satisfaite

**Scénarios principaux concernés**:
- Quiz d'orientation et réorientation
- Stages de validation
- Stages de sélection

**Recommandation**: Ajouter un choix par défaut sans condition ou s'assurer qu'au moins une condition est toujours vraie

---

### 2. Stages Non Atteignables (9 avertissements)

**Scénarios affectés**:

1. `validation_peintre_emotionnelle` → stage `experience_acquise`
2. `help_caractere` → stage `end`
3. `help_competence` → stage `end`
4. `help_contexte` → stage `end`
5. `help_experience` → stage `end`
6. `help_validation` → stage `end`
7. `help_postulation` → stage `end`
8. `help_sommet` → stage `end`
9. `vase_clos` → stage `two_colleagues`

**Action**: Supprimer les stages inutilisés ou ajouter des références

---

### 3. Variables Créées mais Jamais Utilisées (6 avertissements)

Ces variables ont des **espaces dans leurs noms**, ce qui les rend inutilisables :

1. `_firstFraud ` (avec espace) - Créée dans renforcement_csr_pas_argent_train
2. `_calledCoach  ` (avec 2 espaces) - Créée dans renforcement_csr_pas_argent_train
3. `_walked  ` (avec 2 espaces) - Créée dans renforcement_csr_pas_argent_train
4. `_firstExplanation  ` (avec 2 espaces) - Créée dans renforcement_csr_pas_argent_train
5. `_selectionTry ` (avec espace) - Créée dans selection_neutre_1
6. `_ec1Counter ` (avec espace) - Créée dans selection_ec1_helvetia

**⚠️ Problème**: Les conditions utilisent ces variables **sans espaces**, donc elles ne matchent jamais !

**Action**: Supprimer les espaces dans les noms de variables dans le JSON

---

## 📋 Plan de Correction

### 🚨 Priorité 1 - CRITIQUE (Bloque le jeu)

**1. Corriger `$goal` → `_goal`** (40 occurrences)

```bash
# Dans scenarios.json
Remplacer: "$goal"
Par: "_goal"
```

Fichiers: `reorientation_quiz_migrant`, `reorientation_quiz_csr`

---

**2. Corriger `and` → `&&`** (12 occurrences)

```bash
# Dans les conditions
Remplacer: " and "
Par: " && "
```

Fichiers: `selection_ec1_helvetia`, `selection_neutre_1/2/3`, `selection_it1/2`

---

**3. Supprimer les espaces dans les noms de variables** (6 variables)

Dans `renforcement_csr_pas_argent_train`:
- `_firstFraud ` → `_firstFraud`
- `_calledCoach  ` → `_calledCoach`
- `_walked  ` → `_walked`
- `_firstExplanation  ` → `_firstExplanation`

Dans `selection_neutre_1`:
- `_selectionTry ` → `_selectionTry`

Dans `selection_ec1_helvetia`:
- `_ec1Counter ` → `_ec1Counter`

---

### 🔴 Priorité 2 - Important (Peut causer des bugs)

**4. Créer ou corriger les stages manquants** (4 occurrences)

Pour `premierStage_Migrant`:
- Créer les stages `incomprehensible`, `quiz_start`, `quiz-1` ou corriger les références

Pour `perfectionnement_suivi_coach`:
- Créer le stage `mensonge` ou corriger la référence

---

### 🟠 Priorité 3 - Optimisation

**5. Ajouter des choix par défaut** (90 stages concernés)

Évaluer au cas par cas si un choix sans condition doit être ajouté.

**6. Supprimer les stages non atteignables** (9 stages)

Nettoyer le JSON pour supprimer le contenu inutilisé.

---

## 📊 Rapport des Variables Custom

### Variables Créées et Utilisées (18)

Les variables suivantes fonctionnent correctement :

- `_peintre` - Créée dans: orientation_quiz_migrant, reorientation_quiz_migrant
- `_assc` - Créée dans: orientation_quiz_migrant, orientation_quiz_csr, reorientation_quiz_migrant, reorientation_quiz_csr
- `_logisticien` - Créée dans: orientation_quiz_migrant, reorientation_quiz_migrant
- **`_goal`** - Créée dans: orientation_quiz_migrant, orientation_quiz_csr, reorientation_quiz_migrant, reorientation_quiz_csr (utilisée 28 fois correctement)
- `_validationStep` - Créée dans 27 scénarios, utilisée 26 fois
- `_commerce`, `_informaticien`, `_ase`, `_asa` - Variables de quiz
- `_reorientationDone`, `_validationUnlock` - Variables de progression
- `_neutral1Counter`, `_neutral2Counter`, `_sn3Counter`, `_bonbonSelCounter` - Compteurs de sélection
- `_selectionTry`, `_ec1Counter`, `_it1Counter`, `_it2Counter` - Compteurs d'essais

**📄 Rapport détaillé**: Voir `VARIABLES_REPORT.md` pour toutes les opérations (add/remove/set) sur chaque variable

---

## 🔧 Scripts et Outils

### Script de Vérification

Le script `verify-scenarios.js` effectue une analyse complète en 2 passes :

**Passe 1**: Collection de toutes les variables créées
- Parcourt tous les `changes.playerParameters` dans tous les scénarios
- Enregistre les opérations add/remove/set
- Collecte aussi stats, traits, interests, goals

**Passe 2**: Validation
- Vérifie toutes les conditions dans les scénarios
- Vérifie toutes les conditions dans les catégories
- Détecte les variables utilisées mais jamais créées
- Détecte les variables créées mais jamais utilisées

**Exécution**:
```bash
node verify-scenarios.js
```

**Rapports générés**:
1. `scenario-verification-report.json` - Rapport complet en JSON
2. `VARIABLES_REPORT.md` - Rapport détaillé des variables avec toutes les opérations
3. `SCENARIO_ISSUES_REPORT.md` - Ce rapport

---

## 📄 Détails Techniques

### Variables Système Valides

**Stats** (toujours valides):
```javascript
character, skills, experience, context
```

**Variables spéciales**:
- `$profileId` - Seule variable `$` valide (tokenizer.ts:141, 176)
- `_*` - Variables personnalisées (tokenizer.ts:141, 180)

### Opérateurs Supportés

**✅ Opérateurs valides** (tokenizer.ts:150-156):
```javascript
>, >=, <, <=, ==, !=, &&, ||
```

**❌ Opérateurs NON supportés**:
```javascript
and, or, not  // Utiliser &&, ||, ! à la place
```

### Types d'Opérations sur Variables

**PlayerParameters** (tokenizer.ts:78-82):
- `add` - Ajoute une valeur (peut être négative)
- `remove` - Supprime la variable
- `set` - Définit une valeur absolue

**Stats**:
- `add` - Ajoute à la stat
- `sub` - Soustrait de la stat
- `set` - Définit la stat

**Traits/Interests/Goals**:
- `add` - Ajoute l'élément
- `remove` - Supprime l'élément

---

## ✅ Vérification des Catégories

Le script vérifie aussi les 4 catégories :
- **orientation** (2 scénarios)
- **validation** (28 scénarios)
- **renforcement** (11 scénarios)
- **selection** (7 scénarios)

**Vérifications effectuées**:
- ✅ Conditions des prérequis de catégorie
- ✅ Existence des scénarios référencés
- ✅ Conditions d'accès aux scénarios dans les catégories

---

## 📌 Résumé des Actions Requises

| Priorité | Action | Occurrences | Temps estimé |
|----------|--------|-------------|--------------|
| 🚨 Critique | Remplacer `$goal` par `_goal` | 40 | 5 min |
| 🚨 Critique | Remplacer `and` par `&&` | 12 | 2 min |
| 🚨 Critique | Supprimer espaces dans noms de variables | 6 | 10 min |
| 🔴 Haute | Créer ou corriger stages manquants | 4 | 30 min |
| 🟠 Moyenne | Ajouter choix par défaut | 90 | Variable |
| 🟡 Basse | Nettoyer stages non atteignables | 9 | 15 min |

**Temps total pour les corrections critiques**: ~17 minutes

---

**Généré par**: verify-scenarios.js v2.0
**Rapports complets**:
- scenario-verification-report.json (données brutes)
- VARIABLES_REPORT.md (analyse détaillée des variables)
