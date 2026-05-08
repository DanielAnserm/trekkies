import type { PlayerStats, Profile } from "~/models/game";
import type { AdventureProfile } from "~/models/scenario";
import { generateTraits } from "../profile/generator";
import traitJson from "./traits.json";
import { profileService } from "~/infrastructure/services/profileService";
import { firestoreService } from "~/services/firestoreService";

export interface SyncMetadata {
    lastSyncedAt: string;
    lastModifiedAt: string;
    syncVersion: number;
}

export interface GlobalPlayerData {
    stats: PlayerStats;
    profile: Profile;
    totalPlayedAdventures: number;
    completedScenarios: string[]; // IDs des aventures terminées
    syncMetadata?: SyncMetadata; // ✅ Métadonnées de synchronisation
    version: string;
}

const MAX_RANDOM_INITIAL_STATS = 4;
export class GlobalStatsManager {
    private readonly GLOBAL_STATS_KEY = "trekkie_global_stats";
    private readonly CURRENT_VERSION = "1.0.0";

    async saveGlobalStats(
        stats: PlayerStats,
        profile: Profile,
        scenarioId?: string,
        isCompleted: boolean = false
    ): Promise<void> {
        try {
            const existingData = await this.loadGlobalStats();
            const now = new Date().toISOString();

            // Déterminer si les données ont changé
            const statsChanged = !existingData ||
                JSON.stringify(existingData.stats) !== JSON.stringify(stats) ||
                JSON.stringify(existingData.profile) !== JSON.stringify(profile);

            // Vérifier si un nouveau scénario sera ajouté
            const willAddScenario = scenarioId && isCompleted &&
                !(existingData?.completedScenarios || []).includes(scenarioId);

            // Ne mettre à jour lastModifiedAt que si les données ont réellement changé OU si on ajoute un scénario
            const shouldUpdateTimestamp = statsChanged || willAddScenario;
            const existingMetadata = existingData?.syncMetadata;

            const syncMetadata: SyncMetadata = {
                lastSyncedAt: now,
                lastModifiedAt: shouldUpdateTimestamp ? now : (existingMetadata?.lastModifiedAt || now),
                syncVersion: (existingMetadata?.syncVersion || 0) + 1,
            };

            const globalData: GlobalPlayerData = {
                stats: stats,
                profile: profile,
                totalPlayedAdventures: existingData?.totalPlayedAdventures || 0,
                completedScenarios: existingData?.completedScenarios || [],
                syncMetadata: syncMetadata,
                version: this.CURRENT_VERSION,
            };

            // Si l'aventure est terminée et pas déjà dans la liste
            if (willAddScenario) {
                globalData.completedScenarios.push(scenarioId);
                globalData.totalPlayedAdventures += 1;
            }

            const serializedData = JSON.stringify(globalData);
            localStorage.setItem(this.GLOBAL_STATS_KEY, serializedData);

            if (statsChanged || willAddScenario) {
                console.log("✅ Global stats saved - Data changed, updated timestamp:", now);
            } else {
                console.log("✅ Global stats saved - No changes, kept existing timestamp:", globalData.syncMetadata?.lastModifiedAt);
            }
        } catch (error) {
            console.error("Failed to save global stats:", error);
            throw new Error("Failed to save global stats");
        }
    }

    async loadGlobalStats(): Promise<GlobalPlayerData | null> {
        try {
            const serializedData = localStorage.getItem(this.GLOBAL_STATS_KEY);

            if (!serializedData) {
                return null;
            }

            const globalData: GlobalPlayerData = JSON.parse(serializedData);

            // Vérification de version
            if (globalData.version !== this.CURRENT_VERSION) {
                console.warn("Global stats version mismatch, but attempting to load anyway");
            }

            console.log("Global stats loaded successfully");
            return globalData;
        } catch (error) {
            console.error("Failed to load global stats:", error);
            return null;
        }
    }

    async getInitialProfile(): Promise<Profile> {
        const globalData = await this.loadGlobalStats();

        if (globalData) {
            return { ...globalData.profile };
        }

        const profileConfig = await profileService.selectRandomProfile();
        const profile = profileService.generateInitialProfile(profileConfig);

        return profile;

        // const stats: PlayerStats = {
        //     character: Math.floor(Math.random() * MAX_RANDOM_INITIAL_STATS),
        //     context: Math.floor(Math.random() * MAX_RANDOM_INITIAL_STATS),
        //     skills: Math.floor(Math.random() * MAX_RANDOM_INITIAL_STATS),
        //     experience: 0,
        // };
        // return {
        //     statistics: stats,
        //     interests: [],
        //     playerParameters: {},
        //     traits: generateTraits(stats, traitJson.traits),
        //     isNewProfile: true,
        //     trophies: [],
        // };
    }

    async hasCompletedScenarios(adventureId: string): Promise<boolean> {
        const globalData = await this.loadGlobalStats();
        return globalData?.completedScenarios?.includes(adventureId) || false;
    }

    async getPlayerProgress(): Promise<{
        totalScenarios: number;
        completedScenarios: string[];
        currentStats: PlayerStats;
        profile?: Profile;
    }> {
        const globalData = await this.loadGlobalStats();
        if (globalData) {
            return {
                totalScenarios: globalData.totalPlayedAdventures,
                completedScenarios: globalData.completedScenarios,
                currentStats: globalData.stats,
                profile: globalData.profile,
            };
        }
        const newProfile = await this.getInitialProfile();
        return {
            totalScenarios: 0,
            completedScenarios: [],
            currentStats: newProfile.statistics,
            profile: newProfile,
        };
    }

    async resetGlobalStats(uid?: string): Promise<void> {
        let firebaseDeleted = false;

        // Supprimer les données Firebase si un uid est fourni
        if (uid) {
            try {
                // Supprimer les statistiques du joueur
                await firestoreService.deleteDocument("playerStats", uid);
                // Supprimer le profil utilisateur
                await firestoreService.deleteDocument("userProfiles", uid);
                // Supprimer l'email (si existant)
                try {
                    await firestoreService.deleteDocument("userEmails", uid);
                } catch (e) {
                    // L'email peut ne pas exister si le joueur n'a pas terminé le jeu
                    console.log("No email to delete (user may not have completed the game)");
                }
                console.log("Firebase stats and profile deleted successfully");
                firebaseDeleted = true;
            } catch (error) {
                // Si Firebase échoue (auth, permissions, etc.), on continue quand même avec localStorage
                console.warn("Failed to delete Firebase data (user may not be authenticated):", error);
            }
        }

        // Toujours supprimer les données locales
        try {
            localStorage.removeItem(this.GLOBAL_STATS_KEY);
            console.log("Global stats reset successfully");

            if (!firebaseDeleted && uid) {
                console.warn("Local data cleared, but Firebase data could not be deleted");
            }
        } catch (error) {
            console.error("Failed to reset local stats:", error);
            throw new Error("Failed to reset local stats");
        }
    }
}
