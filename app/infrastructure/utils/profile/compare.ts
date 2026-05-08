import { TROPHIES } from "~/features/adventure/TrophyCard";
import type { TrophyItem } from "~/features/adventure/TrophyItem";
import { StatKeys, type GoalProfile, type Profile } from "~/models/game";

export interface ProfileDiff {
    traits: {
        added: Record<string, string>;
        removed: Record<string, string>;
        modified: Record<string, { old: string; new: string }>;
    };
    interests: {
        added: string[];
        removed: string[];
    };
    statistics: {
        changed: Record<StatKeys, { old: number; new: number }>;
    };
    playerParameters: {
        added: Record<string, boolean | string | number>;
        removed: Record<string, boolean | string | number>;
        modified: Record<string, { old: boolean | string | number; new: boolean | string | number }>;
    };
    goal: {
        changed: boolean;
        old?: GoalProfile;
        new?: GoalProfile;
        added: boolean;
    };
    trophies: {
        added: TrophyItem[];
        removed: TrophyItem[];
    };
}

/**
 * Compares two profiles and returns the differences.
 * @param profile1 - The original/default profile (before changes)
 * @param profile2 - The changed/updated profile (after changes)
 * @returns ProfileDiff object showing all differences
 */
export function compareProfiles(profile1?: Profile, profile2?: Profile): ProfileDiff {
    const diff: ProfileDiff = {
        traits: {
            added: {},
            removed: {},
            modified: {},
        },
        interests: {
            added: [],
            removed: [],
        },
        statistics: {
            changed: {} as Record<StatKeys, { old: number; new: number }>,
        },
        playerParameters: {
            added: {},
            removed: {},
            modified: {},
        },
        goal: {
            changed: false,
            added: false,
        },
        trophies: {
            added: [],
            removed: [],
        },
    };
    if (!profile2 || !profile1) {
        return diff;
    }
    // Compare traits (profile1 = original, profile2 = changed)
    const allTraitKeys = new Set([...Object.keys(profile1.traits), ...Object.keys(profile2.traits)]);

    allTraitKeys.forEach((key) => {
        const val1 = profile1.traits[key];
        const val2 = profile2.traits[key];

        if (val1 === undefined && val2 !== undefined) {
            // Trait added in profile2
            diff.traits.added[key] = val2;
        } else if (val1 !== undefined && val2 === undefined) {
            // Trait removed in profile2
            diff.traits.removed[key] = val1;
        } else if (val1 !== val2) {
            // Trait modified in profile2
            diff.traits.modified[key] = { old: val1, new: val2 };
        }
    });

    // Compare interests (profile1 = original, profile2 = changed)
    const interests1Set = new Set(profile1.interests);
    const interests2Set = new Set(profile2.interests);

    profile2.interests.forEach((interest) => {
        if (!interests1Set.has(interest)) {
            // Interest added in profile2
            diff.interests.added.push(interest);
        }
    });

    profile1.interests.forEach((interest) => {
        if (!interests2Set.has(interest)) {
            // Interest removed in profile2
            diff.interests.removed.push(interest);
        }
    });

    // Compare statistics (profile1 = original, profile2 = changed)
    Object.values(StatKeys).forEach((key) => {
        const stat1 = profile1.statistics[key];
        const stat2 = profile2.statistics[key];

        if (stat1 !== stat2) {
            diff.statistics.changed[key] = { old: stat1, new: stat2 };
        }
    });

    // Compare playerParameters (profile1 = original, profile2 = changed)
    const allParamKeys = new Set([...Object.keys(profile1.playerParameters), ...Object.keys(profile2.playerParameters)]);

    allParamKeys.forEach((key) => {
        const val1 = profile1.playerParameters[key];
        const val2 = profile2.playerParameters[key];

        if (val1 === undefined && val2 !== undefined) {
            // Parameter added in profile2
            diff.playerParameters.added[key] = val2;
        } else if (val1 !== undefined && val2 === undefined) {
            // Parameter removed in profile2
            diff.playerParameters.removed[key] = val1;
        } else if (val1 !== val2) {
            // Parameter modified in profile2
            diff.playerParameters.modified[key] = { old: val1, new: val2 };
        }
    });

    // Compare goal (profile1 = original, profile2 = changed)
    // Goal can only be added (from undefined to a value)
    if (profile1.goal !== profile2.goal) {
        diff.goal.changed = true;
        diff.goal.old = profile1.goal;
        diff.goal.new = profile2.goal;

        // Check if goal was added in profile2
        if (profile1.goal === undefined && profile2.goal !== undefined) {
            // Goal added in profile2
            diff.goal.added = true;
        }
    }

    // Compare trophies (profile1 = original, profile2 = changed)
    const trophies1Set = new Set(profile1.trophies);
    const trophies2Set = new Set(profile2.trophies);

    profile2?.trophies?.forEach((key) => {
        if (!trophies1Set.has(key)) {
            // Trophy added in profile2
            const trophy: TrophyItem = TROPHIES.find((x) => x.key == key) || { key: key, img: "" };
            diff.trophies?.added.push(trophy);
        }
    });

    profile1?.trophies?.forEach((key) => {
        if (!trophies2Set.has(key)) {
            // Trophy removed in profile2
            const trophy: TrophyItem = TROPHIES.find((x) => x.key == key) || { key: key, img: "" };
            diff.trophies?.removed.push(trophy);
        }
    });

    return diff;
}

// Helper function to check if there are any differences
export function hasChangesTraits(diff: ProfileDiff): boolean {
    return (
        Object.keys(diff.traits.added).length > 0 ||
        Object.keys(diff.traits.removed).length > 0 ||
        Object.keys(diff.traits.modified).length > 0
    );
}

export function hasChangesInterests(diff: ProfileDiff): boolean {
    return (
        diff.interests.added.length > 0 ||
        diff.interests.removed.length > 0
    );
}

export function hasChangesStatistics(diff: ProfileDiff): boolean {
    return Object.keys(diff.statistics.changed).length > 0;
}

export function hasChangesPlayerParameters(diff: ProfileDiff): boolean {
    return (
        Object.keys(diff.playerParameters.added).length > 0 ||
        Object.keys(diff.playerParameters.removed).length > 0 ||
        Object.keys(diff.playerParameters.modified).length > 0
    );
}

export function hasChangesGoal(diff: ProfileDiff): boolean {
    return diff.goal.changed;
}

export function hasChangesTrophies(diff: ProfileDiff): boolean {
    return (
        diff.trophies.added.length > 0 ||
        diff.trophies.removed.length > 0
    );
}

// Helper function to check if there are any differences
export function hasChanges(diff: ProfileDiff): boolean {
    return (
        hasChangesTraits(diff) ||
        hasChangesInterests(diff) ||
        hasChangesStatistics(diff) ||
        // hasChangesPlayerParameters(diff) ||
        hasChangesGoal(diff) ||
        hasChangesTrophies(diff)
    );
}

