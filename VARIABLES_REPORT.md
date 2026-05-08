# Rapport des Variables Custom

**Total de variables custom**: 29

## ✅ Variables Créées et Utilisées (18)

| Variable | Statut | Scénarios Créateurs | Utilisations | Opérations | Détails |
|----------|--------|---------------------|--------------|------------|----------|
| `_asa` | ✅ OK | reorientation_quiz_migrant | 1 | 7 | add:6, remove:1 |
| `_ase` | ✅ OK | orientation_quiz_csr, reorientation_quiz_csr | 2 | 15 | add:13, remove:2 |
| `_assc` | ✅ OK | orientation_quiz_migrant, orientation_quiz_csr +2 | 4 | 28 | add:24, remove:4 |
| `_commerce` | ✅ OK | orientation_quiz_csr, reorientation_quiz_csr | 2 | 15 | add:13, remove:2 |
| `_ec1Counter` | ✅ OK | selection_ec1_helvetia | 10 | 54 | add:48, set:6 |
| `_goal` | ✅ OK | orientation_quiz_migrant, orientation_quiz_csr +2 | 35 | 15 | set:15 |
| `_informaticien` | ✅ OK | orientation_quiz_csr, reorientation_quiz_csr | 2 | 15 | add:13, remove:2 |
| `_it1Counter` | ✅ OK | selection_it1 | 10 | 54 | add:48, set:6 |
| `_it2Counter` | ✅ OK | selection_it2_lemanSoft | 10 | 54 | add:48, set:6 |
| `_logisticien` | ✅ OK | orientation_quiz_migrant, reorientation_quiz_migrant | 2 | 16 | add:14, remove:2 |
| `_neutral1Counter` | ✅ OK | selection_neutre_1 | 10 | 52 | add:46, set:6 |
| `_neutral2Counter` | ✅ OK | selection_neutre_2 | 10 | 53 | add:47, set:6 |
| `_peintre` | ✅ OK | orientation_quiz_migrant, reorientation_quiz_migrant | 2 | 15 | add:13, remove:2 |
| `_reorientationDone` | ✅ OK | reorientation_quiz_migrant, reorientation_quiz_csr | 3 | 2 | add:2 |
| `_selectionTry` | ✅ OK | selection_ec1_helvetia, selection_neutre_1 +4 | 8 | 30 | add:30 |
| `_sn3Counter` | ✅ OK | selection_neutre_3 | 10 | 53 | add:47, set:6 |
| `_validationStep` | ✅ OK | orientation_quiz_migrant, orientation_quiz_csr +25 | 41 | 52 | add:52 |
| `_validationUnlock` | ✅ OK | bonbon, validation_peintre_taches_ingrates +22 | 30 | 37 | add:37 |

## ❌ Variables Utilisées mais Jamais Créées (5)

| Variable | Statut | Utilisations | Exemples d'Utilisation |
|----------|--------|--------------|-------------------------|
| `$goal` | ❌ **ERREUR** | 40 | reorientation_quiz_migrant, reorientation_quiz_migrant +38 |
| `_firstExplanation` | ❌ **ERREUR** | 1 | renforcement_csr_pas_argent_train |
| `_firstFraud` | ❌ **ERREUR** | 2 | renforcement_csr_pas_argent_train, renforcement_csr_pas_argent_train |
| `_calledCoach` | ❌ **ERREUR** | 1 | renforcement_csr_pas_argent_train |
| `_walked` | ❌ **ERREUR** | 1 | renforcement_csr_pas_argent_train |

## ⚠️ Variables Créées mais Jamais Utilisées (6)

| Variable | Statut | Scénarios Créateurs | Nombre de Créations | Raison Probable |
|----------|--------|---------------------|---------------------|------------------|
| `_firstFraud ` | ⚠️ Non utilisée | renforcement_csr_pas_argent_train | 1 | ❗ Espace dans le nom! Version "`_firstFraud`" utilisée 2 fois |
| `_calledCoach  ` | ⚠️ Non utilisée | renforcement_csr_pas_argent_train | 1 | ❗ Espace dans le nom! Version "`_calledCoach`" utilisée 1 fois |
| `_walked  ` | ⚠️ Non utilisée | renforcement_csr_pas_argent_train | 1 | ❗ Espace dans le nom! Version "`_walked`" utilisée 1 fois |
| `_firstExplanation  ` | ⚠️ Non utilisée | renforcement_csr_pas_argent_train | 1 | ❗ Espace dans le nom! Version "`_firstExplanation`" utilisée 1 fois |
| `_selectionTry ` | ⚠️ Non utilisée | selection_csr_ase_assez_forte | 3 | ❗ Espace dans le nom! Version "`_selectionTry`" utilisée 8 fois |
| `_bonbonSelCounter` | ⚠️ Non utilisée | selection_derniere_etape_bonbon | 28 | Variable inutilisée |

## 📊 Résumé Global

| Catégorie | Nombre | Pourcentage |
|-----------|--------|-------------|
| ✅ Fonctionnelles | 18 | 62% |
| ❌ Erreurs (jamais créées) | 5 | 17% |
| ⚠️ Inutilisées | 6 | 21% |
| **Total** | **29** | **100%** |
