import type { PlayerStats } from "~/models/game";
import type { GoalConfig, InterestConfig, TraitConfig } from "~/models/profile";
import type { AdventureProfile } from "~/models/scenario";

const checkMinCondition = (stats: PlayerStats, minStats?: Partial<PlayerStats>) => {
    if (minStats) {
        const hasMinStats = Object.entries(minStats).every(
            ([stat, minValue]) => stats[stat as keyof PlayerStats] >= (minValue as number)
        );
        return hasMinStats;
    }
    return true;
};

const checkMaxCondition = (stats: PlayerStats, maxStats?: Partial<PlayerStats>) => {
    if (maxStats) {
        const hasMaxStats = Object.entries(maxStats).every(
            ([stat, minValue]) => stats[stat as keyof PlayerStats] >= (minValue as number)
        );
        return hasMaxStats;
    }
    return true;
};

const checkTotalMinimum = (stats: PlayerStats, totalMinimum?: number) => {
    if (totalMinimum) {
        const total = Object.values(stats).reduce((sum, val) => sum + val, 0);
        if (total < totalMinimum) return false;
    }
    return true;
};

const checkTotalMaximum = (stats: PlayerStats, totalMaximum?: number) => {
    if (totalMaximum) {
        const total = Object.values(stats).reduce((sum, val) => sum + val, 0);
        if (total > totalMaximum) return false;
    }
    return true;
};

const checkDominantStat = (stats: PlayerStats, dominantStat?: keyof PlayerStats) => {
    if (dominantStat) {
        const dominantValue = stats[dominantStat];
        const isDominant = Object.entries(stats)
            .filter(([key]) => key !== dominantStat)
            .every(([, value]) => dominantValue >= value);
        if (!isDominant) return false;
    }
    return true;
};
const checkBalancedStats = (stats: PlayerStats, balancedStats?: boolean) => {
    if (balancedStats) {
        const values = Object.values(stats);
        const max = Math.max(...values);
        const min = Math.min(...values);

        // Considère comme équilibré si l'écart max-min est <= 3
        if (max - min > 3) return false;
    }

    return true;
};
const checkStatConditions = (stats: PlayerStats, conditions: TraitConfig["conditions"]): boolean => {
    return (
        checkMinCondition(stats, conditions.minStats) &&
        checkMaxCondition(stats, conditions.maxStats) &&
        checkTotalMinimum(stats, conditions.totalMinimum) &&
        checkTotalMaximum(stats, conditions.totalMaximum)
    );
};

const checkInterestConditions = (stats: PlayerStats, conditions: InterestConfig["conditions"]): boolean => {
    return (
        checkMinCondition(stats, conditions.minStats) &&
        checkMaxCondition(stats, conditions.maxStats) &&
        checkDominantStat(stats, conditions.dominantStat) &&
        checkBalancedStats(stats, conditions.balancedStats)
    );
};

const checkGoalConditions = (stats: PlayerStats, conditions: GoalConfig["conditions"]): boolean => {
    return (
        checkMinCondition(stats, conditions.minStats) &&
        checkMaxCondition(stats, conditions.maxStats) &&
        checkDominantStat(stats, conditions.dominantStat)
    );
};

export const generateTraits = (stats: PlayerStats, configTraits: AdventureProfile["traits"]): Record<string, string> => {
    const traits: Record<string, string> = {};

    Object.entries(configTraits).forEach(([traitCategory, configs]) => {
        const eligibleTraits = configs
            .filter((traitConfig) => checkStatConditions(stats, traitConfig.conditions))
            .sort((a, b) => (b.weight || 0) - (a.weight || 0));

        if (eligibleTraits.length > 0) {
            const selectedTrait = eligibleTraits[0];
            traits[traitCategory] = selectedTrait.name;
        }
    });

    return traits;
};

export const generateInterests = (
    stats: PlayerStats,
    interests: AdventureProfile["interests"],
    maxInterests: number = 3
): string[] => {
    const eligibleInterests = interests
        .filter((interestConfig) => checkInterestConditions(stats, interestConfig.conditions))
        .sort((a, b) => (b.weight || 0) - (a.weight || 0));

    return eligibleInterests.slice(0, maxInterests).map((interest) => interest.name);
};

export const generateDynamicGoal = (stats: PlayerStats, goals: AdventureProfile["goals"]): string | undefined => {
    const eligibleGoals = goals
        .filter((goalConfig) => checkGoalConditions(stats, goalConfig.conditions))
        .sort((a, b) => (b.weight || 0) - (a.weight || 0));

    if (eligibleGoals.length > 0) {
        return eligibleGoals[0].name;
    }

    return undefined;
};

export const generateDynamicProfile = (stats: PlayerStats, config: AdventureProfile) => {
    const traits = generateTraits(stats, config.traits);
    const interests = generateInterests(stats, config.interests);
    const goal = generateDynamicGoal(stats, config.goals);

    return {
        traits,
        interests,
        goal,
        stats,
    };
};
