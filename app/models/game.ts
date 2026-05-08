export enum StatKeys {
    Character = "character",
    Skills = "skills",
    Context = "context",
    Experience = "experience",
}

export const STAT_ICONS: Record<StatKeys, string> = {
    [StatKeys.Character]: "🎭",
    [StatKeys.Skills]: "🛠️",
    [StatKeys.Context]: "🌍",
    [StatKeys.Experience]: "💼",
};

export type PlayerStats = Record<StatKeys, number>;

export interface AppState {
    currentScenario: string;
    gameHistory: HistoryEntry[];
    profile: Profile;
    profileAtStart?: Profile;
}

export interface SaveData {
    currentScenario: string;
    scenarioId: string;
    profile: Profile; // Contient statistics
    history: HistoryEntry[];
    timestamp: number;
    version: string;
    profileAtStart?: Profile;
}

export type Profile = {
    traits: TraitsProfile;
    interests: InterestsProfile;
    statistics: PlayerStats;
    playerParameters: PlayerParameters;
    goal?: GoalProfile;
    isNewProfile?: boolean;
    isGameCompleted?: boolean;
    trophies: string[];
    profileId?: string;
    profileName?: string;
};

export type TraitsProfile = Record<string, string>;
export type InterestsProfile = string[];
export type GoalProfile = string;

export type PlayerParameters = Record<string, boolean | string | number>;

export interface SaveManager {
    save: (data: SaveData) => Promise<void>;
    load: () => Promise<SaveData | null>;
    exists: () => Promise<boolean>;
    delete: () => Promise<void>;
}

export interface HistoryEntry {
    scenario: string;
    choice: string;
    statsAtTime: PlayerStats;
}
