# Rapport Détaillé des Avertissements

**Total**: 105 avertissements

## ALL_CHOICES_CONDITIONAL (90)

### Risque de Blocage du Joueur

Ces stages ont **tous leurs choix conditionnels**, ce qui signifie que si aucune condition n'est satisfaite, le joueur sera bloqué.

- **orientation_quiz_migrant** (1 stages): result
- **orientation_quiz_csr** (1 stages): result
- **reorientation_quiz_migrant** (5 stages): q1, q2, q4, q5, result
- **reorientation_quiz_csr** (5 stages): q1, q2, q4, q5, result
- **renforcement_migrant_pause_vin** (5 stages): fomo, discussion_culture, mensonge, discussion_positive, journee_ratee
- **renforcement_migrant_remarque_raciste** (9 stages): malaise_persistant, discussion_tendue, incomprehension, excuses, politique, ... et 4 autres
- **renforcement_all_stage_silencieux** (4 stages): O1, O2, O3, O4
- **renforcement_csr_conflit_matinal** (3 stages): O1, O2, O3
- **renforcement_csr_pas_argent_train** (5 stages): O1, O2, O3, O4, O5
- **perfectionnement_all_renseignement_entreprise** (4 stages): fin_honte, fin_renvoye, fin_curiosite, fin_mensonge
- **renforcement_tenue_stage** (7 stages): R8, R13, R15, R17, R18, ... et 2 autres
- **perfectionnement_suivi_coach** (3 stages): clarification, deja_postule, ancien_stage
- **perfectionnement_nouveau_stage_meme_entreprise** (6 stages): refus_explique, ambiguite, bon_tremplin, acceptation_forcee, deuxieme_stage_accepte_avec_conviction, ... et 1 autres
- **EncorePlusFort_renforcement** (3 stages): O1, O2, O3
- **renforcement_migrant_oser_initiative** (5 stages): R5, R7, R8, R9, R10
- **renforcement_gestion_emotionnelle_trop_plein** (6 stages): O1, O2, O3, O4, O5, ... et 1 autres
- **selection_ec1_helvetia** (3 stages): checkpoint_j1, checkpoint_j2, decision_finale
- **selection_neutre_1** (3 stages): checkpoint_j1, checkpoint_j2, decision_finale
- **selection_neutre_2** (3 stages): checkpoint_w1, checkpoint_w2, decision_finale
- **selection_neutre_3** (3 stages): checkpoint_s1, checkpoint_s2, decision_finale
- **selection_it1** (3 stages): checkpoint_j1, checkpoint_j2, decision_finale
- **selection_it2_lemanSoft** (3 stages): checkpoint_j1, checkpoint_j2, decision_finale

## UNREACHABLE_STAGES (9)

### Analyse des Stages Non Atteignables

#### Scénario: `validation_peintre_emotionnelle`

**Stages concernés**: `experience_acquise`

**Raisons**:

- "experience_acquise" a 1 choix mais n'est jamais référencé depuis un autre stage

#### Scénario: `help_caractere`

**Stages concernés**: `end`

**Raisons**:

- "end" n'est jamais référencé (probablement géré par le code avec isEnd: true)

#### Scénario: `help_competence`

**Stages concernés**: `end`

**Raisons**:

- "end" n'est jamais référencé (probablement géré par le code avec isEnd: true)

#### Scénario: `help_contexte`

**Stages concernés**: `end`

**Raisons**:

- "end" n'est jamais référencé (probablement géré par le code avec isEnd: true)

#### Scénario: `help_experience`

**Stages concernés**: `end`

**Raisons**:

- "end" n'est jamais référencé (probablement géré par le code avec isEnd: true)

#### Scénario: `help_validation`

**Stages concernés**: `end`

**Raisons**:

- "end" n'est jamais référencé (probablement géré par le code avec isEnd: true)

#### Scénario: `help_postulation`

**Stages concernés**: `end`

**Raisons**:

- "end" n'est jamais référencé (probablement géré par le code avec isEnd: true)

#### Scénario: `help_sommet`

**Stages concernés**: `end`

**Raisons**:

- "end" n'est jamais référencé (probablement géré par le code avec isEnd: true)

#### Scénario: `vase_clos`

**Stages concernés**: `two_colleagues`

**Raisons**:

- "two_colleagues" a 3 choix mais n'est jamais référencé depuis un autre stage

## VARIABLE_NEVER_USED (6)

### Variables Créées mais Jamais Utilisées

Ces variables sont créées dans des scénarios mais ne sont jamais référencées dans aucune condition.

#### `_firstFraud `

- **Créée dans**: renforcement_csr_pas_argent_train
- **Jamais utilisée**: Aucune condition ne référence cette variable
- **Impact**: Variable inutile, peut être supprimée

#### `_calledCoach  `

- **Créée dans**: renforcement_csr_pas_argent_train
- **Jamais utilisée**: Aucune condition ne référence cette variable
- **Impact**: Variable inutile, peut être supprimée

#### `_walked  `

- **Créée dans**: renforcement_csr_pas_argent_train
- **Jamais utilisée**: Aucune condition ne référence cette variable
- **Impact**: Variable inutile, peut être supprimée

#### `_firstExplanation  `

- **Créée dans**: renforcement_csr_pas_argent_train
- **Jamais utilisée**: Aucune condition ne référence cette variable
- **Impact**: Variable inutile, peut être supprimée

#### `_selectionTry `

- **Créée dans**: selection_csr_ase_assez_forte
- **Jamais utilisée**: Aucune condition ne référence cette variable
- **Impact**: Variable inutile, peut être supprimée

#### `_bonbonSelCounter`

- **Créée dans**: selection_derniere_etape_bonbon
- **Jamais utilisée**: Aucune condition ne référence cette variable
- **Impact**: Variable inutile, peut être supprimée

