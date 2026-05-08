// Logique de vérification des scénarios (adaptée du script Node.js pour le client)

export interface VerificationIssue {
    type: string;
    scenario?: string;
    location?: string;
    condition?: string;
    message: string;
    [key: string]: any;
}

export interface VerificationWarning {
    type: string;
    scenario?: string;
    stage?: string;
    message: string;
    reasons?: string[];
    [key: string]: any;
}

export interface VerificationStats {
    totalScenarios: number;
    scenariosWithConditions: number;
    totalStages: number;
    totalChoices: number;
    choicesWithConditions: number;
    totalCategories: number;
    totalCategoryScenarios: number;
}

export interface VariableData {
    createdIn: Set<string>;
    usedIn: Set<string>;
    operations: Array<{
        type: string;
        operation?: string;
        value?: any;
        scenarioId: string;
        location: string;
        condition?: string;
    }>;
}

export interface VerificationResult {
    stats: VerificationStats;
    issues: VerificationIssue[];
    warnings: VerificationWarning[];
    customVariables: Map<string, VariableData>;
}

const validStatVars = ['character', 'skills', 'experience', 'context'];
const codeHandledStages = new Set(['end', 'postulation_badge']);

function extractVariables(condition: string): string[] {
    if (!condition) return [];
    const matches = condition.match(/(\$?_?[a-zA-Z][a-zA-Z0-9_]*)/g) || [];
    return matches.filter(m => !['true', 'false', 'null', 'undefined', 'and', 'or', 'not'].includes(m));
}

export function verifyScenarios(scenariosData: any, categoriesData: any): VerificationResult {
    const issues: VerificationIssue[] = [];
    const warnings: VerificationWarning[] = [];
    const customVariables = new Map<string, VariableData>();

    const stats: VerificationStats = {
        totalScenarios: 0,
        scenariosWithConditions: 0,
        totalStages: 0,
        totalChoices: 0,
        choicesWithConditions: 0,
        totalCategories: 0,
        totalCategoryScenarios: 0
    };

    function registerVariableCreation(varName: string, scenarioId: string, location: string, operation: string, value: any) {
        if (!customVariables.has(varName)) {
            customVariables.set(varName, {
                createdIn: new Set(),
                usedIn: new Set(),
                operations: []
            });
        }
        const varData = customVariables.get(varName)!;
        varData.createdIn.add(scenarioId);
        varData.operations.push({
            type: 'creation',
            operation,
            value,
            scenarioId,
            location
        });
    }

    function registerVariableUsage(varName: string, scenarioId: string, location: string, condition: string) {
        if (!customVariables.has(varName)) {
            customVariables.set(varName, {
                createdIn: new Set(),
                usedIn: new Set(),
                operations: []
            });
        }
        const varData = customVariables.get(varName)!;
        varData.usedIn.add(JSON.stringify({ scenarioId, location }));
        varData.operations.push({
            type: 'usage',
            scenarioId,
            location,
            condition
        });
    }

    function validateCondition(condition: string, context: string, scenarioId: string, location: string) {
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
                location,
                condition,
                invalidVars: invalidDollarVars,
                message: `Variables avec $ invalides (seul $profileId est accepté): ${invalidDollarVars.join(', ')}`
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
            let testCondition = condition;
            validStatVars.forEach(v => {
                testCondition = testCondition.replace(new RegExp(`\\b${v}\\b`, 'g'), '1');
            });
            testCondition = testCondition.replace(/([_$][a-zA-Z0-9_]+)\s*(>=|<=|>|<|==|!=)\s*(\d+)/g, '1 $2 $3');
            testCondition = testCondition.replace(/([_$][a-zA-Z0-9_]+)\s*(==|!=)\s*([a-zA-Z_][a-zA-Z0-9_]*)/g, "'test' $2 'test'");
            testCondition = testCondition.replace(/\$profileId/g, "'testProfile'");

            // Test avec Function
            new Function(`return ${testCondition}`)();
        } catch (e: any) {
            issues.push({
                type: 'SYNTAX_ERROR',
                scenario: scenarioId,
                location,
                condition,
                error: e.message,
                message: `Erreur de syntaxe dans la condition`
            });
        }
    }

    function analyzeChanges(changes: any, scenarioId: string, location: string) {
        if (!changes) return;

        if (changes.playerParameters) {
            Object.entries(changes.playerParameters).forEach(([varName, changeObj]: [string, any]) => {
                registerVariableCreation(
                    varName.startsWith('_') ? varName : `_${varName}`,
                    scenarioId,
                    location,
                    changeObj.type,
                    changeObj.value
                );
            });
        }
    }

    // PREMIÈRE PASSE: Collecter toutes les variables créées
    scenariosData.scenarios.forEach((scenario: any) => {
        stats.totalScenarios++;

        if (scenario.condition) {
            stats.scenariosWithConditions++;
        }

        const stageKeys = Object.keys(scenario.stages);
        stats.totalStages += stageKeys.length;

        stageKeys.forEach(stageKey => {
            const stage = scenario.stages[stageKey];
            analyzeChanges(stage.changes, scenario.id, `Scenario ${scenario.id} > Stage ${stageKey}`);

            if (stage.choices) {
                stats.totalChoices += stage.choices.length;

                stage.choices.forEach((choice: any, choiceIndex: number) => {
                    if (choice.condition) {
                        stats.choicesWithConditions++;
                    }
                    analyzeChanges(choice.changes, scenario.id, `Scenario ${scenario.id} > Stage ${stageKey} > Choice ${choiceIndex}`);
                });
            }
        });
    });

    // DEUXIÈME PASSE: Valider les conditions et usages
    scenariosData.scenarios.forEach((scenario: any) => {
        if (scenario.condition) {
            validateCondition(scenario.condition, 'scenario', scenario.id, `Scenario ${scenario.id}`);
        }

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
                stage.choices.forEach((choice: any, choiceIndex: number) => {
                    if (choice.condition) {
                        validateCondition(
                            choice.condition,
                            'choice',
                            scenario.id,
                            `Scenario ${scenario.id} > Stage ${stageKey} > Choice ${choiceIndex}`
                        );
                    }

                    if (choice.next && !choice.loadScenario) {
                        if (codeHandledStages.has(choice.next)) {
                            // OK
                        } else if (!scenario.stages[choice.next]) {
                            issues.push({
                                type: 'INVALID_NEXT_STAGE',
                                scenario: scenario.id,
                                stage: stageKey,
                                choice: choiceIndex,
                                next: choice.next,
                                message: `Le stage "${choice.next}" référencé n'existe pas`
                            });
                        } else {
                            reachableStages.add(choice.next);
                        }
                    }
                });

                const allConditional = stage.choices.every((c: any) => c.condition);
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

        const unreachableStages = stageKeys.filter(k => !reachableStages.has(k));
        if (unreachableStages.length > 0) {
            const reasons: string[] = [];
            unreachableStages.forEach(stageName => {
                const stage = scenario.stages[stageName];
                if (stageName === 'end') {
                    reasons.push(`"${stageName}" n'est jamais référencé (probablement géré par le code avec isEnd: true)`);
                } else if (stage.isEnd) {
                    reasons.push(`"${stageName}" est marqué isEnd mais jamais référencé (contenu mort)`);
                } else {
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
                reasons,
                message: `Stages potentiellement non atteignables: ${unreachableStages.join(', ')}`
            });
        }
    });

    // Vérifier les loadScenario
    scenariosData.scenarios.forEach((scenario: any) => {
        Object.keys(scenario.stages).forEach(stageKey => {
            const stage = scenario.stages[stageKey];
            if (stage.choices) {
                stage.choices.forEach((choice: any, choiceIndex: number) => {
                    if (choice.loadScenario) {
                        const targetScenario = scenariosData.scenarios.find((s: any) => s.id === choice.loadScenario);
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
    if (categoriesData?.categories) {
        Object.entries(categoriesData.categories).forEach(([categoryName, category]: [string, any]) => {
            stats.totalCategories++;

            if (category.prerequisites?.condition) {
                validateCondition(
                    category.prerequisites.condition,
                    'category',
                    `category:${categoryName}`,
                    `Category ${categoryName} > Prerequisites`
                );
            }

            category.scenarios.forEach((scenarioRef: any, index: number) => {
                stats.totalCategoryScenarios++;

                const scenarioExists = scenariosData.scenarios.find((s: any) => s.id === scenarioRef.key);
                if (!scenarioExists) {
                    issues.push({
                        type: 'CATEGORY_INVALID_SCENARIO',
                        category: categoryName,
                        scenario: scenarioRef.key,
                        index,
                        message: `Le scénario "${scenarioRef.key}" référencé dans la catégorie n'existe pas`
                    });
                }

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
    }

    // VÉRIFICATION DES VARIABLES CUSTOM
    customVariables.forEach((varData, varName) => {
        if (!varName.startsWith('_') && !varName.startsWith('$')) {
            return;
        }

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

        if (varData.createdIn.size > 0 && varData.usedIn.size === 0) {
            warnings.push({
                type: 'VARIABLE_NEVER_USED',
                variable: varName,
                createdIn: Array.from(varData.createdIn),
                message: `Variable "${varName}" créée dans ${varData.createdIn.size} scénario(s) mais jamais utilisée`
            });
        }
    });

    return {
        stats,
        issues,
        warnings,
        customVariables
    };
}
