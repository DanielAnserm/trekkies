import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lire les fichiers JSON
const scenariosPath = path.join(__dirname, 'public/api/scenarios/scenarios.json');
const categoriesPath = path.join(__dirname, 'public/api/category/categories.json');

const scenariosData = JSON.parse(fs.readFileSync(scenariosPath, 'utf8'));
const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));

const issues = [];
const warnings = [];
const stats = {
    totalScenarios: 0,
    scenariosWithConditions: 0,
    totalStages: 0,
    totalChoices: 0,
    choicesWithConditions: 0,
    unreachableChoices: 0,
    invalidNextStages: 0,
    totalCategories: 0,
    totalCategoryScenarios: 0
};

// Variables valides pour les conditions
const validStatVars = ['character', 'skills', 'experience', 'context'];

// Stages gérés par le code (pas dans le JSON)
const codeHandledStages = new Set(['end', 'postulation_badge']);

// Tracking des variables custom
const customVariables = new Map(); // Map<varName, {createdIn: Set<scenarioId>, usedIn: Set<{scenarioId, location}>, operations: Array}>

// Fonction pour enregistrer une création de variable
function registerVariableCreation(varName, scenarioId, location, operation, value) {
    if (!customVariables.has(varName)) {
        customVariables.set(varName, {
            createdIn: new Set(),
            usedIn: new Set(),
            operations: []
        });
    }
    const varData = customVariables.get(varName);
    varData.createdIn.add(scenarioId);
    varData.operations.push({
        type: 'creation',
        operation: operation, // add, remove, set
        value: value,
        scenarioId: scenarioId,
        location: location
    });
}

// Fonction pour enregistrer une utilisation de variable
function registerVariableUsage(varName, scenarioId, location, condition) {
    if (!customVariables.has(varName)) {
        customVariables.set(varName, {
            createdIn: new Set(),
            usedIn: new Set(),
            operations: []
        });
    }
    const varData = customVariables.get(varName);
    varData.usedIn.add(JSON.stringify({scenarioId, location}));
    varData.operations.push({
        type: 'usage',
        scenarioId: scenarioId,
        location: location,
        condition: condition
    });
}

// Fonction pour extraire les variables d'une condition
function extractVariables(condition) {
    if (!condition) return [];
    // Match les noms de variables (lettres, chiffres, underscore, $)
    const matches = condition.match(/(\$?_?[a-zA-Z][a-zA-Z0-9_]*)/g) || [];
    return matches.filter(m => !['true', 'false', 'null', 'undefined', 'and', 'or', 'not'].includes(m));
}

// Fonction pour valider une condition
function validateCondition(condition, context, scenarioId, location) {
    if (!condition) return;

    const variables = extractVariables(condition);

    // Vérifier les variables $ qui ne sont pas $profileId
    const invalidDollarVars = variables.filter(v =>
        v.startsWith('$') && v !== '$profileId'
    );
    if (invalidDollarVars.length > 0) {
        issues.push({
            type: 'INVALID_DOLLAR_VARIABLE',
            scenario: scenarioId,
            location: location,
            condition: condition,
            invalidVars: invalidDollarVars,
            message: `Variables avec $ invalides (seul $profileId est accepté, utilisez _ pour les variables custom): ${invalidDollarVars.join(', ')}`
        });
    }

    // Enregistrer l'utilisation des variables custom
    variables.forEach(v => {
        if (v.startsWith('_') || (v.startsWith('$') && v !== '$profileId')) {
            registerVariableUsage(v, scenarioId, location, condition);
        }
    });

    // Vérifier la syntaxe basique
    try {
        // Remplacer les variables par des valeurs de test
        let testCondition = condition;

        // Remplacer les stats système
        validStatVars.forEach(v => {
            testCondition = testCondition.replace(new RegExp(`\\b${v}\\b`, 'g'), '1');
        });

        // Remplacer toutes les variables custom (_ et $) par des valeurs de test
        // Pour les nombres
        testCondition = testCondition.replace(/([_$][a-zA-Z0-9_]+)\s*(>=|<=|>|<|==|!=)\s*(\d+)/g, '1 $2 $3');
        // Pour les strings avec ==
        testCondition = testCondition.replace(/([_$][a-zA-Z0-9_]+)\s*(==|!=)\s*([a-zA-Z_][a-zA-Z0-9_]*)/g, "'test' $2 'test'");

        // $profileId spécial
        testCondition = testCondition.replace(/\$profileId/g, "'testProfile'");

        // Tester l'évaluation
        new Function(`return ${testCondition}`)();
    } catch (e) {
        issues.push({
            type: 'SYNTAX_ERROR',
            scenario: scenarioId,
            location: location,
            condition: condition,
            error: e.message,
            message: `Erreur de syntaxe dans la condition`
        });
    }
}

// Fonction pour analyser les changements et enregistrer les variables créées
function analyzeChanges(changes, scenarioId, location) {
    if (!changes) return;

    // playerParameters
    if (changes.playerParameters) {
        Object.entries(changes.playerParameters).forEach(([varName, changeObj]) => {
            registerVariableCreation(
                varName.startsWith('_') ? varName : `_${varName}`,
                scenarioId,
                location,
                changeObj.type,
                changeObj.value
            );
        });
    }

    // Autres types de changements (pour information)
    if (changes.stats) {
        Object.entries(changes.stats).forEach(([stat, changeObj]) => {
            customVariables.set(`stat:${stat}`, customVariables.get(`stat:${stat}`) || {
                createdIn: new Set(),
                usedIn: new Set(),
                operations: []
            });
            customVariables.get(`stat:${stat}`).operations.push({
                type: 'stat_change',
                operation: changeObj.type,
                value: changeObj.value,
                scenarioId: scenarioId,
                location: location
            });
        });
    }

    if (changes.traits) {
        Object.entries(changes.traits).forEach(([trait, changeObj]) => {
            customVariables.set(`trait:${trait}`, customVariables.get(`trait:${trait}`) || {
                createdIn: new Set(),
                usedIn: new Set(),
                operations: []
            });
            customVariables.get(`trait:${trait}`).operations.push({
                type: 'trait_change',
                operation: changeObj.type,
                scenarioId: scenarioId,
                location: location
            });
        });
    }

    if (changes.interests) {
        Object.entries(changes.interests).forEach(([interest, changeObj]) => {
            customVariables.set(`interest:${interest}`, customVariables.get(`interest:${interest}`) || {
                createdIn: new Set(),
                usedIn: new Set(),
                operations: []
            });
            customVariables.get(`interest:${interest}`).operations.push({
                type: 'interest_change',
                operation: changeObj.type,
                scenarioId: scenarioId,
                location: location
            });
        });
    }

    if (changes.goals) {
        Object.entries(changes.goals).forEach(([goal, changeObj]) => {
            customVariables.set(`goal:${goal}`, customVariables.get(`goal:${goal}`) || {
                createdIn: new Set(),
                usedIn: new Set(),
                operations: []
            });
            customVariables.get(`goal:${goal}`).operations.push({
                type: 'goal_change',
                operation: changeObj.type,
                scenarioId: scenarioId,
                location: location
            });
        });
    }
}

// PREMIÈRE PASSE: Collecter toutes les variables créées
console.log('=== PREMIÈRE PASSE: Collection des variables ===\n');

scenariosData.scenarios.forEach(scenario => {
    stats.totalScenarios++;

    if (scenario.condition) {
        stats.scenariosWithConditions++;
    }

    const stageKeys = Object.keys(scenario.stages);
    stats.totalStages += stageKeys.length;

    stageKeys.forEach(stageKey => {
        const stage = scenario.stages[stageKey];

        // Changements de stage
        analyzeChanges(stage.changes, scenario.id, `Scenario ${scenario.id} > Stage ${stageKey}`);

        // Analyser chaque choix
        if (stage.choices) {
            stats.totalChoices += stage.choices.length;

            stage.choices.forEach((choice, choiceIndex) => {
                if (choice.condition) {
                    stats.choicesWithConditions++;
                }

                // Changements de choix
                analyzeChanges(choice.changes, scenario.id, `Scenario ${scenario.id} > Stage ${stageKey} > Choice ${choiceIndex}`);
            });
        }
    });
});

console.log(`Collecté ${customVariables.size} variables/changements\n`);

// DEUXIÈME PASSE: Valider les conditions et usages
console.log('=== DEUXIÈME PASSE: Validation ===\n');

// Vérifier les scénarios
scenariosData.scenarios.forEach(scenario => {
    if (scenario.condition) {
        validateCondition(scenario.condition, 'scenario', scenario.id, `Scenario ${scenario.id}`);
    }

    // Vérifier que le scénario a bien un stage "start"
    if (!scenario.stages.start) {
        issues.push({
            type: 'MISSING_START_STAGE',
            scenario: scenario.id,
            message: `Le scénario n'a pas de stage "start"`
        });
    }

    const stageKeys = Object.keys(scenario.stages);
    const reachableStages = new Set(['start']);

    stageKeys.forEach(stageKey => {
        const stage = scenario.stages[stageKey];

        if (stage.choices) {
            stage.choices.forEach((choice, choiceIndex) => {
                if (choice.condition) {
                    validateCondition(
                        choice.condition,
                        'choice',
                        scenario.id,
                        `Scenario ${scenario.id} > Stage ${stageKey} > Choice ${choiceIndex}`
                    );
                }

                // Vérifier que le next stage existe
                if (choice.next && !choice.loadScenario) {
                    if (codeHandledStages.has(choice.next)) {
                        // C'est valide, géré par le code
                    } else if (!scenario.stages[choice.next]) {
                        issues.push({
                            type: 'INVALID_NEXT_STAGE',
                            scenario: scenario.id,
                            stage: stageKey,
                            choice: choiceIndex,
                            next: choice.next,
                            message: `Le stage "${choice.next}" référencé n'existe pas`
                        });
                        stats.invalidNextStages++;
                    } else {
                        reachableStages.add(choice.next);
                    }
                }

                // Vérifier qu'il y a bien un next ou loadScenario ou isEnd
                if (!choice.next && !choice.loadScenario && !stage.isEnd) {
                    warnings.push({
                        type: 'NO_NEXT_ACTION',
                        scenario: scenario.id,
                        stage: stageKey,
                        choice: choiceIndex,
                        message: `Le choix n'a ni "next", ni "loadScenario" et le stage n'est pas marqué isEnd`
                    });
                }
            });

            // Vérifier s'il y a des choix avec des conditions qui pourraient tous être faux
            const allConditional = stage.choices.every(c => c.condition);
            if (allConditional && stage.choices.length > 0) {
                warnings.push({
                    type: 'ALL_CHOICES_CONDITIONAL',
                    scenario: scenario.id,
                    stage: stageKey,
                    message: `Tous les choix ont des conditions - le joueur pourrait être bloqué`
                });
            }
        } else if (!stage.isEnd) {
            issues.push({
                type: 'NO_CHOICES',
                scenario: scenario.id,
                stage: stageKey,
                message: `Le stage n'a pas de choix et n'est pas marqué isEnd`
            });
        }
    });

    // Vérifier les stages non atteignables
    const unreachableStages = stageKeys.filter(k => !reachableStages.has(k));
    if (unreachableStages.length > 0) {
        // Analyser pourquoi ces stages ne sont pas atteignables
        const reasons = [];

        unreachableStages.forEach(stageName => {
            const stage = scenario.stages[stageName];

            // Vérifier si c'est un stage "end" qui pourrait être géré par le code
            if (stageName === 'end') {
                reasons.push(`"${stageName}" n'est jamais référencé (probablement géré par le code avec isEnd: true)`);
            } else if (stage.isEnd) {
                reasons.push(`"${stageName}" est marqué isEnd mais jamais référencé (contenu mort)`);
            } else {
                // Vérifier s'il y a des choix qui pourraient y mener
                const hasChoices = stage.choices && stage.choices.length > 0;
                if (hasChoices) {
                    reasons.push(`"${stageName}" a ${stage.choices.length} choix mais n'est jamais référencé depuis un autre stage`);
                } else {
                    reasons.push(`"${stageName}" n'a pas de choix et n'est jamais référencé (contenu orphelin)`);
                }
            }
        });

        warnings.push({
            type: 'UNREACHABLE_STAGES',
            scenario: scenario.id,
            stages: unreachableStages,
            reasons: reasons,
            message: `Stages potentiellement non atteignables: ${unreachableStages.join(', ')}`
        });
    }
});

// Vérifier les loadScenario
scenariosData.scenarios.forEach(scenario => {
    Object.keys(scenario.stages).forEach(stageKey => {
        const stage = scenario.stages[stageKey];
        if (stage.choices) {
            stage.choices.forEach((choice, choiceIndex) => {
                if (choice.loadScenario) {
                    const targetScenario = scenariosData.scenarios.find(s => s.id === choice.loadScenario);
                    if (!targetScenario) {
                        issues.push({
                            type: 'INVALID_LOAD_SCENARIO',
                            scenario: scenario.id,
                            stage: stageKey,
                            choice: choiceIndex,
                            loadScenario: choice.loadScenario,
                            message: `Le scénario "${choice.loadScenario}" référencé n'existe pas`
                        });
                    }
                }
            });
        }
    });
});

// VÉRIFICATION DES CATÉGORIES
console.log('=== VÉRIFICATION DES CATÉGORIES ===\n');

Object.entries(categoriesData.categories).forEach(([categoryName, category]) => {
    stats.totalCategories++;

    // Vérifier les prérequis de la catégorie
    if (category.prerequisites?.condition) {
        validateCondition(
            category.prerequisites.condition,
            'category',
            `category:${categoryName}`,
            `Category ${categoryName} > Prerequisites`
        );
    }

    // Vérifier chaque scénario dans la catégorie
    category.scenarios.forEach((scenarioRef, index) => {
        stats.totalCategoryScenarios++;

        // Vérifier que le scénario existe
        const scenarioExists = scenariosData.scenarios.find(s => s.id === scenarioRef.key);
        if (!scenarioExists) {
            issues.push({
                type: 'CATEGORY_INVALID_SCENARIO',
                category: categoryName,
                scenario: scenarioRef.key,
                index: index,
                message: `Le scénario "${scenarioRef.key}" référencé dans la catégorie n'existe pas`
            });
        }

        // Vérifier la condition du scénario
        if (scenarioRef.condition) {
            validateCondition(
                scenarioRef.condition,
                'category_scenario',
                `category:${categoryName}`,
                `Category ${categoryName} > Scenario ${scenarioRef.key}`
            );
        }
    });
});

// VÉRIFICATION DES VARIABLES CUSTOM
console.log('=== VÉRIFICATION DES VARIABLES CUSTOM ===\n');

customVariables.forEach((varData, varName) => {
    // Ignorer les variables non-custom (stats, traits, etc.)
    if (!varName.startsWith('_') && !varName.startsWith('$')) {
        return;
    }

    // Variables utilisées mais jamais créées
    if (varData.createdIn.size === 0 && varData.usedIn.size > 0) {
        const usageLocations = Array.from(varData.usedIn).slice(0, 3).map(s => JSON.parse(s));
        issues.push({
            type: 'VARIABLE_NEVER_CREATED',
            variable: varName,
            usageCount: varData.usedIn.size,
            usedIn: usageLocations,
            message: `Variable "${varName}" utilisée ${varData.usedIn.size} fois mais jamais créée`
        });
    }

    // Variables créées mais jamais utilisées
    if (varData.createdIn.size > 0 && varData.usedIn.size === 0) {
        warnings.push({
            type: 'VARIABLE_NEVER_USED',
            variable: varName,
            createdIn: Array.from(varData.createdIn),
            message: `Variable "${varName}" créée dans ${varData.createdIn.size} scénario(s) mais jamais utilisée`
        });
    }
});

// Afficher les résultats
console.log('\n=== STATISTIQUES ===');
console.log(`Total scénarios: ${stats.totalScenarios}`);
console.log(`Scénarios avec conditions: ${stats.scenariosWithConditions}`);
console.log(`Total stages: ${stats.totalStages}`);
console.log(`Total choix: ${stats.totalChoices}`);
console.log(`Choix avec conditions: ${stats.choicesWithConditions}`);
console.log(`Total catégories: ${stats.totalCategories}`);
console.log(`Total scénarios dans catégories: ${stats.totalCategoryScenarios}`);
console.log(`\nVariables custom détectées: ${Array.from(customVariables.keys()).filter(k => k.startsWith('_') || k.startsWith('$')).length}`);

console.log('\n=== ERREURS CRITIQUES ===');
if (issues.length === 0) {
    console.log('✓ Aucune erreur critique détectée');
} else {
    console.log(`✗ ${issues.length} erreur(s) détectée(s):\n`);

    // Grouper par type
    const issuesByType = {};
    issues.forEach(issue => {
        if (!issuesByType[issue.type]) {
            issuesByType[issue.type] = [];
        }
        issuesByType[issue.type].push(issue);
    });

    Object.keys(issuesByType).forEach(type => {
        console.log(`\n${type} (${issuesByType[type].length}):`);
        issuesByType[type].slice(0, 10).forEach(issue => {
            console.log(`  - ${issue.message}`);
            if (issue.location) console.log(`    Location: ${issue.location}`);
            if (issue.condition) console.log(`    Condition: ${issue.condition}`);
        });
        if (issuesByType[type].length > 10) {
            console.log(`  ... et ${issuesByType[type].length - 10} autres`);
        }
    });
}

console.log('\n=== AVERTISSEMENTS ===');
if (warnings.length === 0) {
    console.log('✓ Aucun avertissement');
} else {
    console.log(`⚠ ${warnings.length} avertissement(s):\n`);

    const warningsByType = {};
    warnings.forEach(warning => {
        if (!warningsByType[warning.type]) {
            warningsByType[warning.type] = [];
        }
        warningsByType[warning.type].push(warning);
    });

    Object.keys(warningsByType).forEach(type => {
        console.log(`\n${type} (${warningsByType[type].length}):`);
        warningsByType[type].slice(0, 5).forEach(warning => {
            console.log(`  - ${warning.message}`);
            if (warning.scenario) console.log(`    Scenario: ${warning.scenario}`);
            if (warning.stage) console.log(`    Stage: ${warning.stage}`);
            if (warning.reasons) {
                console.log(`    Raisons:`);
                warning.reasons.forEach(reason => console.log(`      * ${reason}`));
            }
        });
        if (warningsByType[type].length > 5) {
            console.log(`  ... et ${warningsByType[type].length - 5} autres`);
        }
    });
}

// Générer le rapport des variables
const variableReport = {};
customVariables.forEach((varData, varName) => {
    variableReport[varName] = {
        createdIn: Array.from(varData.createdIn),
        usedInCount: varData.usedIn.size,
        operations: varData.operations
    };
});

// Sauvegarder les rapports
const report = {
    stats,
    issues,
    warnings,
    variableReport
};

fs.writeFileSync(
    path.join(__dirname, 'scenario-verification-report.json'),
    JSON.stringify(report, null, 2)
);

// Générer un rapport markdown des variables
let variableMarkdown = '# Rapport des Variables Custom\n\n';
variableMarkdown += `**Total de variables custom**: ${Array.from(customVariables.keys()).filter(k => k.startsWith('_') || k.startsWith('$')).length}\n\n`;

// Variables par catégorie
const varsByCategory = {
    created: [],
    usedOnly: [],
    unused: []
};

customVariables.forEach((varData, varName) => {
    if (!varName.startsWith('_') && !varName.startsWith('$')) return;

    if (varData.createdIn.size > 0 && varData.usedIn.size > 0) {
        varsByCategory.created.push([varName, varData]);
    } else if (varData.createdIn.size === 0 && varData.usedIn.size > 0) {
        varsByCategory.usedOnly.push([varName, varData]);
    } else if (varData.createdIn.size > 0 && varData.usedIn.size === 0) {
        varsByCategory.unused.push([varName, varData]);
    }
});

variableMarkdown += `## ✅ Variables Créées et Utilisées (${varsByCategory.created.length})\n\n`;
variableMarkdown += '| Variable | Statut | Scénarios Créateurs | Utilisations | Opérations | Détails |\n';
variableMarkdown += '|----------|--------|---------------------|--------------|------------|----------|\n';

varsByCategory.created.sort((a, b) => a[0].localeCompare(b[0])).forEach(([varName, varData]) => {
    const creations = varData.operations.filter(op => op.type === 'creation');
    const usages = varData.operations.filter(op => op.type === 'usage');
    const creatorsShort = Array.from(varData.createdIn).slice(0, 2).join(', ');
    const creatorsMore = varData.createdIn.size > 2 ? ` +${varData.createdIn.size - 2}` : '';

    // Résumer les opérations
    const opTypes = {};
    creations.forEach(op => {
        opTypes[op.operation] = (opTypes[op.operation] || 0) + 1;
    });
    const opSummary = Object.entries(opTypes).map(([op, count]) => `${op}:${count}`).join(', ');

    variableMarkdown += `| \`${varName}\` | ✅ OK | ${creatorsShort}${creatorsMore} | ${usages.length} | ${creations.length} | ${opSummary} |\n`;
});

variableMarkdown += `\n## ❌ Variables Utilisées mais Jamais Créées (${varsByCategory.usedOnly.length})\n\n`;
variableMarkdown += '| Variable | Statut | Utilisations | Exemples d\'Utilisation |\n';
variableMarkdown += '|----------|--------|--------------|-------------------------|\n';

varsByCategory.usedOnly.forEach(([varName, varData]) => {
    const usages = varData.operations.filter(op => op.type === 'usage').slice(0, 2);
    const usageExamples = usages.map(u => `${u.scenarioId}`).join(', ');
    const moreUsages = varData.usedIn.size > 2 ? ` +${varData.usedIn.size - 2}` : '';

    variableMarkdown += `| \`${varName}\` | ❌ **ERREUR** | ${varData.usedIn.size} | ${usageExamples}${moreUsages} |\n`;
});

variableMarkdown += `\n## ⚠️ Variables Créées mais Jamais Utilisées (${varsByCategory.unused.length})\n\n`;
variableMarkdown += '| Variable | Statut | Scénarios Créateurs | Nombre de Créations | Raison Probable |\n';
variableMarkdown += '|----------|--------|---------------------|---------------------|------------------|\n';

varsByCategory.unused.forEach(([varName, varData]) => {
    const creators = Array.from(varData.createdIn).join(', ');
    const creations = varData.operations.filter(op => op.type === 'creation');

    // Détecter si c'est un problème d'espaces
    let reason = 'Variable inutilisée';
    if (varName.trim() !== varName) {
        const trimmed = varName.trim();
        // Vérifier si la version sans espaces existe et est utilisée
        const trimmedVar = customVariables.get(trimmed);
        if (trimmedVar && trimmedVar.usedIn.size > 0) {
            reason = `❗ Espace dans le nom! Version "\`${trimmed}\`" utilisée ${trimmedVar.usedIn.size} fois`;
        } else {
            reason = '❗ Espace dans le nom';
        }
    }

    variableMarkdown += `| \`${varName}\` | ⚠️ Non utilisée | ${creators} | ${creations.length} | ${reason} |\n`;
});

// Ajouter un résumé global
variableMarkdown += `\n## 📊 Résumé Global\n\n`;
variableMarkdown += '| Catégorie | Nombre | Pourcentage |\n';
variableMarkdown += '|-----------|--------|-------------|\n';
const total = varsByCategory.created.length + varsByCategory.usedOnly.length + varsByCategory.unused.length;
variableMarkdown += `| ✅ Fonctionnelles | ${varsByCategory.created.length} | ${Math.round(varsByCategory.created.length / total * 100)}% |\n`;
variableMarkdown += `| ❌ Erreurs (jamais créées) | ${varsByCategory.usedOnly.length} | ${Math.round(varsByCategory.usedOnly.length / total * 100)}% |\n`;
variableMarkdown += `| ⚠️ Inutilisées | ${varsByCategory.unused.length} | ${Math.round(varsByCategory.unused.length / total * 100)}% |\n`;
variableMarkdown += `| **Total** | **${total}** | **100%** |\n`;

fs.writeFileSync(
    path.join(__dirname, 'VARIABLES_REPORT.md'),
    variableMarkdown
);

// Générer un rapport des avertissements
let warningsMarkdown = '# Rapport Détaillé des Avertissements\n\n';
warningsMarkdown += `**Total**: ${warnings.length} avertissements\n\n`;

const warningsByType = {};
warnings.forEach(warning => {
    if (!warningsByType[warning.type]) {
        warningsByType[warning.type] = [];
    }
    warningsByType[warning.type].push(warning);
});

Object.keys(warningsByType).forEach(type => {
    warningsMarkdown += `## ${type} (${warningsByType[type].length})\n\n`;

    if (type === 'UNREACHABLE_STAGES') {
        warningsMarkdown += '### Analyse des Stages Non Atteignables\n\n';
        warningsByType[type].forEach(warning => {
            warningsMarkdown += `#### Scénario: \`${warning.scenario}\`\n\n`;
            warningsMarkdown += `**Stages concernés**: ${warning.stages.map(s => `\`${s}\``).join(', ')}\n\n`;
            warningsMarkdown += `**Raisons**:\n\n`;
            warning.reasons.forEach(reason => {
                warningsMarkdown += `- ${reason}\n`;
            });
            warningsMarkdown += '\n';
        });
    } else if (type === 'ALL_CHOICES_CONDITIONAL') {
        warningsMarkdown += '### Risque de Blocage du Joueur\n\n';
        warningsMarkdown += 'Ces stages ont **tous leurs choix conditionnels**, ce qui signifie que si aucune condition n\'est satisfaite, le joueur sera bloqué.\n\n';

        // Grouper par scénario
        const byScenario = {};
        warningsByType[type].forEach(warning => {
            if (!byScenario[warning.scenario]) {
                byScenario[warning.scenario] = [];
            }
            byScenario[warning.scenario].push(warning.stage);
        });

        Object.entries(byScenario).forEach(([scenario, stages]) => {
            warningsMarkdown += `- **${scenario}** (${stages.length} stages): ${stages.slice(0, 5).join(', ')}`;
            if (stages.length > 5) {
                warningsMarkdown += `, ... et ${stages.length - 5} autres`;
            }
            warningsMarkdown += '\n';
        });
        warningsMarkdown += '\n';
    } else if (type === 'VARIABLE_NEVER_USED') {
        warningsMarkdown += '### Variables Créées mais Jamais Utilisées\n\n';
        warningsMarkdown += 'Ces variables sont créées dans des scénarios mais ne sont jamais référencées dans aucune condition.\n\n';
        warningsByType[type].forEach(warning => {
            warningsMarkdown += `#### \`${warning.variable}\`\n\n`;
            warningsMarkdown += `- **Créée dans**: ${warning.createdIn.join(', ')}\n`;
            warningsMarkdown += `- **Jamais utilisée**: Aucune condition ne référence cette variable\n`;
            warningsMarkdown += `- **Impact**: Variable inutile, peut être supprimée\n\n`;
        });
    } else {
        // Autres types d'avertissements
        warningsByType[type].forEach(warning => {
            warningsMarkdown += `- ${warning.message}\n`;
            if (warning.scenario) warningsMarkdown += `  - Scenario: ${warning.scenario}\n`;
            if (warning.stage) warningsMarkdown += `  - Stage: ${warning.stage}\n`;
        });
        warningsMarkdown += '\n';
    }
});

fs.writeFileSync(
    path.join(__dirname, 'WARNINGS_REPORT.md'),
    warningsMarkdown
);

// Générer un rapport ultra-détaillé des variables avec TOUTES les actions
let detailedVarMarkdown = '# Rapport Ultra-Détaillé des Variables Custom\n\n';
detailedVarMarkdown += `**Total de variables custom**: ${Array.from(customVariables.keys()).filter(k => k.startsWith('_') || k.startsWith('$')).length}\n\n`;
detailedVarMarkdown += '---\n\n';

// Trier les variables par nom
const sortedVars = Array.from(customVariables.entries())
    .filter(([name]) => name.startsWith('_') || name.startsWith('$'))
    .sort(([a], [b]) => a.localeCompare(b));

sortedVars.forEach(([varName, varData]) => {
    detailedVarMarkdown += `## \`${varName}\`\n\n`;

    // Statut
    let status = '✅ Fonctionnelle';
    if (varData.createdIn.size === 0 && varData.usedIn.size > 0) {
        status = '❌ **ERREUR**: Utilisée mais jamais créée';
    } else if (varData.createdIn.size > 0 && varData.usedIn.size === 0) {
        status = '⚠️ Créée mais jamais utilisée';
    }

    detailedVarMarkdown += `**Statut**: ${status}\n\n`;

    // Statistiques
    detailedVarMarkdown += `### 📊 Statistiques\n\n`;
    detailedVarMarkdown += `- **Créée dans**: ${varData.createdIn.size} scénario(s)\n`;
    detailedVarMarkdown += `- **Utilisée dans**: ${varData.usedIn.size} endroit(s)\n`;
    detailedVarMarkdown += `- **Total d'opérations**: ${varData.operations.length}\n\n`;

    // Liste des scénarios où elle est créée
    if (varData.createdIn.size > 0) {
        detailedVarMarkdown += `**Scénarios créateurs**: ${Array.from(varData.createdIn).join(', ')}\n\n`;
    }

    // Toutes les opérations dans l'ordre chronologique
    detailedVarMarkdown += `### 📝 Historique Complet des Opérations\n\n`;

    const creations = varData.operations.filter(op => op.type === 'creation');
    const usages = varData.operations.filter(op => op.type === 'usage');

    if (creations.length > 0) {
        detailedVarMarkdown += `#### 🔧 Créations/Modifications (${creations.length})\n\n`;
        detailedVarMarkdown += '| Scénario | Location | Opération | Valeur |\n';
        detailedVarMarkdown += '|----------|----------|-----------|--------|\n';
        creations.forEach(op => {
            const location = op.location.replace(/^Scenario [^ ]+ > /, '');
            detailedVarMarkdown += `| \`${op.scenarioId}\` | ${location} | **${op.operation}** | \`${op.value}\` |\n`;
        });
        detailedVarMarkdown += '\n';
    }

    if (usages.length > 0) {
        detailedVarMarkdown += `#### 📖 Utilisations (${usages.length})\n\n`;
        detailedVarMarkdown += '| Scénario | Location | Condition |\n';
        detailedVarMarkdown += '|----------|----------|----------|\n';
        usages.forEach(op => {
            const location = op.location.replace(/^Scenario [^ ]+ > /, '').replace(/^Category [^ ]+ > /, 'Cat: ');
            detailedVarMarkdown += `| \`${op.scenarioId}\` | ${location} | \`${op.condition}\` |\n`;
        });
        detailedVarMarkdown += '\n';
    }

    detailedVarMarkdown += '---\n\n';
});

fs.writeFileSync(
    path.join(__dirname, 'VARIABLES_DETAILED_REPORT.md'),
    detailedVarMarkdown
);

console.log('\n=== RAPPORTS GÉNÉRÉS ===');
console.log('- scenario-verification-report.json - Rapport complet (JSON)');
console.log('- SCENARIO_ISSUES_REPORT.md - Rapport des erreurs et solutions');
console.log('- VARIABLES_REPORT.md - Rapport résumé des variables custom');
console.log('- VARIABLES_DETAILED_REPORT.md - Rapport ultra-détaillé avec TOUTES les actions');
console.log('- WARNINGS_REPORT.md - Rapport détaillé de tous les avertissements');

// Code de sortie
process.exit(issues.length > 0 ? 1 : 0);
