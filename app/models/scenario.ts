import type { PlayerStats, StatKeys } from "./game";
import type { GoalConfig, InterestConfig, TraitConfig } from "./profile";

/**
 * Represents a selectable option within a stage, typically used in interactive narratives or games.
 */
export interface Choice {
    /**
     * The display text for the choice shown to the user.
     * This is the text that will be presented in the UI for the player to select.
     */
    text: string;
    /**
     * The identifier of the next stage or state to navigate to if this choice is selected.
     * This should match a key in the stages object to ensure proper navigation.
     */
    next?: string;
    loadScenario?: string;
    /**
     * (Optional) A JavaScript expression as a string that determines if this choice is available, e.g.
     * Example: "context >= 5"
     * This condition is evaluated against the player's stats.
     * If the condition is not met, the choice will not be displayed.
     * @example "context >= 5"
     * @example "skills < 3 && experience >= 2"
     * @example "character === 1 || skills > 2"
     */
    condition?: string; // Condition JavaScript sous forme de string (ex: "context >= 5")
    /**
     * (Optional) A human-readable description of the condition for UI display purposes.
     * @example "Skills > 3 and Experience >= 2"
     */
    requirement?: string;
    /**
     * (Optional) An object describing any changes to stats that occur when this choice is selected.
     * This object can contain any combination of the PlayerStats properties.
     * This allows for dynamic stat changes based on the player's choice.
     * -999 resets the stat to zero.
     * If a stat is not included, it remains unchanged.
     * @example { character: 1, skills: -1 }
     * @example { experience: -1, skills: -999 }
     */
    changes?: ChoiceChanges;
}

export interface ChoiceChanges {
    stats?: StatisticChanges;
    traits?: ProfileChanges;
    interests?: ProfileChanges;
    goals?: ProfileChanges;
    playerParameters?: PlayerParameterChanges;
    unlockTrophies?: string[];
    gameCompleted?: boolean;
}

interface ChoiceChangeValue<T, V> {
    type: T;
    value: V;
}

export enum ProfileChangeType {
    Add = "add",
    Remove = "remove",
}

interface ProfileChanges
    extends Record<string, ChoiceChangeValue<ProfileChangeType, never>> {}

export enum StatisticChangeType {
    Add = "add",
    Sub = "sub",
    Set = "set",
}

export interface StatisticChanges
    extends Record<StatKeys, ChoiceChangeValue<StatisticChangeType, number>> {}

export enum PlayerParameterChangeType {
    Add = "add",
    Remove = "remove",
    Set = "set",
}

interface PlayerParameterChanges
    extends Record<
        string,
        ChoiceChangeValue<PlayerParameterChangeType, boolean | string | number>
    > {}

export interface Stage {
    title: string;
    description: string;
    isEnd?: boolean;
    isSuccess?: boolean;
    choices: Choice[];
    changes?: ChoiceChanges;
}

export interface Stages {
    [key: string]: Stage;
}

export interface Scenario {
    id: string;
    title: string;
    description: string;
    showIntro?: boolean;
    image?: string | null;
    stages: Stages;
    condition?: string;
}

export interface AdventureProfile {
    traits: Record<string, TraitConfig[]>;
    interests: InterestConfig[];
    goals: GoalConfig[];
}

export interface CategoryPrerequisites {
    condition?: string; // Condition sur les stats (ex: "experience >= 5 && context >= 3")
    trophies?: string[]; // Trophées requis
}

export interface Category {
    prerequisites?: CategoryPrerequisites;
    scenarios: CategoryScenario[];
}

export interface CategoryScenario {
    key: string;
    version: string;
    condition?: string; // Condition pour le scénario lui-même
    profileId?: string; // ID du profil requis (optionnel)
}

export interface CategoriesData {
    categories: Record<string, Category>;
}
