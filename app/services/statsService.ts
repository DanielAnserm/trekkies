import type { PlayerStats, Profile } from "~/models/game";
import { firestoreService } from "./firestoreService";
import type { UserProfile } from "~/infrastructure/context/PseudoProvider";
import { collection, getDocs } from "firebase/firestore";
import { db } from "~/config/firebase";

export interface ScenarioCompletion {
    scenarioId: string;
    scenarioTitle: string;
    finalProfile: Profile;
    choices: string[]; // Liste des choix effectués
    completionTime: number; // Durée en millisecondes
    completedAt: string; // ISO string
    scenarioPath: string[]; // Chemin des scénarios traversés
}

export interface PlayerGlobalStats {
    uid: string;
    currentStats: PlayerStats;
    currentProfile: Profile;
    totalScenarios: number;
    completedScenarios: ScenarioCompletion[];
    totalPlayTime: number; // En millisecondes
    // favoriteChoiceTypes: Record<string, number>; // Types de choix préférés
    createdAt: string;
}

export const statsService = {
    /**
     * Sauvegarde les stats globales du joueur
     */
    async savePlayerStats(uid: string, profile: Profile): Promise<void> {
        try {
            const existingStats = await this.getPlayerStats(uid);
            const now = new Date().toISOString();

            let playerStats: Partial<PlayerGlobalStats> = {
                uid,
                currentStats: profile.statistics,
                currentProfile: profile,
            };

            // Si c'est la première fois, initialiser les champs
            if (!existingStats) {
                playerStats.totalScenarios = 0;
                playerStats.completedScenarios = [];
                playerStats.totalPlayTime = 0;
                playerStats.createdAt = now;
            } else {
                playerStats = { ...existingStats, ...playerStats };
            }

            // Mettre à jour syncMetadata
            const existingMetadata = (existingStats as any)?.syncMetadata;
            const syncMetadata = {
                lastSyncedAt: now,
                lastModifiedAt: now,
                syncVersion: (existingMetadata?.syncVersion || 0) + 1,
            };

            await firestoreService.setDocument("playerStats", uid, { ...playerStats, syncMetadata });
            console.log("Player stats saved to Firebase");
        } catch (error) {
            console.error("Failed to save player stats:", error);
            throw error;
        }
    },

    /**
     * Récupère les stats globales du joueur
     */
    async getPlayerStats(uid: string): Promise<PlayerGlobalStats | null> {
        try {
            const doc = await firestoreService.getDocument("playerStats", uid);
            if (doc.exists()) {
                return doc.data() as PlayerGlobalStats;
            }
            return null;
        } catch (error) {
            console.error("Failed to get player stats:", error);
            return null;
        }
    },
    async getAllPlayerStats(): Promise<PlayerGlobalStats[]> {
        try {
            const querySnapshot = await getDocs(collection(db, "playerStats"));
            const allStats: PlayerGlobalStats[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data() as PlayerGlobalStats;
                // S'assurer que les stats sont valides
                data.currentProfile = data.currentProfile || {
                    statistics: data.currentStats,
                };
                if (data.currentProfile) {
                    allStats.push({
                        ...data,
                        uid: doc.id,
                    });
                }
            });

            return allStats;
        } catch (error) {
            console.error("Failed to get all player stats:", error);
            return [];
        }
    },

    /**
     * Récupère tous les profils utilisateurs pour le classement
     */
    async getAllUserProfiles(): Promise<UserProfile[]> {
        try {
            const querySnapshot = await getDocs(collection(db, "userProfiles"));
            const profiles: UserProfile[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.pseudonym) {
                    profiles.push({
                        uid: doc.id,
                        pseudonym: data.pseudonym,
                        createdAt: data.createdAt || new Date().toISOString(),
                    });
                }
            });

            return profiles;
        } catch (error) {
            console.error("Failed to get all user profiles:", error);
            return [];
        }
    },
    /**
     * Enregistre la completion d'une aventure
     */
    async recordScenarioCompletion(uid: string, scenarioCompletion: Omit<ScenarioCompletion, "completedAt">): Promise<void> {
        try {
            const existingStats = await this.getPlayerStats(uid);
            const now = new Date().toISOString();

            const completion: ScenarioCompletion = {
                ...scenarioCompletion,
                completedAt: now,
            };

            const updatedStats: PlayerGlobalStats = {
                uid,
                currentStats: completion.finalProfile.statistics,
                currentProfile: completion.finalProfile,
                totalScenarios: (existingStats?.totalScenarios || 0) + 1,
                completedScenarios: [...(existingStats?.completedScenarios || []), completion],
                totalPlayTime: (existingStats?.totalPlayTime || 0) + completion.completionTime,
                // favoriteChoiceTypes: this.updateFavoriteChoices(
                //     existingStats?.favoriteChoiceTypes || {},
                //     completion.choices
                // ),
                createdAt: existingStats?.createdAt || now,
            };

            // Mettre à jour syncMetadata
            const existingMetadata = (existingStats as any)?.syncMetadata;
            const syncMetadata = {
                lastSyncedAt: now,
                lastModifiedAt: now,
                syncVersion: (existingMetadata?.syncVersion || 0) + 1,
            };

            await firestoreService.setDocument("playerStats", uid, { ...updatedStats, syncMetadata });
            console.log("Scenario completion recorded in Firebase");
        } catch (error) {
            console.error("Failed to record scenario completion:", error);
            throw error;
        }
    },

    /**
     * Récupère les statistiques d'une aventure spécifique
     */
    async getScenarioStats(scenarioId: string): Promise<{
        totalCompletions: number;
        averageStats: PlayerStats;
        popularChoices: Record<string, number>;
    }> {
        try {
            // Cette requête nécessiterait une structure de données différente pour être efficace
            // Pour l'instant, on peut retourner des stats locales ou implementer une collection séparée
            return {
                totalCompletions: 0,
                averageStats: { character: 0, context: 0, skills: 0, experience: 0 },
                popularChoices: {},
            };
        } catch (error) {
            console.error("Failed to get scenario stats:", error);
            throw error;
        }
    },

    /**
     * Récupère le classement des joueurs (top stats)
     */
    async getLeaderboard(
        statType: keyof PlayerStats,
        limit: number = 10
    ): Promise<
        Array<{
            uid: string;
            value: number;
            totalScenarios: number;
        }>
    > {
        try {
            // Cette requête nécessiterait des index composés sur Firestore
            // Pour l'instant, retourner un tableau vide ou implementer avec une requête simple
            return [];
        } catch (error) {
            console.error("Failed to get leaderboard:", error);
            return [];
        }
    },

    /**
     * Supprime toutes les stats d'un joueur
     */
    async deletePlayerStats(uid: string): Promise<void> {
        try {
            await firestoreService.deleteDocument("playerStats", uid);
            console.log("Player stats deleted from Firebase");
        } catch (error) {
            console.error("Failed to delete player stats:", error);
            throw error;
        }
    },
};
