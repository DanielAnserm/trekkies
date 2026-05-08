import type { PlayerStats, Profile } from "~/models/game";

/**
 * Represents a condition that can be checked against player stats.
 */
export enum ConditionOperator {
    GREATER_THAN = ">",
    GREATER_THAN_EQUAL = ">=",
    LESS_THAN = "<",
    LESS_THAN_EQUAL = "<=",
    EQUAL = "==",
    NOT_EQUAL = "!=",
    AND = "&&",
    OR = "||",
}

export type ConditionChecker = (condition: string | undefined, profile: Profile) => boolean;

export interface ConditionValidator {
    validate: ConditionChecker;
    parse: (condition: string) => {
        stat: keyof PlayerStats;
        operator: string;
        value: number;
    }[];
}
