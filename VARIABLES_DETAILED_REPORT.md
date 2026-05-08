# Rapport Ultra-Détaillé des Variables Custom

**Total de variables custom**: 29

---

## `_asa`

**Statut**: ✅ Fonctionnelle

### 📊 Statistiques

- **Créée dans**: 1 scénario(s)
- **Utilisée dans**: 1 endroit(s)
- **Total d'opérations**: 8

**Scénarios créateurs**: reorientation_quiz_migrant

### 📝 Historique Complet des Opérations

#### 🔧 Créations/Modifications (7)

| Scénario | Location | Opération | Valeur |
|----------|----------|-----------|--------|
| `reorientation_quiz_migrant` | Stage q1 > Choice 2 | **add** | `1` |
| `reorientation_quiz_migrant` | Stage q2 > Choice 2 | **add** | `1` |
| `reorientation_quiz_migrant` | Stage q3 > Choice 1 | **add** | `1` |
| `reorientation_quiz_migrant` | Stage q3 > Choice 2 | **add** | `-1` |
| `reorientation_quiz_migrant` | Stage q4 > Choice 2 | **add** | `1` |
| `reorientation_quiz_migrant` | Stage q5 > Choice 0 | **add** | `1` |
| `reorientation_quiz_migrant` | Stage fin-reorientation > Choice 0 | **remove** | `undefined` |

#### 📖 Utilisations (1)

| Scénario | Location | Condition |
|----------|----------|----------|
| `reorientation_quiz_migrant` | Stage result > Choice 2 | `_asa >= 2 && $goal != 'asa'` |

---

## `_ase`

**Statut**: ✅ Fonctionnelle

### 📊 Statistiques

- **Créée dans**: 2 scénario(s)
- **Utilisée dans**: 2 endroit(s)
- **Total d'opérations**: 17

**Scénarios créateurs**: orientation_quiz_csr, reorientation_quiz_csr

### 📝 Historique Complet des Opérations

#### 🔧 Créations/Modifications (15)

| Scénario | Location | Opération | Valeur |
|----------|----------|-----------|--------|
| `orientation_quiz_csr` | Stage start > Choice 3 | **add** | `1` |
| `orientation_quiz_csr` | Stage q2 > Choice 3 | **add** | `1` |
| `orientation_quiz_csr` | Stage q3 > Choice 3 | **add** | `1` |
| `orientation_quiz_csr` | Stage q4 > Choice 3 | **add** | `1` |
| `orientation_quiz_csr` | Stage q5 > Choice 3 | **add** | `1` |
| `orientation_quiz_csr` | Stage q6 > Choice 3 | **add** | `1` |
| `orientation_quiz_csr` | Stage fin-orientation > Choice 0 | **remove** | `undefined` |
| `reorientation_quiz_csr` | Stage q1 > Choice 3 | **add** | `1` |
| `reorientation_quiz_csr` | Stage q2 > Choice 3 | **add** | `1` |
| `reorientation_quiz_csr` | Stage q3 > Choice 0 | **add** | `-1` |
| `reorientation_quiz_csr` | Stage q3 > Choice 1 | **add** | `1` |
| `reorientation_quiz_csr` | Stage q3 > Choice 2 | **add** | `1` |
| `reorientation_quiz_csr` | Stage q4 > Choice 3 | **add** | `1` |
| `reorientation_quiz_csr` | Stage q5 > Choice 3 | **add** | `1` |
| `reorientation_quiz_csr` | Stage fin-reorientation > Choice 0 | **remove** | `undefined` |

#### 📖 Utilisations (2)

| Scénario | Location | Condition |
|----------|----------|----------|
| `orientation_quiz_csr` | Stage result > Choice 3 | `_ase >= 2` |
| `reorientation_quiz_csr` | Stage result > Choice 3 | `_ase >= 2 && $goal != 'ase'` |

---

## `_assc`

**Statut**: ✅ Fonctionnelle

### 📊 Statistiques

- **Créée dans**: 4 scénario(s)
- **Utilisée dans**: 4 endroit(s)
- **Total d'opérations**: 32

**Scénarios créateurs**: orientation_quiz_migrant, orientation_quiz_csr, reorientation_quiz_migrant, reorientation_quiz_csr

### 📝 Historique Complet des Opérations

#### 🔧 Créations/Modifications (28)

| Scénario | Location | Opération | Valeur |
|----------|----------|-----------|--------|
| `orientation_quiz_migrant` | Stage start > Choice 1 | **add** | `1` |
| `orientation_quiz_migrant` | Stage q2 > Choice 1 | **add** | `1` |
| `orientation_quiz_migrant` | Stage q3 > Choice 1 | **add** | `1` |
| `orientation_quiz_migrant` | Stage q4 > Choice 1 | **add** | `1` |
| `orientation_quiz_migrant` | Stage q5 > Choice 1 | **add** | `1` |
| `orientation_quiz_migrant` | Stage q6 > Choice 1 | **add** | `1` |
| `orientation_quiz_migrant` | Stage fin-orientation > Choice 0 | **remove** | `undefined` |
| `orientation_quiz_csr` | Stage start > Choice 2 | **add** | `1` |
| `orientation_quiz_csr` | Stage q2 > Choice 2 | **add** | `1` |
| `orientation_quiz_csr` | Stage q3 > Choice 2 | **add** | `1` |
| `orientation_quiz_csr` | Stage q4 > Choice 2 | **add** | `1` |
| `orientation_quiz_csr` | Stage q5 > Choice 2 | **add** | `1` |
| `orientation_quiz_csr` | Stage q6 > Choice 2 | **add** | `1` |
| `orientation_quiz_csr` | Stage fin-orientation > Choice 0 | **remove** | `undefined` |
| `reorientation_quiz_migrant` | Stage q1 > Choice 1 | **add** | `1` |
| `reorientation_quiz_migrant` | Stage q2 > Choice 1 | **add** | `1` |
| `reorientation_quiz_migrant` | Stage q3 > Choice 0 | **add** | `-1` |
| `reorientation_quiz_migrant` | Stage q4 > Choice 1 | **add** | `1` |
| `reorientation_quiz_migrant` | Stage q5 > Choice 1 | **add** | `1` |
| `reorientation_quiz_migrant` | Stage fin-reorientation > Choice 0 | **remove** | `undefined` |
| `reorientation_quiz_csr` | Stage q1 > Choice 2 | **add** | `1` |
| `reorientation_quiz_csr` | Stage q2 > Choice 2 | **add** | `1` |
| `reorientation_quiz_csr` | Stage q3 > Choice 0 | **add** | `-1` |
| `reorientation_quiz_csr` | Stage q3 > Choice 1 | **add** | `1` |
| `reorientation_quiz_csr` | Stage q3 > Choice 2 | **add** | `1` |
| `reorientation_quiz_csr` | Stage q4 > Choice 2 | **add** | `1` |
| `reorientation_quiz_csr` | Stage q5 > Choice 2 | **add** | `1` |
| `reorientation_quiz_csr` | Stage fin-reorientation > Choice 0 | **remove** | `undefined` |

#### 📖 Utilisations (4)

| Scénario | Location | Condition |
|----------|----------|----------|
| `orientation_quiz_migrant` | Stage result > Choice 1 | `_assc >=2` |
| `orientation_quiz_csr` | Stage result > Choice 2 | `_assc >= 2` |
| `reorientation_quiz_migrant` | Stage result > Choice 1 | `_assc >= 2 && $goal != 'assc'` |
| `reorientation_quiz_csr` | Stage result > Choice 2 | `_assc >= 2 && $goal != 'assc'` |

---

## `_bonbonSelCounter`

**Statut**: ⚠️ Créée mais jamais utilisée

### 📊 Statistiques

- **Créée dans**: 1 scénario(s)
- **Utilisée dans**: 0 endroit(s)
- **Total d'opérations**: 28

**Scénarios créateurs**: selection_derniere_etape_bonbon

### 📝 Historique Complet des Opérations

#### 🔧 Créations/Modifications (28)

| Scénario | Location | Opération | Valeur |
|----------|----------|-----------|--------|
| `selection_derniere_etape_bonbon` | Stage start > Choice 0 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage start > Choice 1 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage start > Choice 2 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage s1 > Choice 0 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage s1 > Choice 1 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage s1 > Choice 2 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage s2 > Choice 0 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage s2 > Choice 1 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage s2 > Choice 2 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage s3 > Choice 0 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage s3 > Choice 1 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage s3 > Choice 2 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage s4 > Choice 0 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage s4 > Choice 1 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage s4 > Choice 2 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage s5 > Choice 0 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage s5 > Choice 1 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage s5 > Choice 2 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage s6 > Choice 0 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage s6 > Choice 1 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage s6 > Choice 2 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage s7 > Choice 0 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage s7 > Choice 1 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage s7 > Choice 2 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage s8 > Choice 0 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage s8 > Choice 1 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage s8 > Choice 2 | **add** | `1` |
| `selection_derniere_etape_bonbon` | Stage o_accept | **set** | `0` |

---

## `_calledCoach`

**Statut**: ❌ **ERREUR**: Utilisée mais jamais créée

### 📊 Statistiques

- **Créée dans**: 0 scénario(s)
- **Utilisée dans**: 1 endroit(s)
- **Total d'opérations**: 1

### 📝 Historique Complet des Opérations

#### 📖 Utilisations (1)

| Scénario | Location | Condition |
|----------|----------|----------|
| `renforcement_csr_pas_argent_train` | Stage R3 > Choice 3 | `_calledCoach != 1` |

---

## `_calledCoach  `

**Statut**: ⚠️ Créée mais jamais utilisée

### 📊 Statistiques

- **Créée dans**: 1 scénario(s)
- **Utilisée dans**: 0 endroit(s)
- **Total d'opérations**: 1

**Scénarios créateurs**: renforcement_csr_pas_argent_train

### 📝 Historique Complet des Opérations

#### 🔧 Créations/Modifications (1)

| Scénario | Location | Opération | Valeur |
|----------|----------|-----------|--------|
| `renforcement_csr_pas_argent_train` | Stage R2b | **add** | `1` |

---

## `_commerce`

**Statut**: ✅ Fonctionnelle

### 📊 Statistiques

- **Créée dans**: 2 scénario(s)
- **Utilisée dans**: 2 endroit(s)
- **Total d'opérations**: 17

**Scénarios créateurs**: orientation_quiz_csr, reorientation_quiz_csr

### 📝 Historique Complet des Opérations

#### 🔧 Créations/Modifications (15)

| Scénario | Location | Opération | Valeur |
|----------|----------|-----------|--------|
| `orientation_quiz_csr` | Stage start > Choice 0 | **add** | `1` |
| `orientation_quiz_csr` | Stage q2 > Choice 0 | **add** | `1` |
| `orientation_quiz_csr` | Stage q3 > Choice 0 | **add** | `1` |
| `orientation_quiz_csr` | Stage q4 > Choice 0 | **add** | `1` |
| `orientation_quiz_csr` | Stage q5 > Choice 0 | **add** | `1` |
| `orientation_quiz_csr` | Stage q6 > Choice 0 | **add** | `1` |
| `orientation_quiz_csr` | Stage fin-orientation > Choice 0 | **remove** | `undefined` |
| `reorientation_quiz_csr` | Stage q1 > Choice 0 | **add** | `1` |
| `reorientation_quiz_csr` | Stage q2 > Choice 0 | **add** | `1` |
| `reorientation_quiz_csr` | Stage q3 > Choice 0 | **add** | `1` |
| `reorientation_quiz_csr` | Stage q3 > Choice 1 | **add** | `1` |
| `reorientation_quiz_csr` | Stage q3 > Choice 2 | **add** | `-1` |
| `reorientation_quiz_csr` | Stage q4 > Choice 0 | **add** | `1` |
| `reorientation_quiz_csr` | Stage q5 > Choice 0 | **add** | `1` |
| `reorientation_quiz_csr` | Stage fin-reorientation > Choice 0 | **remove** | `undefined` |

#### 📖 Utilisations (2)

| Scénario | Location | Condition |
|----------|----------|----------|
| `orientation_quiz_csr` | Stage result > Choice 0 | `_commerce >= 2` |
| `reorientation_quiz_csr` | Stage result > Choice 0 | `_commerce >= 2 && $goal != 'commerce'` |

---

## `_ec1Counter`

**Statut**: ✅ Fonctionnelle

### 📊 Statistiques

- **Créée dans**: 1 scénario(s)
- **Utilisée dans**: 8 endroit(s)
- **Total d'opérations**: 64

**Scénarios créateurs**: selection_ec1_helvetia

### 📝 Historique Complet des Opérations

#### 🔧 Créations/Modifications (54)

| Scénario | Location | Opération | Valeur |
|----------|----------|-----------|--------|
| `selection_ec1_helvetia` | Stage s1 > Choice 0 | **add** | `1` |
| `selection_ec1_helvetia` | Stage s1 > Choice 1 | **add** | `2` |
| `selection_ec1_helvetia` | Stage s1 > Choice 2 | **add** | `-1` |
| `selection_ec1_helvetia` | Stage s1 > Choice 3 | **add** | `-2` |
| `selection_ec1_helvetia` | Stage s2 > Choice 0 | **add** | `1` |
| `selection_ec1_helvetia` | Stage s2 > Choice 1 | **add** | `2` |
| `selection_ec1_helvetia` | Stage s2 > Choice 2 | **add** | `0` |
| `selection_ec1_helvetia` | Stage s2 > Choice 3 | **add** | `-1` |
| `selection_ec1_helvetia` | Stage s3 > Choice 0 | **add** | `1` |
| `selection_ec1_helvetia` | Stage s3 > Choice 1 | **add** | `0` |
| `selection_ec1_helvetia` | Stage s3 > Choice 2 | **add** | `-2` |
| `selection_ec1_helvetia` | Stage s3 > Choice 3 | **add** | `2` |
| `selection_ec1_helvetia` | Stage s4 > Choice 0 | **add** | `1` |
| `selection_ec1_helvetia` | Stage s4 > Choice 1 | **add** | `2` |
| `selection_ec1_helvetia` | Stage s4 > Choice 2 | **add** | `0` |
| `selection_ec1_helvetia` | Stage s4 > Choice 3 | **add** | `-1` |
| `selection_ec1_helvetia` | Stage sortie_j1 | **set** | `0` |
| `selection_ec1_helvetia` | Stage s5 > Choice 0 | **add** | `2` |
| `selection_ec1_helvetia` | Stage s5 > Choice 1 | **add** | `1` |
| `selection_ec1_helvetia` | Stage s5 > Choice 2 | **add** | `0` |
| `selection_ec1_helvetia` | Stage s5 > Choice 3 | **add** | `-1` |
| `selection_ec1_helvetia` | Stage s6 > Choice 0 | **add** | `1` |
| `selection_ec1_helvetia` | Stage s6 > Choice 1 | **add** | `-1` |
| `selection_ec1_helvetia` | Stage s6 > Choice 2 | **add** | `2` |
| `selection_ec1_helvetia` | Stage s6 > Choice 3 | **add** | `0` |
| `selection_ec1_helvetia` | Stage s7 > Choice 0 | **add** | `1` |
| `selection_ec1_helvetia` | Stage s7 > Choice 1 | **add** | `-1` |
| `selection_ec1_helvetia` | Stage s7 > Choice 2 | **add** | `-2` |
| `selection_ec1_helvetia` | Stage s7 > Choice 3 | **add** | `2` |
| `selection_ec1_helvetia` | Stage s8 > Choice 0 | **add** | `2` |
| `selection_ec1_helvetia` | Stage s8 > Choice 1 | **add** | `1` |
| `selection_ec1_helvetia` | Stage s8 > Choice 2 | **add** | `0` |
| `selection_ec1_helvetia` | Stage s8 > Choice 3 | **add** | `-2` |
| `selection_ec1_helvetia` | Stage sortie_j2 | **set** | `0` |
| `selection_ec1_helvetia` | Stage s9 > Choice 0 | **add** | `1` |
| `selection_ec1_helvetia` | Stage s9 > Choice 1 | **add** | `-1` |
| `selection_ec1_helvetia` | Stage s9 > Choice 2 | **add** | `2` |
| `selection_ec1_helvetia` | Stage s9 > Choice 3 | **add** | `0` |
| `selection_ec1_helvetia` | Stage s10 > Choice 0 | **add** | `1` |
| `selection_ec1_helvetia` | Stage s10 > Choice 1 | **add** | `0` |
| `selection_ec1_helvetia` | Stage s10 > Choice 2 | **add** | `-1` |
| `selection_ec1_helvetia` | Stage s10 > Choice 3 | **add** | `2` |
| `selection_ec1_helvetia` | Stage s11 > Choice 0 | **add** | `2` |
| `selection_ec1_helvetia` | Stage s11 > Choice 1 | **add** | `1` |
| `selection_ec1_helvetia` | Stage s11 > Choice 2 | **add** | `0` |
| `selection_ec1_helvetia` | Stage s11 > Choice 3 | **add** | `-2` |
| `selection_ec1_helvetia` | Stage s12 > Choice 0 | **add** | `1` |
| `selection_ec1_helvetia` | Stage s12 > Choice 1 | **add** | `0` |
| `selection_ec1_helvetia` | Stage s12 > Choice 2 | **add** | `-1` |
| `selection_ec1_helvetia` | Stage s12 > Choice 3 | **add** | `2` |
| `selection_ec1_helvetia` | Stage o_accept | **set** | `0` |
| `selection_ec1_helvetia` | Stage o_prolong | **set** | `0` |
| `selection_ec1_helvetia` | Stage o_refus_reco | **set** | `0` |
| `selection_ec1_helvetia` | Stage o_refus_anticip | **set** | `0` |

#### 📖 Utilisations (10)

| Scénario | Location | Condition |
|----------|----------|----------|
| `selection_ec1_helvetia` | Stage checkpoint_j1 > Choice 0 | `_ec1Counter > 0` |
| `selection_ec1_helvetia` | Stage checkpoint_j1 > Choice 1 | `_ec1Counter == 0` |
| `selection_ec1_helvetia` | Stage checkpoint_j2 > Choice 0 | `_ec1Counter > 0` |
| `selection_ec1_helvetia` | Stage checkpoint_j2 > Choice 1 | `_ec1Counter == 0` |
| `selection_ec1_helvetia` | Stage decision_finale > Choice 0 | `_ec1Counter >= 18` |
| `selection_ec1_helvetia` | Stage decision_finale > Choice 1 | `_ec1Counter >= 12 and _ec1Counter <= 17` |
| `selection_ec1_helvetia` | Stage decision_finale > Choice 1 | `_ec1Counter >= 12 and _ec1Counter <= 17` |
| `selection_ec1_helvetia` | Stage decision_finale > Choice 2 | `_ec1Counter >= 6 and _ec1Counter <= 11` |
| `selection_ec1_helvetia` | Stage decision_finale > Choice 2 | `_ec1Counter >= 6 and _ec1Counter <= 11` |
| `selection_ec1_helvetia` | Stage decision_finale > Choice 3 | `_ec1Counter <= 5` |

---

## `_firstExplanation`

**Statut**: ❌ **ERREUR**: Utilisée mais jamais créée

### 📊 Statistiques

- **Créée dans**: 0 scénario(s)
- **Utilisée dans**: 1 endroit(s)
- **Total d'opérations**: 1

### 📝 Historique Complet des Opérations

#### 📖 Utilisations (1)

| Scénario | Location | Condition |
|----------|----------|----------|
| `renforcement_csr_pas_argent_train` | Stage R3 > Choice 0 | `_firstExplanation == 1` |

---

## `_firstExplanation  `

**Statut**: ⚠️ Créée mais jamais utilisée

### 📊 Statistiques

- **Créée dans**: 1 scénario(s)
- **Utilisée dans**: 0 endroit(s)
- **Total d'opérations**: 1

**Scénarios créateurs**: renforcement_csr_pas_argent_train

### 📝 Historique Complet des Opérations

#### 🔧 Créations/Modifications (1)

| Scénario | Location | Opération | Valeur |
|----------|----------|-----------|--------|
| `renforcement_csr_pas_argent_train` | Stage R2c3 | **add** | `1` |

---

## `_firstFraud`

**Statut**: ❌ **ERREUR**: Utilisée mais jamais créée

### 📊 Statistiques

- **Créée dans**: 0 scénario(s)
- **Utilisée dans**: 2 endroit(s)
- **Total d'opérations**: 2

### 📝 Historique Complet des Opérations

#### 📖 Utilisations (2)

| Scénario | Location | Condition |
|----------|----------|----------|
| `renforcement_csr_pas_argent_train` | Stage R3 > Choice 1 | `_firstFraud != 1` |
| `renforcement_csr_pas_argent_train` | Stage R3 > Choice 2 | `_firstFraud == 1` |

---

## `_firstFraud `

**Statut**: ⚠️ Créée mais jamais utilisée

### 📊 Statistiques

- **Créée dans**: 1 scénario(s)
- **Utilisée dans**: 0 endroit(s)
- **Total d'opérations**: 1

**Scénarios créateurs**: renforcement_csr_pas_argent_train

### 📝 Historique Complet des Opérations

#### 🔧 Créations/Modifications (1)

| Scénario | Location | Opération | Valeur |
|----------|----------|-----------|--------|
| `renforcement_csr_pas_argent_train` | Stage R2a | **add** | `1` |

---

## `_goal`

**Statut**: ✅ Fonctionnelle

### 📊 Statistiques

- **Créée dans**: 4 scénario(s)
- **Utilisée dans**: 28 endroit(s)
- **Total d'opérations**: 50

**Scénarios créateurs**: orientation_quiz_migrant, orientation_quiz_csr, reorientation_quiz_migrant, reorientation_quiz_csr

### 📝 Historique Complet des Opérations

#### 🔧 Créations/Modifications (15)

| Scénario | Location | Opération | Valeur |
|----------|----------|-----------|--------|
| `orientation_quiz_migrant` | Stage result > Choice 0 | **set** | `CFC_Peintre` |
| `orientation_quiz_migrant` | Stage result > Choice 1 | **set** | `CFC_Assistant_en_soins_et_sante_communautaire` |
| `orientation_quiz_migrant` | Stage result > Choice 2 | **set** | `CFC_de_Logisticien` |
| `orientation_quiz_csr` | Stage result > Choice 0 | **set** | `CFC_Employee_de_commerce` |
| `orientation_quiz_csr` | Stage result > Choice 1 | **set** | `CFC_Informaticien` |
| `orientation_quiz_csr` | Stage result > Choice 2 | **set** | `CFC_Assistant_en_soins_et_sante_communautaire` |
| `orientation_quiz_csr` | Stage result > Choice 3 | **set** | `CFC_Assistant_socio-educatif` |
| `reorientation_quiz_migrant` | Stage result > Choice 0 | **set** | `CFC_Peintre` |
| `reorientation_quiz_migrant` | Stage result > Choice 1 | **set** | `CFC_Assistant_en_soins_et_sante_communautaire` |
| `reorientation_quiz_migrant` | Stage result > Choice 2 | **set** | `AFP_Aide_en_soins_et_accompagnement` |
| `reorientation_quiz_migrant` | Stage result > Choice 3 | **set** | `CFC_de_Logisticien` |
| `reorientation_quiz_csr` | Stage result > Choice 0 | **set** | `CFC_Employee_de_commerce` |
| `reorientation_quiz_csr` | Stage result > Choice 1 | **set** | `CFC_Informaticien` |
| `reorientation_quiz_csr` | Stage result > Choice 2 | **set** | `CFC_Assistant_en_soins_et_sante_communautaire` |
| `reorientation_quiz_csr` | Stage result > Choice 3 | **set** | `CFC_Assistant_socio-educatif` |

#### 📖 Utilisations (35)

| Scénario | Location | Condition |
|----------|----------|----------|
| `category:validation` | Cat: Scenario validation_peintre_taches_ingrates | `_validationUnlock < 1 && _goal == CFC_Peintre && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_peintre_ambiance | `_validationUnlock < 1 && _goal == CFC_Peintre && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_peintre_rebarbative | `_validationUnlock < 1 && _goal == CFC_Peintre && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_peintre_emotionnelle | `_validationUnlock < 1 && _goal == CFC_Peintre && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_logisticien_ambiance | `_validationUnlock < 1 && _goal == CFC_de_Logisticien && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_logisticien_taches | `_validationUnlock < 1 && _goal == CFC_de_Logisticien && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_logisticien_progression | `_validationUnlock < 1 && _goal == CFC_de_Logisticien && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_asa_mission_dentier | `_validationUnlock < 1 && _goal == AFP_Aide_en_soins_et_accompagnement && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_ase_ems | `_validationUnlock < 1 && _goal == CFC_Assistant_socio-educatif && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_ase_handicap | `_validationUnlock < 1 && _goal == CFC_Assistant_socio-educatif && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_ase_enfants | `_validationUnlock < 1 && _goal == CFC_Assistant_socio-educatif && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_assc_ems | `(_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 5 && _validationStep > 1 && $profileId == migrant) || (_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 4 && $profileId == beneficiaire_CSR)` |
| `category:validation` | Cat: Scenario validation_assc_ems | `(_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 5 && _validationStep > 1 && $profileId == migrant) || (_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 4 && $profileId == beneficiaire_CSR)` |
| `category:validation` | Cat: Scenario validation_assc_hopital | `(_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 5 && _validationStep > 1 && $profileId == migrant) || (_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 4 && $profileId == beneficiaire_CSR)` |
| `category:validation` | Cat: Scenario validation_assc_hopital | `(_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 5 && _validationStep > 1 && $profileId == migrant) || (_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 4 && $profileId == beneficiaire_CSR)` |
| `category:validation` | Cat: Scenario validation_assc_domicile | `(_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 5 && _validationStep > 1 && $profileId == migrant) || (_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 4 && $profileId == beneficiaire_CSR)` |
| `category:validation` | Cat: Scenario validation_assc_domicile | `(_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 5 && _validationStep > 1 && $profileId == migrant) || (_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 4 && $profileId == beneficiaire_CSR)` |
| `category:validation` | Cat: Scenario validation_assc_fatigue_absence | `_validationUnlock < 1 && _validationStep < 4 && _goal == CFC_Informaticien` |
| `category:validation` | Cat: Scenario validation_informaticien_ambiance | `_validationUnlock < 1 && _goal == CFC_Informaticien && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_informaticien_taches | `_validationUnlock < 1 && _goal == CFC_Informaticien && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_informaticien_progression | `_validationUnlock < 1 && _goal == CFC_Informaticien && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_informaticien_complexite | `_validationUnlock < 1 && _goal == CFC_Informaticien && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_commerce_ambiance | `_validationUnlock < 1 && _goal == CFC_Employee_de_commerce && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_commerce_taches | `_validationUnlock < 1 && _goal == CFC_Employee_de_commerce && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_commerce_progression | `_validationUnlock < 1 && _goal == CFC_Employee_de_commerce && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:renforcement` | Cat: Scenario renforcement_tenue_stage | `($profileId == migrant && _goal == CFC_de_Logisticien) || ($profileId == migrant && _goal == CFC_Assistant_en_soins_et_sante_communautaire) || ($profileId == beneficiaire_CSR && context > 3 && _goal == CFC_Employee_de_commerce) || ($profileId == beneficiaire_CSR && context > 3 && _goal == CFC_Assistant_en_soins_et_sante_communautaire)` |
| `category:renforcement` | Cat: Scenario renforcement_tenue_stage | `($profileId == migrant && _goal == CFC_de_Logisticien) || ($profileId == migrant && _goal == CFC_Assistant_en_soins_et_sante_communautaire) || ($profileId == beneficiaire_CSR && context > 3 && _goal == CFC_Employee_de_commerce) || ($profileId == beneficiaire_CSR && context > 3 && _goal == CFC_Assistant_en_soins_et_sante_communautaire)` |
| `category:renforcement` | Cat: Scenario renforcement_tenue_stage | `($profileId == migrant && _goal == CFC_de_Logisticien) || ($profileId == migrant && _goal == CFC_Assistant_en_soins_et_sante_communautaire) || ($profileId == beneficiaire_CSR && context > 3 && _goal == CFC_Employee_de_commerce) || ($profileId == beneficiaire_CSR && context > 3 && _goal == CFC_Assistant_en_soins_et_sante_communautaire)` |
| `category:renforcement` | Cat: Scenario renforcement_tenue_stage | `($profileId == migrant && _goal == CFC_de_Logisticien) || ($profileId == migrant && _goal == CFC_Assistant_en_soins_et_sante_communautaire) || ($profileId == beneficiaire_CSR && context > 3 && _goal == CFC_Employee_de_commerce) || ($profileId == beneficiaire_CSR && context > 3 && _goal == CFC_Assistant_en_soins_et_sante_communautaire)` |
| `category:renforcement` | Cat: Scenario renforcement_migrant_oser_initiative | `($profileId == migrant && _goal == CFC_de_Logisticien) || ($profileId == migrant && _goal == CFC_Peintre)` |
| `category:renforcement` | Cat: Scenario renforcement_migrant_oser_initiative | `($profileId == migrant && _goal == CFC_de_Logisticien) || ($profileId == migrant && _goal == CFC_Peintre)` |
| `category:selection` | Cat: Scenario selection_csr_ase_assez_forte | `($profileId == beneficiaire_CSR && _goal == CFC_Assistant_socio-educatif && _selectionTry != 3)` |
| `category:selection` | Cat: Scenario selection_ec1_helvetia | `($profileId == beneficiaire_CSR && _goal == CFC_Employee_de_commerce && _selectionTry != 3)` |
| `category:selection` | Cat: Scenario selection_it1 | `(_goal == CFC_Informaticien && _selectionTry != 3)` |
| `category:selection` | Cat: Scenario selection_it2_lemanSoft | `(_goal == CFC_Informaticien && _selectionTry != 3)` |

---

## `_informaticien`

**Statut**: ✅ Fonctionnelle

### 📊 Statistiques

- **Créée dans**: 2 scénario(s)
- **Utilisée dans**: 2 endroit(s)
- **Total d'opérations**: 17

**Scénarios créateurs**: orientation_quiz_csr, reorientation_quiz_csr

### 📝 Historique Complet des Opérations

#### 🔧 Créations/Modifications (15)

| Scénario | Location | Opération | Valeur |
|----------|----------|-----------|--------|
| `orientation_quiz_csr` | Stage start > Choice 1 | **add** | `1` |
| `orientation_quiz_csr` | Stage q2 > Choice 1 | **add** | `1` |
| `orientation_quiz_csr` | Stage q3 > Choice 1 | **add** | `1` |
| `orientation_quiz_csr` | Stage q4 > Choice 1 | **add** | `1` |
| `orientation_quiz_csr` | Stage q5 > Choice 1 | **add** | `1` |
| `orientation_quiz_csr` | Stage q6 > Choice 1 | **add** | `1` |
| `orientation_quiz_csr` | Stage fin-orientation > Choice 0 | **remove** | `undefined` |
| `reorientation_quiz_csr` | Stage q1 > Choice 1 | **add** | `1` |
| `reorientation_quiz_csr` | Stage q2 > Choice 1 | **add** | `1` |
| `reorientation_quiz_csr` | Stage q3 > Choice 0 | **add** | `1` |
| `reorientation_quiz_csr` | Stage q3 > Choice 1 | **add** | `-1` |
| `reorientation_quiz_csr` | Stage q3 > Choice 2 | **add** | `1` |
| `reorientation_quiz_csr` | Stage q4 > Choice 1 | **add** | `1` |
| `reorientation_quiz_csr` | Stage q5 > Choice 1 | **add** | `1` |
| `reorientation_quiz_csr` | Stage fin-reorientation > Choice 0 | **remove** | `undefined` |

#### 📖 Utilisations (2)

| Scénario | Location | Condition |
|----------|----------|----------|
| `orientation_quiz_csr` | Stage result > Choice 1 | `_informaticien >= 2` |
| `reorientation_quiz_csr` | Stage result > Choice 1 | `_informaticien >= 2 && $goal != 'informaticien'` |

---

## `_it1Counter`

**Statut**: ✅ Fonctionnelle

### 📊 Statistiques

- **Créée dans**: 1 scénario(s)
- **Utilisée dans**: 8 endroit(s)
- **Total d'opérations**: 64

**Scénarios créateurs**: selection_it1

### 📝 Historique Complet des Opérations

#### 🔧 Créations/Modifications (54)

| Scénario | Location | Opération | Valeur |
|----------|----------|-----------|--------|
| `selection_it1` | Stage s1 > Choice 0 | **add** | `1` |
| `selection_it1` | Stage s1 > Choice 1 | **add** | `-1` |
| `selection_it1` | Stage s1 > Choice 2 | **add** | `2` |
| `selection_it1` | Stage s1 > Choice 3 | **add** | `-2` |
| `selection_it1` | Stage s2 > Choice 0 | **add** | `-1` |
| `selection_it1` | Stage s2 > Choice 1 | **add** | `2` |
| `selection_it1` | Stage s2 > Choice 2 | **add** | `0` |
| `selection_it1` | Stage s2 > Choice 3 | **add** | `-2` |
| `selection_it1` | Stage s3 > Choice 0 | **add** | `1` |
| `selection_it1` | Stage s3 > Choice 1 | **add** | `-1` |
| `selection_it1` | Stage s3 > Choice 2 | **add** | `-2` |
| `selection_it1` | Stage s3 > Choice 3 | **add** | `2` |
| `selection_it1` | Stage s4 > Choice 0 | **add** | `0` |
| `selection_it1` | Stage s4 > Choice 1 | **add** | `-1` |
| `selection_it1` | Stage s4 > Choice 2 | **add** | `2` |
| `selection_it1` | Stage s4 > Choice 3 | **add** | `-2` |
| `selection_it1` | Stage sortie_j1 | **set** | `0` |
| `selection_it1` | Stage s5 > Choice 0 | **add** | `-1` |
| `selection_it1` | Stage s5 > Choice 1 | **add** | `1` |
| `selection_it1` | Stage s5 > Choice 2 | **add** | `2` |
| `selection_it1` | Stage s5 > Choice 3 | **add** | `-2` |
| `selection_it1` | Stage s6 > Choice 0 | **add** | `-1` |
| `selection_it1` | Stage s6 > Choice 1 | **add** | `-2` |
| `selection_it1` | Stage s6 > Choice 2 | **add** | `1` |
| `selection_it1` | Stage s6 > Choice 3 | **add** | `2` |
| `selection_it1` | Stage s7 > Choice 0 | **add** | `2` |
| `selection_it1` | Stage s7 > Choice 1 | **add** | `0` |
| `selection_it1` | Stage s7 > Choice 2 | **add** | `-2` |
| `selection_it1` | Stage s7 > Choice 3 | **add** | `1` |
| `selection_it1` | Stage s8 > Choice 0 | **add** | `-1` |
| `selection_it1` | Stage s8 > Choice 1 | **add** | `2` |
| `selection_it1` | Stage s8 > Choice 2 | **add** | `-2` |
| `selection_it1` | Stage s8 > Choice 3 | **add** | `1` |
| `selection_it1` | Stage sortie_j2 | **set** | `0` |
| `selection_it1` | Stage s9 > Choice 0 | **add** | `-1` |
| `selection_it1` | Stage s9 > Choice 1 | **add** | `-2` |
| `selection_it1` | Stage s9 > Choice 2 | **add** | `2` |
| `selection_it1` | Stage s9 > Choice 3 | **add** | `1` |
| `selection_it1` | Stage s10 > Choice 0 | **add** | `0` |
| `selection_it1` | Stage s10 > Choice 1 | **add** | `1` |
| `selection_it1` | Stage s10 > Choice 2 | **add** | `-2` |
| `selection_it1` | Stage s10 > Choice 3 | **add** | `2` |
| `selection_it1` | Stage s11 > Choice 0 | **add** | `0` |
| `selection_it1` | Stage s11 > Choice 1 | **add** | `2` |
| `selection_it1` | Stage s11 > Choice 2 | **add** | `1` |
| `selection_it1` | Stage s11 > Choice 3 | **add** | `-2` |
| `selection_it1` | Stage s12 > Choice 0 | **add** | `0` |
| `selection_it1` | Stage s12 > Choice 1 | **add** | `1` |
| `selection_it1` | Stage s12 > Choice 2 | **add** | `2` |
| `selection_it1` | Stage s12 > Choice 3 | **add** | `-1` |
| `selection_it1` | Stage o_accept | **set** | `0` |
| `selection_it1` | Stage o_prolong | **set** | `0` |
| `selection_it1` | Stage o_refus_reco | **set** | `0` |
| `selection_it1` | Stage o_refus_anticip | **set** | `0` |

#### 📖 Utilisations (10)

| Scénario | Location | Condition |
|----------|----------|----------|
| `selection_it1` | Stage checkpoint_j1 > Choice 0 | `_it1Counter > 0` |
| `selection_it1` | Stage checkpoint_j1 > Choice 1 | `_it1Counter == 0` |
| `selection_it1` | Stage checkpoint_j2 > Choice 0 | `_it1Counter > 0` |
| `selection_it1` | Stage checkpoint_j2 > Choice 1 | `_it1Counter == 0` |
| `selection_it1` | Stage decision_finale > Choice 0 | `_it1Counter >= 18` |
| `selection_it1` | Stage decision_finale > Choice 1 | `_it1Counter >= 12 and _it1Counter <= 17` |
| `selection_it1` | Stage decision_finale > Choice 1 | `_it1Counter >= 12 and _it1Counter <= 17` |
| `selection_it1` | Stage decision_finale > Choice 2 | `_it1Counter >= 6 and _it1Counter <= 11` |
| `selection_it1` | Stage decision_finale > Choice 2 | `_it1Counter >= 6 and _it1Counter <= 11` |
| `selection_it1` | Stage decision_finale > Choice 3 | `_it1Counter <= 5` |

---

## `_it2Counter`

**Statut**: ✅ Fonctionnelle

### 📊 Statistiques

- **Créée dans**: 1 scénario(s)
- **Utilisée dans**: 8 endroit(s)
- **Total d'opérations**: 64

**Scénarios créateurs**: selection_it2_lemanSoft

### 📝 Historique Complet des Opérations

#### 🔧 Créations/Modifications (54)

| Scénario | Location | Opération | Valeur |
|----------|----------|-----------|--------|
| `selection_it2_lemanSoft` | Stage s1 > Choice 0 | **add** | `-1` |
| `selection_it2_lemanSoft` | Stage s1 > Choice 1 | **add** | `1` |
| `selection_it2_lemanSoft` | Stage s1 > Choice 2 | **add** | `2` |
| `selection_it2_lemanSoft` | Stage s1 > Choice 3 | **add** | `-2` |
| `selection_it2_lemanSoft` | Stage s2 > Choice 0 | **add** | `0` |
| `selection_it2_lemanSoft` | Stage s2 > Choice 1 | **add** | `1` |
| `selection_it2_lemanSoft` | Stage s2 > Choice 2 | **add** | `2` |
| `selection_it2_lemanSoft` | Stage s2 > Choice 3 | **add** | `-2` |
| `selection_it2_lemanSoft` | Stage s3 > Choice 0 | **add** | `0` |
| `selection_it2_lemanSoft` | Stage s3 > Choice 1 | **add** | `2` |
| `selection_it2_lemanSoft` | Stage s3 > Choice 2 | **add** | `-1` |
| `selection_it2_lemanSoft` | Stage s3 > Choice 3 | **add** | `1` |
| `selection_it2_lemanSoft` | Stage s4 > Choice 0 | **add** | `2` |
| `selection_it2_lemanSoft` | Stage s4 > Choice 1 | **add** | `-1` |
| `selection_it2_lemanSoft` | Stage s4 > Choice 2 | **add** | `-2` |
| `selection_it2_lemanSoft` | Stage s4 > Choice 3 | **add** | `1` |
| `selection_it2_lemanSoft` | Stage sortie_j1 | **set** | `0` |
| `selection_it2_lemanSoft` | Stage s5 > Choice 0 | **add** | `2` |
| `selection_it2_lemanSoft` | Stage s5 > Choice 1 | **add** | `0` |
| `selection_it2_lemanSoft` | Stage s5 > Choice 2 | **add** | `-1` |
| `selection_it2_lemanSoft` | Stage s5 > Choice 3 | **add** | `1` |
| `selection_it2_lemanSoft` | Stage s6 > Choice 0 | **add** | `2` |
| `selection_it2_lemanSoft` | Stage s6 > Choice 1 | **add** | `-1` |
| `selection_it2_lemanSoft` | Stage s6 > Choice 2 | **add** | `1` |
| `selection_it2_lemanSoft` | Stage s6 > Choice 3 | **add** | `-2` |
| `selection_it2_lemanSoft` | Stage s7 > Choice 0 | **add** | `-1` |
| `selection_it2_lemanSoft` | Stage s7 > Choice 1 | **add** | `2` |
| `selection_it2_lemanSoft` | Stage s7 > Choice 2 | **add** | `0` |
| `selection_it2_lemanSoft` | Stage s7 > Choice 3 | **add** | `1` |
| `selection_it2_lemanSoft` | Stage s8 > Choice 0 | **add** | `2` |
| `selection_it2_lemanSoft` | Stage s8 > Choice 1 | **add** | `-1` |
| `selection_it2_lemanSoft` | Stage s8 > Choice 2 | **add** | `-2` |
| `selection_it2_lemanSoft` | Stage s8 > Choice 3 | **add** | `1` |
| `selection_it2_lemanSoft` | Stage sortie_j2 | **set** | `0` |
| `selection_it2_lemanSoft` | Stage s9 > Choice 0 | **add** | `2` |
| `selection_it2_lemanSoft` | Stage s9 > Choice 1 | **add** | `-1` |
| `selection_it2_lemanSoft` | Stage s9 > Choice 2 | **add** | `-2` |
| `selection_it2_lemanSoft` | Stage s9 > Choice 3 | **add** | `1` |
| `selection_it2_lemanSoft` | Stage s10 > Choice 0 | **add** | `2` |
| `selection_it2_lemanSoft` | Stage s10 > Choice 1 | **add** | `-1` |
| `selection_it2_lemanSoft` | Stage s10 > Choice 2 | **add** | `1` |
| `selection_it2_lemanSoft` | Stage s10 > Choice 3 | **add** | `0` |
| `selection_it2_lemanSoft` | Stage s11 > Choice 0 | **add** | `2` |
| `selection_it2_lemanSoft` | Stage s11 > Choice 1 | **add** | `-1` |
| `selection_it2_lemanSoft` | Stage s11 > Choice 2 | **add** | `0` |
| `selection_it2_lemanSoft` | Stage s11 > Choice 3 | **add** | `1` |
| `selection_it2_lemanSoft` | Stage s12 > Choice 0 | **add** | `2` |
| `selection_it2_lemanSoft` | Stage s12 > Choice 1 | **add** | `0` |
| `selection_it2_lemanSoft` | Stage s12 > Choice 2 | **add** | `-1` |
| `selection_it2_lemanSoft` | Stage s12 > Choice 3 | **add** | `1` |
| `selection_it2_lemanSoft` | Stage o_accept | **set** | `0` |
| `selection_it2_lemanSoft` | Stage o_prolong | **set** | `0` |
| `selection_it2_lemanSoft` | Stage o_refus_reco | **set** | `0` |
| `selection_it2_lemanSoft` | Stage o_refus_anticip | **set** | `0` |

#### 📖 Utilisations (10)

| Scénario | Location | Condition |
|----------|----------|----------|
| `selection_it2_lemanSoft` | Stage checkpoint_j1 > Choice 0 | `_it2Counter > 0` |
| `selection_it2_lemanSoft` | Stage checkpoint_j1 > Choice 1 | `_it2Counter <= 0` |
| `selection_it2_lemanSoft` | Stage checkpoint_j2 > Choice 0 | `_it2Counter >= 2` |
| `selection_it2_lemanSoft` | Stage checkpoint_j2 > Choice 1 | `_it2Counter < 2` |
| `selection_it2_lemanSoft` | Stage decision_finale > Choice 0 | `_it2Counter >= 18` |
| `selection_it2_lemanSoft` | Stage decision_finale > Choice 1 | `_it2Counter >= 12 and _it2Counter <= 17` |
| `selection_it2_lemanSoft` | Stage decision_finale > Choice 1 | `_it2Counter >= 12 and _it2Counter <= 17` |
| `selection_it2_lemanSoft` | Stage decision_finale > Choice 2 | `_it2Counter >= 6 and _it2Counter <= 11` |
| `selection_it2_lemanSoft` | Stage decision_finale > Choice 2 | `_it2Counter >= 6 and _it2Counter <= 11` |
| `selection_it2_lemanSoft` | Stage decision_finale > Choice 3 | `_it2Counter <= 5` |

---

## `_logisticien`

**Statut**: ✅ Fonctionnelle

### 📊 Statistiques

- **Créée dans**: 2 scénario(s)
- **Utilisée dans**: 2 endroit(s)
- **Total d'opérations**: 18

**Scénarios créateurs**: orientation_quiz_migrant, reorientation_quiz_migrant

### 📝 Historique Complet des Opérations

#### 🔧 Créations/Modifications (16)

| Scénario | Location | Opération | Valeur |
|----------|----------|-----------|--------|
| `orientation_quiz_migrant` | Stage start > Choice 2 | **add** | `1` |
| `orientation_quiz_migrant` | Stage q2 > Choice 2 | **add** | `1` |
| `orientation_quiz_migrant` | Stage q3 > Choice 2 | **add** | `1` |
| `orientation_quiz_migrant` | Stage q4 > Choice 2 | **add** | `1` |
| `orientation_quiz_migrant` | Stage q5 > Choice 2 | **add** | `1` |
| `orientation_quiz_migrant` | Stage q6 > Choice 2 | **add** | `1` |
| `orientation_quiz_migrant` | Stage fin-orientation > Choice 0 | **remove** | `undefined` |
| `reorientation_quiz_migrant` | Stage q1 > Choice 3 | **add** | `1` |
| `reorientation_quiz_migrant` | Stage q2 > Choice 3 | **add** | `1` |
| `reorientation_quiz_migrant` | Stage q3 > Choice 0 | **add** | `1` |
| `reorientation_quiz_migrant` | Stage q3 > Choice 1 | **add** | `-1` |
| `reorientation_quiz_migrant` | Stage q3 > Choice 2 | **add** | `1` |
| `reorientation_quiz_migrant` | Stage q3 > Choice 3 | **add** | `1` |
| `reorientation_quiz_migrant` | Stage q4 > Choice 3 | **add** | `1` |
| `reorientation_quiz_migrant` | Stage q5 > Choice 2 | **add** | `1` |
| `reorientation_quiz_migrant` | Stage fin-reorientation > Choice 0 | **remove** | `undefined` |

#### 📖 Utilisations (2)

| Scénario | Location | Condition |
|----------|----------|----------|
| `orientation_quiz_migrant` | Stage result > Choice 2 | `_logisticien >=2` |
| `reorientation_quiz_migrant` | Stage result > Choice 3 | `_logisticien >= 2 && $goal != 'logisticien'` |

---

## `_neutral1Counter`

**Statut**: ✅ Fonctionnelle

### 📊 Statistiques

- **Créée dans**: 1 scénario(s)
- **Utilisée dans**: 8 endroit(s)
- **Total d'opérations**: 62

**Scénarios créateurs**: selection_neutre_1

### 📝 Historique Complet des Opérations

#### 🔧 Créations/Modifications (52)

| Scénario | Location | Opération | Valeur |
|----------|----------|-----------|--------|
| `selection_neutre_1` | Stage s1 > Choice 0 | **add** | `1` |
| `selection_neutre_1` | Stage s1 > Choice 1 | **add** | `-1` |
| `selection_neutre_1` | Stage s1 > Choice 2 | **add** | `2` |
| `selection_neutre_1` | Stage s1 > Choice 3 | **add** | `0` |
| `selection_neutre_1` | Stage s2 > Choice 0 | **add** | `-2` |
| `selection_neutre_1` | Stage s2 > Choice 1 | **add** | `1` |
| `selection_neutre_1` | Stage s2 > Choice 2 | **add** | `2` |
| `selection_neutre_1` | Stage s3 > Choice 0 | **add** | `-1` |
| `selection_neutre_1` | Stage s3 > Choice 1 | **add** | `2` |
| `selection_neutre_1` | Stage s3 > Choice 2 | **add** | `0` |
| `selection_neutre_1` | Stage s3 > Choice 3 | **add** | `-2` |
| `selection_neutre_1` | Stage s3 > Choice 4 | **add** | `1` |
| `selection_neutre_1` | Stage s4 > Choice 0 | **add** | `0` |
| `selection_neutre_1` | Stage s4 > Choice 1 | **add** | `2` |
| `selection_neutre_1` | Stage s4 > Choice 2 | **add** | `-2` |
| `selection_neutre_1` | Stage s4 > Choice 3 | **add** | `1` |
| `selection_neutre_1` | Stage sortie_j1 | **set** | `0` |
| `selection_neutre_1` | Stage s5 > Choice 0 | **add** | `1` |
| `selection_neutre_1` | Stage s5 > Choice 1 | **add** | `-2` |
| `selection_neutre_1` | Stage s5 > Choice 2 | **add** | `2` |
| `selection_neutre_1` | Stage s5 > Choice 3 | **add** | `0` |
| `selection_neutre_1` | Stage s6 > Choice 0 | **add** | `1` |
| `selection_neutre_1` | Stage s6 > Choice 1 | **add** | `-2` |
| `selection_neutre_1` | Stage s6 > Choice 2 | **add** | `2` |
| `selection_neutre_1` | Stage s7 > Choice 0 | **add** | `0` |
| `selection_neutre_1` | Stage s7 > Choice 1 | **add** | `2` |
| `selection_neutre_1` | Stage s7 > Choice 2 | **add** | `-1` |
| `selection_neutre_1` | Stage s7 > Choice 3 | **add** | `1` |
| `selection_neutre_1` | Stage s8 > Choice 0 | **add** | `-2` |
| `selection_neutre_1` | Stage s8 > Choice 1 | **add** | `2` |
| `selection_neutre_1` | Stage s8 > Choice 2 | **add** | `1` |
| `selection_neutre_1` | Stage sortie_j2 | **set** | `0` |
| `selection_neutre_1` | Stage s9 > Choice 0 | **add** | `-1` |
| `selection_neutre_1` | Stage s9 > Choice 1 | **add** | `1` |
| `selection_neutre_1` | Stage s9 > Choice 2 | **add** | `0` |
| `selection_neutre_1` | Stage s9 > Choice 3 | **add** | `2` |
| `selection_neutre_1` | Stage s9 > Choice 4 | **add** | `-2` |
| `selection_neutre_1` | Stage s10 > Choice 0 | **add** | `0` |
| `selection_neutre_1` | Stage s10 > Choice 1 | **add** | `1` |
| `selection_neutre_1` | Stage s10 > Choice 2 | **add** | `2` |
| `selection_neutre_1` | Stage s11 > Choice 0 | **add** | `-2` |
| `selection_neutre_1` | Stage s11 > Choice 1 | **add** | `1` |
| `selection_neutre_1` | Stage s11 > Choice 2 | **add** | `2` |
| `selection_neutre_1` | Stage s11 > Choice 3 | **add** | `-1` |
| `selection_neutre_1` | Stage s12 > Choice 0 | **add** | `1` |
| `selection_neutre_1` | Stage s12 > Choice 1 | **add** | `-2` |
| `selection_neutre_1` | Stage s12 > Choice 2 | **add** | `2` |
| `selection_neutre_1` | Stage s12 > Choice 3 | **add** | `0` |
| `selection_neutre_1` | Stage o_accept | **set** | `0` |
| `selection_neutre_1` | Stage o_prolong | **set** | `0` |
| `selection_neutre_1` | Stage o_refus_reco | **set** | `0` |
| `selection_neutre_1` | Stage o_refus_anticip | **set** | `0` |

#### 📖 Utilisations (10)

| Scénario | Location | Condition |
|----------|----------|----------|
| `selection_neutre_1` | Stage checkpoint_j1 > Choice 0 | `_neutral1Counter > 0` |
| `selection_neutre_1` | Stage checkpoint_j1 > Choice 1 | `_neutral1Counter == 0` |
| `selection_neutre_1` | Stage checkpoint_j2 > Choice 0 | `_neutral1Counter > 0` |
| `selection_neutre_1` | Stage checkpoint_j2 > Choice 1 | `_neutral1Counter == 0` |
| `selection_neutre_1` | Stage decision_finale > Choice 0 | `_neutral1Counter >= 18` |
| `selection_neutre_1` | Stage decision_finale > Choice 1 | `_neutral1Counter >= 12 and _neutral1Counter <= 17` |
| `selection_neutre_1` | Stage decision_finale > Choice 1 | `_neutral1Counter >= 12 and _neutral1Counter <= 17` |
| `selection_neutre_1` | Stage decision_finale > Choice 2 | `_neutral1Counter >= 6 and _neutral1Counter <= 11` |
| `selection_neutre_1` | Stage decision_finale > Choice 2 | `_neutral1Counter >= 6 and _neutral1Counter <= 11` |
| `selection_neutre_1` | Stage decision_finale > Choice 3 | `_neutral1Counter <= 5` |

---

## `_neutral2Counter`

**Statut**: ✅ Fonctionnelle

### 📊 Statistiques

- **Créée dans**: 1 scénario(s)
- **Utilisée dans**: 8 endroit(s)
- **Total d'opérations**: 63

**Scénarios créateurs**: selection_neutre_2

### 📝 Historique Complet des Opérations

#### 🔧 Créations/Modifications (53)

| Scénario | Location | Opération | Valeur |
|----------|----------|-----------|--------|
| `selection_neutre_2` | Stage s1 > Choice 0 | **add** | `-1` |
| `selection_neutre_2` | Stage s1 > Choice 1 | **add** | `2` |
| `selection_neutre_2` | Stage s1 > Choice 2 | **add** | `-2` |
| `selection_neutre_2` | Stage s1 > Choice 3 | **add** | `0` |
| `selection_neutre_2` | Stage s2 > Choice 0 | **add** | `0` |
| `selection_neutre_2` | Stage s2 > Choice 1 | **add** | `-1` |
| `selection_neutre_2` | Stage s2 > Choice 2 | **add** | `2` |
| `selection_neutre_2` | Stage s3 > Choice 0 | **add** | `1` |
| `selection_neutre_2` | Stage s3 > Choice 1 | **add** | `-2` |
| `selection_neutre_2` | Stage s3 > Choice 2 | **add** | `0` |
| `selection_neutre_2` | Stage s3 > Choice 3 | **add** | `2` |
| `selection_neutre_2` | Stage s3 > Choice 4 | **add** | `-1` |
| `selection_neutre_2` | Stage s4 > Choice 0 | **add** | `-2` |
| `selection_neutre_2` | Stage s4 > Choice 1 | **add** | `1` |
| `selection_neutre_2` | Stage s4 > Choice 2 | **add** | `-1` |
| `selection_neutre_2` | Stage s4 > Choice 3 | **add** | `2` |
| `selection_neutre_2` | Stage sortie_w1 | **set** | `0` |
| `selection_neutre_2` | Stage s5 > Choice 0 | **add** | `1` |
| `selection_neutre_2` | Stage s5 > Choice 1 | **add** | `-2` |
| `selection_neutre_2` | Stage s5 > Choice 2 | **add** | `2` |
| `selection_neutre_2` | Stage s5 > Choice 3 | **add** | `0` |
| `selection_neutre_2` | Stage s6 > Choice 0 | **add** | `-1` |
| `selection_neutre_2` | Stage s6 > Choice 1 | **add** | `1` |
| `selection_neutre_2` | Stage s6 > Choice 2 | **add** | `2` |
| `selection_neutre_2` | Stage s7 > Choice 0 | **add** | `0` |
| `selection_neutre_2` | Stage s7 > Choice 1 | **add** | `1` |
| `selection_neutre_2` | Stage s7 > Choice 2 | **add** | `-2` |
| `selection_neutre_2` | Stage s7 > Choice 3 | **add** | `2` |
| `selection_neutre_2` | Stage s7 > Choice 4 | **add** | `1` |
| `selection_neutre_2` | Stage s8 > Choice 0 | **add** | `1` |
| `selection_neutre_2` | Stage s8 > Choice 1 | **add** | `-2` |
| `selection_neutre_2` | Stage s8 > Choice 2 | **add** | `2` |
| `selection_neutre_2` | Stage sortie_w2 | **set** | `0` |
| `selection_neutre_2` | Stage s9 > Choice 0 | **add** | `-2` |
| `selection_neutre_2` | Stage s9 > Choice 1 | **add** | `1` |
| `selection_neutre_2` | Stage s9 > Choice 2 | **add** | `2` |
| `selection_neutre_2` | Stage s9 > Choice 3 | **add** | `0` |
| `selection_neutre_2` | Stage s10 > Choice 0 | **add** | `0` |
| `selection_neutre_2` | Stage s10 > Choice 1 | **add** | `-2` |
| `selection_neutre_2` | Stage s10 > Choice 2 | **add** | `2` |
| `selection_neutre_2` | Stage s11 > Choice 0 | **add** | `1` |
| `selection_neutre_2` | Stage s11 > Choice 1 | **add** | `-2` |
| `selection_neutre_2` | Stage s11 > Choice 2 | **add** | `2` |
| `selection_neutre_2` | Stage s11 > Choice 3 | **add** | `-1` |
| `selection_neutre_2` | Stage s11 > Choice 4 | **add** | `1` |
| `selection_neutre_2` | Stage s12 > Choice 0 | **add** | `1` |
| `selection_neutre_2` | Stage s12 > Choice 1 | **add** | `-2` |
| `selection_neutre_2` | Stage s12 > Choice 2 | **add** | `2` |
| `selection_neutre_2` | Stage s12 > Choice 3 | **add** | `0` |
| `selection_neutre_2` | Stage o_accept | **set** | `0` |
| `selection_neutre_2` | Stage o_prolong | **set** | `0` |
| `selection_neutre_2` | Stage o_refus_reco | **set** | `0` |
| `selection_neutre_2` | Stage o_refus_anticip | **set** | `0` |

#### 📖 Utilisations (10)

| Scénario | Location | Condition |
|----------|----------|----------|
| `selection_neutre_2` | Stage checkpoint_w1 > Choice 0 | `_neutral2Counter > 0` |
| `selection_neutre_2` | Stage checkpoint_w1 > Choice 1 | `_neutral2Counter == 0` |
| `selection_neutre_2` | Stage checkpoint_w2 > Choice 0 | `_neutral2Counter > 0` |
| `selection_neutre_2` | Stage checkpoint_w2 > Choice 1 | `_neutral2Counter == 0` |
| `selection_neutre_2` | Stage decision_finale > Choice 0 | `_neutral2Counter >= 18` |
| `selection_neutre_2` | Stage decision_finale > Choice 1 | `_neutral2Counter >= 12 and _neutral2Counter <= 17` |
| `selection_neutre_2` | Stage decision_finale > Choice 1 | `_neutral2Counter >= 12 and _neutral2Counter <= 17` |
| `selection_neutre_2` | Stage decision_finale > Choice 2 | `_neutral2Counter >= 6 and _neutral2Counter <= 11` |
| `selection_neutre_2` | Stage decision_finale > Choice 2 | `_neutral2Counter >= 6 and _neutral2Counter <= 11` |
| `selection_neutre_2` | Stage decision_finale > Choice 3 | `_neutral2Counter <= 5` |

---

## `_peintre`

**Statut**: ✅ Fonctionnelle

### 📊 Statistiques

- **Créée dans**: 2 scénario(s)
- **Utilisée dans**: 2 endroit(s)
- **Total d'opérations**: 17

**Scénarios créateurs**: orientation_quiz_migrant, reorientation_quiz_migrant

### 📝 Historique Complet des Opérations

#### 🔧 Créations/Modifications (15)

| Scénario | Location | Opération | Valeur |
|----------|----------|-----------|--------|
| `orientation_quiz_migrant` | Stage start > Choice 0 | **add** | `1` |
| `orientation_quiz_migrant` | Stage q2 > Choice 0 | **add** | `1` |
| `orientation_quiz_migrant` | Stage q3 > Choice 0 | **add** | `1` |
| `orientation_quiz_migrant` | Stage q4 > Choice 0 | **add** | `1` |
| `orientation_quiz_migrant` | Stage q5 > Choice 0 | **add** | `1` |
| `orientation_quiz_migrant` | Stage q6 > Choice 0 | **add** | `1` |
| `orientation_quiz_migrant` | Stage fin-orientation > Choice 0 | **remove** | `undefined` |
| `reorientation_quiz_migrant` | Stage q1 > Choice 0 | **add** | `1` |
| `reorientation_quiz_migrant` | Stage q2 > Choice 0 | **add** | `1` |
| `reorientation_quiz_migrant` | Stage q3 > Choice 0 | **add** | `1` |
| `reorientation_quiz_migrant` | Stage q3 > Choice 1 | **add** | `-1` |
| `reorientation_quiz_migrant` | Stage q3 > Choice 2 | **add** | `1` |
| `reorientation_quiz_migrant` | Stage q4 > Choice 0 | **add** | `1` |
| `reorientation_quiz_migrant` | Stage q5 > Choice 3 | **add** | `1` |
| `reorientation_quiz_migrant` | Stage fin-reorientation > Choice 0 | **remove** | `undefined` |

#### 📖 Utilisations (2)

| Scénario | Location | Condition |
|----------|----------|----------|
| `orientation_quiz_migrant` | Stage result > Choice 0 | `_peintre >=2` |
| `reorientation_quiz_migrant` | Stage result > Choice 0 | `_peintre >= 2 && $goal != 'peintre'` |

---

## `_reorientationDone`

**Statut**: ✅ Fonctionnelle

### 📊 Statistiques

- **Créée dans**: 2 scénario(s)
- **Utilisée dans**: 2 endroit(s)
- **Total d'opérations**: 5

**Scénarios créateurs**: reorientation_quiz_migrant, reorientation_quiz_csr

### 📝 Historique Complet des Opérations

#### 🔧 Créations/Modifications (2)

| Scénario | Location | Opération | Valeur |
|----------|----------|-----------|--------|
| `reorientation_quiz_migrant` | Stage fin-reorientation > Choice 0 | **add** | `1` |
| `reorientation_quiz_csr` | Stage fin-reorientation > Choice 0 | **add** | `1` |

#### 📖 Utilisations (3)

| Scénario | Location | Condition |
|----------|----------|----------|
| `category:validation` | Cat: Scenario reorientation_quiz_migrant | `_validationUnlock < 1 && _validationStep == 5 && $profileId == migrant && _reorientationDone !=1` |
| `category:validation` | Cat: Scenario bonbon | `(_validationUnlock < 1 && _validationStep == 4 && $profileId == beneficiaire_CSR && _reorientationDone ==1) || (_validationUnlock < 1 && _validationStep == 5 && $profileId == migrant && _reorientationDone ==1)` |
| `category:validation` | Cat: Scenario bonbon | `(_validationUnlock < 1 && _validationStep == 4 && $profileId == beneficiaire_CSR && _reorientationDone ==1) || (_validationUnlock < 1 && _validationStep == 5 && $profileId == migrant && _reorientationDone ==1)` |

---

## `_selectionTry`

**Statut**: ✅ Fonctionnelle

### 📊 Statistiques

- **Créée dans**: 6 scénario(s)
- **Utilisée dans**: 8 endroit(s)
- **Total d'opérations**: 38

**Scénarios créateurs**: selection_ec1_helvetia, selection_neutre_1, selection_neutre_2, selection_neutre_3, selection_it1, selection_it2_lemanSoft

### 📝 Historique Complet des Opérations

#### 🔧 Créations/Modifications (30)

| Scénario | Location | Opération | Valeur |
|----------|----------|-----------|--------|
| `selection_ec1_helvetia` | Stage sortie_j1 | **add** | `1` |
| `selection_ec1_helvetia` | Stage sortie_j2 | **add** | `1` |
| `selection_ec1_helvetia` | Stage o_prolong | **add** | `1` |
| `selection_ec1_helvetia` | Stage o_refus_reco | **add** | `1` |
| `selection_ec1_helvetia` | Stage o_refus_anticip | **add** | `1` |
| `selection_neutre_1` | Stage sortie_j1 | **add** | `1` |
| `selection_neutre_1` | Stage sortie_j2 | **add** | `1` |
| `selection_neutre_1` | Stage o_prolong | **add** | `1` |
| `selection_neutre_1` | Stage o_refus_reco | **add** | `1` |
| `selection_neutre_1` | Stage o_refus_anticip | **add** | `1` |
| `selection_neutre_2` | Stage sortie_w1 | **add** | `1` |
| `selection_neutre_2` | Stage sortie_w2 | **add** | `1` |
| `selection_neutre_2` | Stage o_prolong | **add** | `1` |
| `selection_neutre_2` | Stage o_refus_reco | **add** | `1` |
| `selection_neutre_2` | Stage o_refus_anticip | **add** | `1` |
| `selection_neutre_3` | Stage sortie_s1 | **add** | `1` |
| `selection_neutre_3` | Stage sortie_s2 | **add** | `1` |
| `selection_neutre_3` | Stage o_prolong | **add** | `1` |
| `selection_neutre_3` | Stage o_refus_reco | **add** | `1` |
| `selection_neutre_3` | Stage o_refus_anticip | **add** | `1` |
| `selection_it1` | Stage sortie_j1 | **add** | `1` |
| `selection_it1` | Stage sortie_j2 | **add** | `1` |
| `selection_it1` | Stage o_prolong | **add** | `1` |
| `selection_it1` | Stage o_refus_reco | **add** | `1` |
| `selection_it1` | Stage o_refus_anticip | **add** | `1` |
| `selection_it2_lemanSoft` | Stage sortie_j1 | **add** | `1` |
| `selection_it2_lemanSoft` | Stage sortie_j2 | **add** | `1` |
| `selection_it2_lemanSoft` | Stage o_prolong | **add** | `1` |
| `selection_it2_lemanSoft` | Stage o_refus_reco | **add** | `1` |
| `selection_it2_lemanSoft` | Stage o_refus_anticip | **add** | `1` |

#### 📖 Utilisations (8)

| Scénario | Location | Condition |
|----------|----------|----------|
| `category:selection` | Cat: Scenario selection_csr_ase_assez_forte | `($profileId == beneficiaire_CSR && _goal == CFC_Assistant_socio-educatif && _selectionTry != 3)` |
| `category:selection` | Cat: Scenario selection_ec1_helvetia | `($profileId == beneficiaire_CSR && _goal == CFC_Employee_de_commerce && _selectionTry != 3)` |
| `category:selection` | Cat: Scenario selection_neutre_1 | `_selectionTry != 3` |
| `category:selection` | Cat: Scenario selection_neutre_2 | `_selectionTry != 3` |
| `category:selection` | Cat: Scenario selection_neutre_3 | `_selectionTry != 3` |
| `category:selection` | Cat: Scenario selection_derniere_etape_bonbon | `_selectionTry >= 3` |
| `category:selection` | Cat: Scenario selection_it1 | `(_goal == CFC_Informaticien && _selectionTry != 3)` |
| `category:selection` | Cat: Scenario selection_it2_lemanSoft | `(_goal == CFC_Informaticien && _selectionTry != 3)` |

---

## `_selectionTry `

**Statut**: ⚠️ Créée mais jamais utilisée

### 📊 Statistiques

- **Créée dans**: 1 scénario(s)
- **Utilisée dans**: 0 endroit(s)
- **Total d'opérations**: 3

**Scénarios créateurs**: selection_csr_ase_assez_forte

### 📝 Historique Complet des Opérations

#### 🔧 Créations/Modifications (3)

| Scénario | Location | Opération | Valeur |
|----------|----------|-----------|--------|
| `selection_csr_ase_assez_forte` | Stage O2 | **add** | `1` |
| `selection_csr_ase_assez_forte` | Stage O3 | **add** | `1` |
| `selection_csr_ase_assez_forte` | Stage O4 | **add** | `1` |

---

## `_sn3Counter`

**Statut**: ✅ Fonctionnelle

### 📊 Statistiques

- **Créée dans**: 1 scénario(s)
- **Utilisée dans**: 8 endroit(s)
- **Total d'opérations**: 63

**Scénarios créateurs**: selection_neutre_3

### 📝 Historique Complet des Opérations

#### 🔧 Créations/Modifications (53)

| Scénario | Location | Opération | Valeur |
|----------|----------|-----------|--------|
| `selection_neutre_3` | Stage s1 > Choice 0 | **add** | `1` |
| `selection_neutre_3` | Stage s1 > Choice 1 | **add** | `2` |
| `selection_neutre_3` | Stage s1 > Choice 2 | **add** | `0` |
| `selection_neutre_3` | Stage s1 > Choice 3 | **add** | `-1` |
| `selection_neutre_3` | Stage s2 > Choice 0 | **add** | `2` |
| `selection_neutre_3` | Stage s2 > Choice 1 | **add** | `-1` |
| `selection_neutre_3` | Stage s2 > Choice 2 | **add** | `1` |
| `selection_neutre_3` | Stage s2 > Choice 3 | **add** | `0` |
| `selection_neutre_3` | Stage s2 > Choice 4 | **add** | `-2` |
| `selection_neutre_3` | Stage s3 > Choice 0 | **add** | `2` |
| `selection_neutre_3` | Stage s3 > Choice 1 | **add** | `-2` |
| `selection_neutre_3` | Stage s3 > Choice 2 | **add** | `0` |
| `selection_neutre_3` | Stage s4 > Choice 0 | **add** | `2` |
| `selection_neutre_3` | Stage s4 > Choice 1 | **add** | `0` |
| `selection_neutre_3` | Stage s4 > Choice 2 | **add** | `-2` |
| `selection_neutre_3` | Stage s4 > Choice 3 | **add** | `1` |
| `selection_neutre_3` | Stage sortie_s1 | **set** | `0` |
| `selection_neutre_3` | Stage s5 > Choice 0 | **add** | `0` |
| `selection_neutre_3` | Stage s5 > Choice 1 | **add** | `-1` |
| `selection_neutre_3` | Stage s5 > Choice 2 | **add** | `1` |
| `selection_neutre_3` | Stage s5 > Choice 3 | **add** | `2` |
| `selection_neutre_3` | Stage s6 > Choice 0 | **add** | `1` |
| `selection_neutre_3` | Stage s6 > Choice 1 | **add** | `-2` |
| `selection_neutre_3` | Stage s6 > Choice 2 | **add** | `0` |
| `selection_neutre_3` | Stage s7 > Choice 0 | **add** | `1` |
| `selection_neutre_3` | Stage s7 > Choice 1 | **add** | `0` |
| `selection_neutre_3` | Stage s7 > Choice 2 | **add** | `-2` |
| `selection_neutre_3` | Stage s7 > Choice 3 | **add** | `2` |
| `selection_neutre_3` | Stage s7 > Choice 4 | **add** | `-1` |
| `selection_neutre_3` | Stage s8 > Choice 0 | **add** | `2` |
| `selection_neutre_3` | Stage s8 > Choice 1 | **add** | `0` |
| `selection_neutre_3` | Stage s8 > Choice 2 | **add** | `-1` |
| `selection_neutre_3` | Stage sortie_s2 | **set** | `0` |
| `selection_neutre_3` | Stage s9 > Choice 0 | **add** | `2` |
| `selection_neutre_3` | Stage s9 > Choice 1 | **add** | `1` |
| `selection_neutre_3` | Stage s9 > Choice 2 | **add** | `-1` |
| `selection_neutre_3` | Stage s9 > Choice 3 | **add** | `0` |
| `selection_neutre_3` | Stage s10 > Choice 0 | **add** | `1` |
| `selection_neutre_3` | Stage s10 > Choice 1 | **add** | `-1` |
| `selection_neutre_3` | Stage s10 > Choice 2 | **add** | `2` |
| `selection_neutre_3` | Stage s10 > Choice 3 | **add** | `0` |
| `selection_neutre_3` | Stage s10 > Choice 4 | **add** | `-2` |
| `selection_neutre_3` | Stage s11 > Choice 0 | **add** | `2` |
| `selection_neutre_3` | Stage s11 > Choice 1 | **add** | `1` |
| `selection_neutre_3` | Stage s11 > Choice 2 | **add** | `0` |
| `selection_neutre_3` | Stage s12 > Choice 0 | **add** | `1` |
| `selection_neutre_3` | Stage s12 > Choice 1 | **add** | `2` |
| `selection_neutre_3` | Stage s12 > Choice 2 | **add** | `0` |
| `selection_neutre_3` | Stage s12 > Choice 3 | **add** | `-2` |
| `selection_neutre_3` | Stage o_accept | **set** | `0` |
| `selection_neutre_3` | Stage o_prolong | **set** | `0` |
| `selection_neutre_3` | Stage o_refus_reco | **set** | `0` |
| `selection_neutre_3` | Stage o_refus_anticip | **set** | `0` |

#### 📖 Utilisations (10)

| Scénario | Location | Condition |
|----------|----------|----------|
| `selection_neutre_3` | Stage checkpoint_s1 > Choice 0 | `_sn3Counter > 0` |
| `selection_neutre_3` | Stage checkpoint_s1 > Choice 1 | `_sn3Counter == 0` |
| `selection_neutre_3` | Stage checkpoint_s2 > Choice 0 | `_sn3Counter > 0` |
| `selection_neutre_3` | Stage checkpoint_s2 > Choice 1 | `_sn3Counter == 0` |
| `selection_neutre_3` | Stage decision_finale > Choice 0 | `_sn3Counter >= 18` |
| `selection_neutre_3` | Stage decision_finale > Choice 1 | `_sn3Counter >= 12 and _sn3Counter <= 17` |
| `selection_neutre_3` | Stage decision_finale > Choice 1 | `_sn3Counter >= 12 and _sn3Counter <= 17` |
| `selection_neutre_3` | Stage decision_finale > Choice 2 | `_sn3Counter >= 6 and _sn3Counter <= 11` |
| `selection_neutre_3` | Stage decision_finale > Choice 2 | `_sn3Counter >= 6 and _sn3Counter <= 11` |
| `selection_neutre_3` | Stage decision_finale > Choice 3 | `_sn3Counter <= 5` |

---

## `_validationStep`

**Statut**: ✅ Fonctionnelle

### 📊 Statistiques

- **Créée dans**: 27 scénario(s)
- **Utilisée dans**: 26 endroit(s)
- **Total d'opérations**: 93

**Scénarios créateurs**: orientation_quiz_migrant, orientation_quiz_csr, premierStage_Migrant, reorientation_quiz_migrant, reorientation_quiz_csr, validation_peintre_taches_ingrates, validation_assc_fatigue_absence, validation_peintre_ambiance, validation_peintre_rebarbative, validation_peintre_emotionnelle, validation_logisticien_ambiance, validation_logisticien_taches, validation_logisticien_progression, validation_ase_ems, validation_ase_handicap, validation_ase_enfants, validation_assc_ems, validation_assc_hopital, validation_assc_domicile, validation_informaticien_ambiance, validation_informaticien_taches, validation_informaticien_progression, validation_informaticien_complexite, validation_commerce_ambiance, validation_commerce_taches, validation_commerce_progression, renforcement_tenue_stage

### 📝 Historique Complet des Opérations

#### 🔧 Créations/Modifications (52)

| Scénario | Location | Opération | Valeur |
|----------|----------|-----------|--------|
| `orientation_quiz_migrant` | Stage fin-orientation > Choice 0 | **add** | `1` |
| `orientation_quiz_csr` | Stage fin-orientation > Choice 0 | **add** | `1` |
| `premierStage_Migrant` | Stage 1A.2 | **add** | `1` |
| `premierStage_Migrant` | Stage 2A.3 | **add** | `1` |
| `premierStage_Migrant` | Stage 2A.2 | **add** | `1` |
| `reorientation_quiz_migrant` | Stage fin-reorientation > Choice 0 | **add** | `-1` |
| `reorientation_quiz_csr` | Stage fin-reorientation > Choice 0 | **add** | `-1` |
| `validation_peintre_taches_ingrates` | Stage R4 | **add** | `1` |
| `validation_peintre_taches_ingrates` | Stage R6 | **add** | `1` |
| `validation_peintre_taches_ingrates` | Stage R12 | **add** | `1` |
| `validation_peintre_taches_ingrates` | Stage R15a | **add** | `1` |
| `validation_assc_fatigue_absence` | Stage R3 | **add** | `1` |
| `validation_assc_fatigue_absence` | Stage R11 | **add** | `1` |
| `validation_peintre_ambiance` | Stage fin_mitigee | **add** | `1` |
| `validation_peintre_ambiance` | Stage fin_difficile | **add** | `1` |
| `validation_peintre_rebarbative` | Stage fin_mitigee | **add** | `1` |
| `validation_peintre_rebarbative` | Stage fin_difficile | **add** | `1` |
| `validation_peintre_emotionnelle` | Stage fin_mitigee | **add** | `1` |
| `validation_peintre_emotionnelle` | Stage fin_difficile | **add** | `1` |
| `validation_logisticien_ambiance` | Stage fin_neutre | **add** | `1` |
| `validation_logisticien_ambiance` | Stage fin_difficile | **add** | `1` |
| `validation_logisticien_taches` | Stage fin_neutre | **add** | `1` |
| `validation_logisticien_taches` | Stage fin_difficile | **add** | `1` |
| `validation_logisticien_progression` | Stage fin_moyenne | **add** | `1` |
| `validation_ase_ems` | Stage fin_mitigee | **add** | `1` |
| `validation_ase_ems` | Stage fin_difficile | **add** | `1` |
| `validation_ase_handicap` | Stage fin_mitigee | **add** | `1` |
| `validation_ase_enfants` | Stage fin_mitigee | **add** | `1` |
| `validation_ase_enfants` | Stage fin_difficile | **add** | `1` |
| `validation_assc_ems` | Stage fin_mitigee | **add** | `1` |
| `validation_assc_ems` | Stage echec | **add** | `1` |
| `validation_assc_hopital` | Stage mitigee | **add** | `1` |
| `validation_assc_hopital` | Stage echec | **add** | `1` |
| `validation_assc_domicile` | Stage mitigee | **add** | `1` |
| `validation_assc_domicile` | Stage echec | **add** | `1` |
| `validation_informaticien_ambiance` | Stage fin_neutre | **add** | `1` |
| `validation_informaticien_ambiance` | Stage fin_difficile | **add** | `1` |
| `validation_informaticien_taches` | Stage fin_neutre | **add** | `1` |
| `validation_informaticien_taches` | Stage fin_difficile | **add** | `1` |
| `validation_informaticien_progression` | Stage fin_neutre | **add** | `1` |
| `validation_informaticien_progression` | Stage fin_difficile | **add** | `1` |
| `validation_informaticien_complexite` | Stage fin_neutre | **add** | `1` |
| `validation_informaticien_complexite` | Stage fin_difficile | **add** | `1` |
| `validation_commerce_ambiance` | Stage fin_neutre | **add** | `1` |
| `validation_commerce_ambiance` | Stage fin_difficile | **add** | `1` |
| `validation_commerce_taches` | Stage fin_neutre | **add** | `1` |
| `validation_commerce_taches` | Stage fin_difficile | **add** | `1` |
| `validation_commerce_progression` | Stage fin_correcte | **add** | `1` |
| `validation_commerce_progression` | Stage fin_difficile | **add** | `1` |
| `renforcement_tenue_stage` | Stage R15 | **add** | `1` |
| `renforcement_tenue_stage` | Stage R17 | **add** | `1` |
| `renforcement_tenue_stage` | Stage R19 | **add** | `1` |

#### 📖 Utilisations (41)

| Scénario | Location | Condition |
|----------|----------|----------|
| `category:validation` | Cat: Scenario premierStage_Migrant | `_validationUnlock < 1 && _validationStep == 1 && $profileId == migrant` |
| `category:validation` | Cat: Scenario reorientation_quiz_migrant | `_validationUnlock < 1 && _validationStep == 5 && $profileId == migrant && _reorientationDone !=1` |
| `category:validation` | Cat: Scenario reorientation_quiz_csr | `_validationUnlock < 1 && _validationStep == 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario bonbon | `(_validationUnlock < 1 && _validationStep == 4 && $profileId == beneficiaire_CSR && _reorientationDone ==1) || (_validationUnlock < 1 && _validationStep == 5 && $profileId == migrant && _reorientationDone ==1)` |
| `category:validation` | Cat: Scenario bonbon | `(_validationUnlock < 1 && _validationStep == 4 && $profileId == beneficiaire_CSR && _reorientationDone ==1) || (_validationUnlock < 1 && _validationStep == 5 && $profileId == migrant && _reorientationDone ==1)` |
| `category:validation` | Cat: Scenario validation_peintre_taches_ingrates | `_validationUnlock < 1 && _goal == CFC_Peintre && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_peintre_taches_ingrates | `_validationUnlock < 1 && _goal == CFC_Peintre && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_peintre_ambiance | `_validationUnlock < 1 && _goal == CFC_Peintre && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_peintre_ambiance | `_validationUnlock < 1 && _goal == CFC_Peintre && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_peintre_rebarbative | `_validationUnlock < 1 && _goal == CFC_Peintre && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_peintre_rebarbative | `_validationUnlock < 1 && _goal == CFC_Peintre && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_peintre_emotionnelle | `_validationUnlock < 1 && _goal == CFC_Peintre && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_peintre_emotionnelle | `_validationUnlock < 1 && _goal == CFC_Peintre && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_logisticien_ambiance | `_validationUnlock < 1 && _goal == CFC_de_Logisticien && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_logisticien_ambiance | `_validationUnlock < 1 && _goal == CFC_de_Logisticien && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_logisticien_taches | `_validationUnlock < 1 && _goal == CFC_de_Logisticien && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_logisticien_taches | `_validationUnlock < 1 && _goal == CFC_de_Logisticien && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_logisticien_progression | `_validationUnlock < 1 && _goal == CFC_de_Logisticien && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_logisticien_progression | `_validationUnlock < 1 && _goal == CFC_de_Logisticien && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_asa_mission_dentier | `_validationUnlock < 1 && _goal == AFP_Aide_en_soins_et_accompagnement && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_asa_mission_dentier | `_validationUnlock < 1 && _goal == AFP_Aide_en_soins_et_accompagnement && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_ase_ems | `_validationUnlock < 1 && _goal == CFC_Assistant_socio-educatif && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_ase_handicap | `_validationUnlock < 1 && _goal == CFC_Assistant_socio-educatif && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_ase_enfants | `_validationUnlock < 1 && _goal == CFC_Assistant_socio-educatif && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_assc_ems | `(_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 5 && _validationStep > 1 && $profileId == migrant) || (_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 4 && $profileId == beneficiaire_CSR)` |
| `category:validation` | Cat: Scenario validation_assc_ems | `(_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 5 && _validationStep > 1 && $profileId == migrant) || (_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 4 && $profileId == beneficiaire_CSR)` |
| `category:validation` | Cat: Scenario validation_assc_ems | `(_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 5 && _validationStep > 1 && $profileId == migrant) || (_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 4 && $profileId == beneficiaire_CSR)` |
| `category:validation` | Cat: Scenario validation_assc_hopital | `(_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 5 && _validationStep > 1 && $profileId == migrant) || (_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 4 && $profileId == beneficiaire_CSR)` |
| `category:validation` | Cat: Scenario validation_assc_hopital | `(_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 5 && _validationStep > 1 && $profileId == migrant) || (_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 4 && $profileId == beneficiaire_CSR)` |
| `category:validation` | Cat: Scenario validation_assc_hopital | `(_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 5 && _validationStep > 1 && $profileId == migrant) || (_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 4 && $profileId == beneficiaire_CSR)` |
| `category:validation` | Cat: Scenario validation_assc_domicile | `(_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 5 && _validationStep > 1 && $profileId == migrant) || (_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 4 && $profileId == beneficiaire_CSR)` |
| `category:validation` | Cat: Scenario validation_assc_domicile | `(_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 5 && _validationStep > 1 && $profileId == migrant) || (_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 4 && $profileId == beneficiaire_CSR)` |
| `category:validation` | Cat: Scenario validation_assc_domicile | `(_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 5 && _validationStep > 1 && $profileId == migrant) || (_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 4 && $profileId == beneficiaire_CSR)` |
| `category:validation` | Cat: Scenario validation_assc_fatigue_absence | `_validationUnlock < 1 && _validationStep < 4 && _goal == CFC_Informaticien` |
| `category:validation` | Cat: Scenario validation_informaticien_ambiance | `_validationUnlock < 1 && _goal == CFC_Informaticien && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_informaticien_taches | `_validationUnlock < 1 && _goal == CFC_Informaticien && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_informaticien_progression | `_validationUnlock < 1 && _goal == CFC_Informaticien && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_informaticien_complexite | `_validationUnlock < 1 && _goal == CFC_Informaticien && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_commerce_ambiance | `_validationUnlock < 1 && _goal == CFC_Employee_de_commerce && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_commerce_taches | `_validationUnlock < 1 && _goal == CFC_Employee_de_commerce && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_commerce_progression | `_validationUnlock < 1 && _goal == CFC_Employee_de_commerce && _validationStep < 4 && $profileId == beneficiaire_CSR` |

---

## `_validationUnlock`

**Statut**: ✅ Fonctionnelle

### 📊 Statistiques

- **Créée dans**: 24 scénario(s)
- **Utilisée dans**: 26 endroit(s)
- **Total d'opérations**: 67

**Scénarios créateurs**: bonbon, validation_peintre_taches_ingrates, validation_assc_fatigue_absence, validation_peintre_ambiance, validation_peintre_rebarbative, validation_peintre_emotionnelle, validation_logisticien_ambiance, validation_logisticien_taches, validation_logisticien_progression, validation_asa_mission_dentier, validation_ase_ems, validation_ase_handicap, validation_ase_enfants, validation_assc_ems, validation_assc_hopital, validation_assc_domicile, validation_informaticien_ambiance, validation_informaticien_taches, validation_informaticien_progression, validation_informaticien_complexite, validation_commerce_ambiance, validation_commerce_taches, validation_commerce_progression, renforcement_tenue_stage

### 📝 Historique Complet des Opérations

#### 🔧 Créations/Modifications (37)

| Scénario | Location | Opération | Valeur |
|----------|----------|-----------|--------|
| `bonbon` | Stage O1 | **add** | `1` |
| `validation_peintre_taches_ingrates` | Stage R16a | **add** | `1` |
| `validation_peintre_taches_ingrates` | Stage R15b | **add** | `1` |
| `validation_peintre_taches_ingrates` | Stage R16b | **add** | `1` |
| `validation_peintre_taches_ingrates` | Stage R17b | **add** | `1` |
| `validation_assc_fatigue_absence` | Stage R7 | **add** | `1` |
| `validation_assc_fatigue_absence` | Stage R9 | **add** | `1` |
| `validation_assc_fatigue_absence` | Stage R14 | **add** | `1` |
| `validation_assc_fatigue_absence` | Stage R15 | **add** | `1` |
| `validation_assc_fatigue_absence` | Stage R18 | **add** | `1` |
| `validation_peintre_ambiance` | Stage validation | **add** | `1` |
| `validation_peintre_rebarbative` | Stage validation | **add** | `1` |
| `validation_peintre_emotionnelle` | Stage validation | **add** | `1` |
| `validation_logisticien_ambiance` | Stage fin_positive | **add** | `1` |
| `validation_logisticien_taches` | Stage fin_propre | **add** | `1` |
| `validation_logisticien_progression` | Stage fin_reussie | **add** | `1` |
| `validation_asa_mission_dentier` | Stage fin_humoristique | **add** | `1` |
| `validation_asa_mission_dentier` | Stage fin_reussie | **add** | `1` |
| `validation_asa_mission_dentier` | Stage fin_legere | **add** | `1` |
| `validation_asa_mission_dentier` | Stage fin_humaine | **add** | `1` |
| `validation_ase_ems` | Stage validation | **add** | `1` |
| `validation_ase_handicap` | Stage validation | **add** | `1` |
| `validation_ase_enfants` | Stage validation | **add** | `1` |
| `validation_assc_ems` | Stage validation | **add** | `1` |
| `validation_assc_hopital` | Stage validation | **add** | `1` |
| `validation_assc_domicile` | Stage validation | **add** | `1` |
| `validation_informaticien_ambiance` | Stage fin_encourageante | **add** | `1` |
| `validation_informaticien_taches` | Stage fin_constructive | **add** | `1` |
| `validation_informaticien_progression` | Stage fin_positive | **add** | `1` |
| `validation_informaticien_complexite` | Stage validation | **add** | `1` |
| `validation_commerce_ambiance` | Stage fin_positive | **add** | `1` |
| `validation_commerce_taches` | Stage fin_valorisante | **add** | `1` |
| `validation_commerce_progression` | Stage fin_valorisee | **add** | `1` |
| `renforcement_tenue_stage` | Stage R8 | **add** | `1` |
| `renforcement_tenue_stage` | Stage R13 | **add** | `1` |
| `renforcement_tenue_stage` | Stage R18 | **add** | `1` |
| `renforcement_tenue_stage` | Stage R20 | **add** | `1` |

#### 📖 Utilisations (30)

| Scénario | Location | Condition |
|----------|----------|----------|
| `category:validation` | Cat: Scenario premierStage_Migrant | `_validationUnlock < 1 && _validationStep == 1 && $profileId == migrant` |
| `category:validation` | Cat: Scenario reorientation_quiz_migrant | `_validationUnlock < 1 && _validationStep == 5 && $profileId == migrant && _reorientationDone !=1` |
| `category:validation` | Cat: Scenario reorientation_quiz_csr | `_validationUnlock < 1 && _validationStep == 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario bonbon | `(_validationUnlock < 1 && _validationStep == 4 && $profileId == beneficiaire_CSR && _reorientationDone ==1) || (_validationUnlock < 1 && _validationStep == 5 && $profileId == migrant && _reorientationDone ==1)` |
| `category:validation` | Cat: Scenario bonbon | `(_validationUnlock < 1 && _validationStep == 4 && $profileId == beneficiaire_CSR && _reorientationDone ==1) || (_validationUnlock < 1 && _validationStep == 5 && $profileId == migrant && _reorientationDone ==1)` |
| `category:validation` | Cat: Scenario validation_peintre_taches_ingrates | `_validationUnlock < 1 && _goal == CFC_Peintre && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_peintre_ambiance | `_validationUnlock < 1 && _goal == CFC_Peintre && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_peintre_rebarbative | `_validationUnlock < 1 && _goal == CFC_Peintre && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_peintre_emotionnelle | `_validationUnlock < 1 && _goal == CFC_Peintre && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_logisticien_ambiance | `_validationUnlock < 1 && _goal == CFC_de_Logisticien && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_logisticien_taches | `_validationUnlock < 1 && _goal == CFC_de_Logisticien && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_logisticien_progression | `_validationUnlock < 1 && _goal == CFC_de_Logisticien && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_asa_mission_dentier | `_validationUnlock < 1 && _goal == AFP_Aide_en_soins_et_accompagnement && _validationStep < 5 && _validationStep > 1` |
| `category:validation` | Cat: Scenario validation_ase_ems | `_validationUnlock < 1 && _goal == CFC_Assistant_socio-educatif && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_ase_handicap | `_validationUnlock < 1 && _goal == CFC_Assistant_socio-educatif && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_ase_enfants | `_validationUnlock < 1 && _goal == CFC_Assistant_socio-educatif && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_assc_ems | `(_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 5 && _validationStep > 1 && $profileId == migrant) || (_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 4 && $profileId == beneficiaire_CSR)` |
| `category:validation` | Cat: Scenario validation_assc_ems | `(_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 5 && _validationStep > 1 && $profileId == migrant) || (_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 4 && $profileId == beneficiaire_CSR)` |
| `category:validation` | Cat: Scenario validation_assc_hopital | `(_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 5 && _validationStep > 1 && $profileId == migrant) || (_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 4 && $profileId == beneficiaire_CSR)` |
| `category:validation` | Cat: Scenario validation_assc_hopital | `(_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 5 && _validationStep > 1 && $profileId == migrant) || (_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 4 && $profileId == beneficiaire_CSR)` |
| `category:validation` | Cat: Scenario validation_assc_domicile | `(_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 5 && _validationStep > 1 && $profileId == migrant) || (_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 4 && $profileId == beneficiaire_CSR)` |
| `category:validation` | Cat: Scenario validation_assc_domicile | `(_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 5 && _validationStep > 1 && $profileId == migrant) || (_validationUnlock < 1 && _goal == CFC_Assistant_en_soins_et_sante_communautaire && _validationStep < 4 && $profileId == beneficiaire_CSR)` |
| `category:validation` | Cat: Scenario validation_assc_fatigue_absence | `_validationUnlock < 1 && _validationStep < 4 && _goal == CFC_Informaticien` |
| `category:validation` | Cat: Scenario validation_informaticien_ambiance | `_validationUnlock < 1 && _goal == CFC_Informaticien && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_informaticien_taches | `_validationUnlock < 1 && _goal == CFC_Informaticien && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_informaticien_progression | `_validationUnlock < 1 && _goal == CFC_Informaticien && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_informaticien_complexite | `_validationUnlock < 1 && _goal == CFC_Informaticien && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_commerce_ambiance | `_validationUnlock < 1 && _goal == CFC_Employee_de_commerce && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_commerce_taches | `_validationUnlock < 1 && _goal == CFC_Employee_de_commerce && _validationStep < 4 && $profileId == beneficiaire_CSR` |
| `category:validation` | Cat: Scenario validation_commerce_progression | `_validationUnlock < 1 && _goal == CFC_Employee_de_commerce && _validationStep < 4 && $profileId == beneficiaire_CSR` |

---

## `_walked`

**Statut**: ❌ **ERREUR**: Utilisée mais jamais créée

### 📊 Statistiques

- **Créée dans**: 0 scénario(s)
- **Utilisée dans**: 1 endroit(s)
- **Total d'opérations**: 1

### 📝 Historique Complet des Opérations

#### 📖 Utilisations (1)

| Scénario | Location | Condition |
|----------|----------|----------|
| `renforcement_csr_pas_argent_train` | Stage R3 > Choice 5 | `_walked == 1` |

---

## `_walked  `

**Statut**: ⚠️ Créée mais jamais utilisée

### 📊 Statistiques

- **Créée dans**: 1 scénario(s)
- **Utilisée dans**: 0 endroit(s)
- **Total d'opérations**: 1

**Scénarios créateurs**: renforcement_csr_pas_argent_train

### 📝 Historique Complet des Opérations

#### 🔧 Créations/Modifications (1)

| Scénario | Location | Opération | Valeur |
|----------|----------|-----------|--------|
| `renforcement_csr_pas_argent_train` | Stage R2c | **add** | `1` |

---

## `$goal`

**Statut**: ❌ **ERREUR**: Utilisée mais jamais créée

### 📊 Statistiques

- **Créée dans**: 0 scénario(s)
- **Utilisée dans**: 40 endroit(s)
- **Total d'opérations**: 40

### 📝 Historique Complet des Opérations

#### 📖 Utilisations (40)

| Scénario | Location | Condition |
|----------|----------|----------|
| `reorientation_quiz_migrant` | Stage q1 > Choice 0 | `$goal != 'peintre'` |
| `reorientation_quiz_migrant` | Stage q1 > Choice 1 | `$goal != 'assc'` |
| `reorientation_quiz_migrant` | Stage q1 > Choice 2 | `$goal != 'asa'` |
| `reorientation_quiz_migrant` | Stage q1 > Choice 3 | `$goal != 'logisticien'` |
| `reorientation_quiz_migrant` | Stage q2 > Choice 0 | `$goal != 'peintre'` |
| `reorientation_quiz_migrant` | Stage q2 > Choice 1 | `$goal != 'assc'` |
| `reorientation_quiz_migrant` | Stage q2 > Choice 2 | `$goal != 'asa'` |
| `reorientation_quiz_migrant` | Stage q2 > Choice 3 | `$goal != 'logisticien'` |
| `reorientation_quiz_migrant` | Stage q4 > Choice 0 | `$goal != 'peintre'` |
| `reorientation_quiz_migrant` | Stage q4 > Choice 1 | `$goal != 'assc'` |
| `reorientation_quiz_migrant` | Stage q4 > Choice 2 | `$goal != 'asa'` |
| `reorientation_quiz_migrant` | Stage q4 > Choice 3 | `$goal != 'logisticien'` |
| `reorientation_quiz_migrant` | Stage q5 > Choice 0 | `$goal != 'asa'` |
| `reorientation_quiz_migrant` | Stage q5 > Choice 1 | `$goal != 'assc'` |
| `reorientation_quiz_migrant` | Stage q5 > Choice 2 | `$goal != 'logisticien'` |
| `reorientation_quiz_migrant` | Stage q5 > Choice 3 | `$goal != 'peintre'` |
| `reorientation_quiz_migrant` | Stage result > Choice 0 | `_peintre >= 2 && $goal != 'peintre'` |
| `reorientation_quiz_migrant` | Stage result > Choice 1 | `_assc >= 2 && $goal != 'assc'` |
| `reorientation_quiz_migrant` | Stage result > Choice 2 | `_asa >= 2 && $goal != 'asa'` |
| `reorientation_quiz_migrant` | Stage result > Choice 3 | `_logisticien >= 2 && $goal != 'logisticien'` |
| `reorientation_quiz_csr` | Stage q1 > Choice 0 | `$goal != 'commerce'` |
| `reorientation_quiz_csr` | Stage q1 > Choice 1 | `$goal != 'informaticien'` |
| `reorientation_quiz_csr` | Stage q1 > Choice 2 | `$goal != 'assc'` |
| `reorientation_quiz_csr` | Stage q1 > Choice 3 | `$goal != 'ase'` |
| `reorientation_quiz_csr` | Stage q2 > Choice 0 | `$goal != 'commerce'` |
| `reorientation_quiz_csr` | Stage q2 > Choice 1 | `$goal != 'informaticien'` |
| `reorientation_quiz_csr` | Stage q2 > Choice 2 | `$goal != 'assc'` |
| `reorientation_quiz_csr` | Stage q2 > Choice 3 | `$goal != 'ase'` |
| `reorientation_quiz_csr` | Stage q4 > Choice 0 | `$goal != 'commerce'` |
| `reorientation_quiz_csr` | Stage q4 > Choice 1 | `$goal != 'informaticien'` |
| `reorientation_quiz_csr` | Stage q4 > Choice 2 | `$goal != 'assc'` |
| `reorientation_quiz_csr` | Stage q4 > Choice 3 | `$goal != 'ase'` |
| `reorientation_quiz_csr` | Stage q5 > Choice 0 | `$goal != 'commerce'` |
| `reorientation_quiz_csr` | Stage q5 > Choice 1 | `$goal != 'informaticien'` |
| `reorientation_quiz_csr` | Stage q5 > Choice 2 | `$goal != 'assc'` |
| `reorientation_quiz_csr` | Stage q5 > Choice 3 | `$goal != 'ase'` |
| `reorientation_quiz_csr` | Stage result > Choice 0 | `_commerce >= 2 && $goal != 'commerce'` |
| `reorientation_quiz_csr` | Stage result > Choice 1 | `_informaticien >= 2 && $goal != 'informaticien'` |
| `reorientation_quiz_csr` | Stage result > Choice 2 | `_assc >= 2 && $goal != 'assc'` |
| `reorientation_quiz_csr` | Stage result > Choice 3 | `_ase >= 2 && $goal != 'ase'` |

---

