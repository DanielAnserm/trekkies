import { ConditionOperator, type ConditionChecker } from "./models";
import { StatKeys, type PlayerParameters, type PlayerStats, type Profile } from "~/models/game";

function tokenizeCondition(condition: string): string[] {
    // Remplace les opérateurs par des espaces pour les séparer
    return condition
        .replace(/(\|\||&&|>=|<=|!=|==|>|<)/g, " $1 ")
        .split(/\s+/)
        .filter((token) => token.trim() !== "");
}
const evaluateCustomVariable = (
    stat: string,
    operator: string,
    value: number | string | boolean,
    playerParameters: PlayerParameters
) => {
    // Si playerParameters est null, undefined ou vide, traiter la variable comme non définie
    if (playerParameters === null || playerParameters === undefined) {
        // Pour une variable non définie, on peut la considérer comme 0 ou false selon l'opérateur
        const undefinedValue = 0;
        if (typeof value === "number") {
            return evaluateNumberCondition(undefinedValue, operator, value);
        }
        return false;
    }

    const customStat = playerParameters[stat.substring(1)];

    // Si la variable n'existe pas dans playerParameters
    if (customStat === undefined || customStat === null) {
        // Traiter comme une valeur par défaut (0 pour les nombres)
        const defaultValue = 0;
        if (typeof value === "number") {
            return evaluateNumberCondition(defaultValue, operator, value);
        }
        return false;
    }

    if (typeof value === "number") {
        return evaluateNumberCondition(customStat as number, operator, value);
    }
    if (typeof value === "string") {
        return evaluateStringCondition(customStat as string, operator, value);
    }
    return evaluateBooleanCondition(customStat as boolean, operator, value);
};

const evaluateSimpleCondition = (stat: string, operator: string, value: number, stats: PlayerStats): boolean => {
    const statValue = stats[stat as keyof PlayerStats];

    return evaluateNumberCondition(statValue as number, operator, value);
};

const evaluateNumberCondition = (statValue: number, operator: string, value: number): boolean => {
    if (typeof statValue !== "number") {
        throw new Error(`Stat invalide: ${statValue}`);
    }

    switch (operator) {
        case ConditionOperator.GREATER_THAN:
            return statValue > value;
        case ConditionOperator.GREATER_THAN_EQUAL:
            return statValue >= value;
        case ConditionOperator.LESS_THAN:
            return statValue < value;
        case ConditionOperator.LESS_THAN_EQUAL:
            return statValue <= value;
        case ConditionOperator.EQUAL:
            return statValue === value;
        case ConditionOperator.NOT_EQUAL:
            return statValue !== value;
        default:
            throw new Error(`Opérateur invalide: ${operator}`);
    }
};

const evaluateStringCondition = (statValue: string, operator: string, value: string): boolean => {
    if (typeof statValue !== "string") {
        throw new Error(`Stat invalide: ${statValue}`);
    }

    switch (operator) {
        case ConditionOperator.EQUAL:
            return statValue === value;
        case ConditionOperator.NOT_EQUAL:
            return statValue !== value;
        default:
            throw new Error(`Opérateur invalide: ${operator}`);
    }
};

const evaluateBooleanCondition = (statValue: boolean, operator: string, value: boolean): boolean => {
    if (typeof statValue !== "boolean") {
        throw new Error(`Stat invalide: ${statValue}`);
    }

    switch (operator) {
        case ConditionOperator.EQUAL:
            return statValue === value;
        case ConditionOperator.NOT_EQUAL:
            return statValue !== value;
        default:
            throw new Error(`Opérateur invalide: ${operator}`);
    }
};
const evaluateProfileId = (operator: string, expectedProfileId: string, actualProfileId?: string): boolean => {
    if (!actualProfileId) {
        return false;
    }

    switch (operator) {
        case ConditionOperator.EQUAL:
            return actualProfileId === expectedProfileId;
        case ConditionOperator.NOT_EQUAL:
            return actualProfileId !== expectedProfileId;
        default:
            throw new Error(`Opérateur invalide pour profileId: ${operator}`);
    }
};

export const checkConditionSafe: ConditionChecker = (condition, profile) => {
    if (!condition || condition.trim() === "") {
        return true;
    }
    try {
        // Retirer les parenthèses de la condition
        // Nous gérons la priorité des opérateurs correctement (AND avant OR)
        // donc les parenthèses qui respectent cette priorité peuvent être retirées
        const cleanedCondition = condition.trim().replace(/[()]/g, '');

        const tokens = tokenizeCondition(cleanedCondition);
        const results: boolean[] = [];
        const operators: string[] = [];

        for (let i = 0; i < tokens.length; i += 4) {
            const stat = tokens[i] as StatKeys;
            const operator = tokens[i + 1];
            const valueStr = tokens[i + 2];
            const logicalOp = tokens[i + 3];
            const isProfileId = (stat as string) === "$profileId";
            const isCustomVariable = stat?.startsWith("_");

            // Validation des paramètres
            if (!Object.values(StatKeys).includes(stat) && !isCustomVariable && !isProfileId) {
                throw new Error(`Stat invalide: ${stat}`);
            }

            if (
                !(
                    [
                        ConditionOperator.GREATER_THAN,
                        ConditionOperator.GREATER_THAN_EQUAL,
                        ConditionOperator.LESS_THAN,
                        ConditionOperator.LESS_THAN_EQUAL,
                        ConditionOperator.EQUAL,
                        ConditionOperator.NOT_EQUAL,
                    ] as string[]
                ).includes(operator)
            ) {
                throw new Error(`Opérateur invalide: ${operator}`);
            }

            // Déterminer le type de valeur (nombre ou chaîne)
            const numValue = parseInt(valueStr, 10);
            const isNumeric = !isNaN(numValue);

            // Pour les variables système (stats), la valeur doit être numérique
            if (!isNumeric && !isProfileId && !isCustomVariable) {
                throw new Error(`Valeur invalide pour stat système: ${valueStr}`);
            }

            // Évaluer la condition simple
            let result: boolean;
            console.log("Evaluating condition:", isProfileId, "value:", valueStr);
            if (isProfileId) {
                result = evaluateProfileId(operator, valueStr, profile.profileId);
            } else if (isCustomVariable) {
                // Pour les custom variables, passer la valeur appropriée (string ou number)
                const customValue = isNumeric ? numValue : valueStr;
                result = evaluateCustomVariable(stat, operator, customValue, profile.playerParameters || {});
            } else {
                result = evaluateSimpleCondition(stat, operator, numValue, profile.statistics);
            }
            results.push(result);

            // Stocker l'opérateur logique pour la prochaine itération
            if (logicalOp && ([ConditionOperator.AND, ConditionOperator.OR] as string[]).includes(logicalOp)) {
                operators.push(logicalOp);
            }
        }

        // Combiner les résultats en respectant la priorité des opérateurs
        // AND (&&) a une priorité plus élevée que OR (||)

        // Étape 1: D'abord traiter tous les AND
        let tempResults = [results[0]];
        let tempOperators: string[] = [];

        for (let i = 0; i < operators.length; i++) {
            if (operators[i] === ConditionOperator.AND) {
                // Combiner immédiatement avec AND
                const lastIndex = tempResults.length - 1;
                tempResults[lastIndex] = tempResults[lastIndex] && results[i + 1];
            } else {
                // C'est un OR, on le garde pour plus tard
                tempResults.push(results[i + 1]);
                tempOperators.push(operators[i]);
            }
        }

        // Étape 2: Ensuite traiter tous les OR
        let finalResult = tempResults[0];
        for (let i = 0; i < tempOperators.length; i++) {
            if (tempOperators[i] === ConditionOperator.OR) {
                finalResult = finalResult || tempResults[i + 1];
            }
        }

        return finalResult;
    } catch (error) {
        console.error("Erreur dans checkCondition:", error);
        return false; // En cas d'erreur, on refuse l'accès
    }
};
