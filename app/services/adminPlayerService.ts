import { collection, getDocs, orderBy, query, limit as firestoreLimit } from "firebase/firestore";
import { dbAdmin } from "~/config/firebase";
import { firestoreServiceAdmin } from "./firestoreServiceAdmin";
import { statsService, type PlayerGlobalStats } from "./statsService";
import type { UserProfile } from "~/infrastructure/context/PseudoProvider";
import type { PlayerStats, PlayerParameters, GoalProfile } from "~/models/game";

export interface PlayerAdminData {
    uid: string;
    pseudonym: string;
    email?: string;
    stats: PlayerStats;
    totalScenarios: number;
    totalPlayTime: number;
    createdAt: string;
    lastModifiedAt: string;
}

/**
 * AdminPlayerService provides methods for administrators to manage player data.
 * This includes viewing, editing, and deleting player information.
 */
export const adminPlayerService = {
    /**
     * Gets all players with their combined profile and stats data.
     * @returns A promise that resolves with an array of player data
     */
    async getAllPlayers(): Promise<PlayerAdminData[]> {
        try {
            // Récupérer tous les profils utilisateurs
            const profiles = await statsService.getAllUserProfiles();

            // Récupérer toutes les stats
            const allStats = await statsService.getAllPlayerStats();

            // Créer un map des stats par UID pour un accès rapide
            const statsMap = new Map<string, PlayerGlobalStats>();
            allStats.forEach((stat) => {
                statsMap.set(stat.uid, stat);
            });

            // Combiner les données
            const players: PlayerAdminData[] = profiles.map((profile) => {
                const stats = statsMap.get(profile.uid);
                // Extraire lastModifiedAt depuis syncMetadata, fallback vers lastUpdated (ancien format), puis createdAt
                const lastModifiedAt = (stats as any)?.syncMetadata?.lastModifiedAt || (stats as any)?.lastUpdated || profile.createdAt;
                return {
                    uid: profile.uid,
                    pseudonym: profile.pseudonym,
                    email: (profile as any).email,
                    stats: stats?.currentStats || { character: 0, skills: 0, context: 0, experience: 0 },
                    totalScenarios: stats?.totalScenarios || 0,
                    totalPlayTime: stats?.totalPlayTime || 0,
                    createdAt: profile.createdAt,
                    lastModifiedAt: lastModifiedAt,
                };
            });

            // Trier par date de dernière mise à jour (plus récent d'abord)
            players.sort((a, b) => new Date(b.lastModifiedAt).getTime() - new Date(a.lastModifiedAt).getTime());

            return players;
        } catch (error) {
            console.error("Failed to get all players:", error);
            throw error;
        }
    },

    /**
     * Updates a player's pseudonym.
     * @param uid - The player's user ID
     * @param newPseudonym - The new pseudonym
     */
    async updatePlayerPseudonym(uid: string, newPseudonym: string): Promise<void> {
        try {
            // Vérifier que le nouveau pseudonyme n'est pas déjà utilisé
            // const exists = await firestoreServiceAdmin.checkPseudonymExists(newPseudonym);

            // Obtenir le pseudonyme actuel
            const profileDoc = await firestoreServiceAdmin.getDocument("userProfiles", uid);
            const currentPseudonym = profileDoc.exists() ? (profileDoc.data() as UserProfile).pseudonym : null;

            // Si le pseudonyme existe et n'est pas celui de l'utilisateur actuel, lever une erreur
            if (currentPseudonym === newPseudonym) {
                return;
            }

            await firestoreServiceAdmin.updateDocument("userProfiles", uid, {
                pseudonym: newPseudonym,
            });

            // Mettre à jour aussi dans playerStats si présent
            const stats = await statsService.getPlayerStats(uid);
            if (stats) {
                await firestoreServiceAdmin.updateDocument("playerStats", uid, {
                    pseudonym: newPseudonym,
                });
            }

            console.log(`Updated pseudonym for user ${uid} to ${newPseudonym}`);
        } catch (error) {
            console.error("Failed to update player pseudonym:", error);
            throw error;
        }
    },

    /**
     * Updates a player's stats.
     * @param uid - The player's user ID
     * @param newStats - The new stats values
     */
    async updatePlayerStats(uid: string, newStats: Partial<PlayerStats>): Promise<void> {
        try {
            const stats = await statsService.getPlayerStats(uid);

            if (!stats) {
                throw new Error("Player stats not found");
            }

            const updatedStats: PlayerStats = {
                ...stats.currentStats,
                ...newStats,
            };

            const now = new Date().toISOString();
            const existingMetadata = (stats as any)?.syncMetadata;

            await firestoreServiceAdmin.updateDocument("playerStats", uid, {
                currentStats: updatedStats,
                "currentProfile.statistics": updatedStats,
                "syncMetadata.lastModifiedAt": now,
                "syncMetadata.syncVersion": (existingMetadata?.syncVersion || 0) + 1,
            });

            console.log(`Updated stats for user ${uid}`);
        } catch (error) {
            console.error("Failed to update player stats:", error);
            throw error;
        }
    },

    /**
     * Updates a player's trophies.
     * @param uid - The player's user ID
     * @param newTrophies - The new trophies array
     */
    async updatePlayerTrophies(uid: string, newTrophies: string[]): Promise<void> {
        try {
            const stats = await statsService.getPlayerStats(uid);

            if (!stats || !stats.currentProfile) {
                throw new Error("Player profile not found");
            }

            const now = new Date().toISOString();
            const existingMetadata = (stats as any)?.syncMetadata;

            await firestoreServiceAdmin.updateDocument("playerStats", uid, {
                "currentProfile.trophies": newTrophies,
                "syncMetadata.lastModifiedAt": now,
                "syncMetadata.syncVersion": (existingMetadata?.syncVersion || 0) + 1,
            });

            console.log(`Updated trophies for user ${uid}`);
        } catch (error) {
            console.error("Failed to update player trophies:", error);
            throw error;
        }
    },

    /**
     * Updates a player's profile type.
     * @param uid - The player's user ID
     * @param profileId - The new profile ID
     * @param profileName - The new profile name
     */
    async updatePlayerProfileType(uid: string, profileId: string, profileName: string): Promise<void> {
        try {
            const stats = await statsService.getPlayerStats(uid);

            if (!stats || !stats.currentProfile) {
                throw new Error("Player profile not found");
            }

            const now = new Date().toISOString();
            const existingMetadata = (stats as any)?.syncMetadata;

            await firestoreServiceAdmin.updateDocument("playerStats", uid, {
                "currentProfile.profileId": profileId,
                "currentProfile.profileName": profileName,
                "syncMetadata.lastModifiedAt": now,
                "syncMetadata.syncVersion": (existingMetadata?.syncVersion || 0) + 1,
            });

            console.log(`Updated profile type for user ${uid} to ${profileName}`);
        } catch (error) {
            console.error("Failed to update player profile type:", error);
            throw error;
        }
    },

    /**
     * Updates a player's game completion status.
     * @param uid - The player's user ID
     * @param isGameCompleted - Whether the game is completed
     */
    async updatePlayerGameCompletion(uid: string, isGameCompleted: boolean): Promise<void> {
        try {
            const stats = await statsService.getPlayerStats(uid);

            if (!stats || !stats.currentProfile) {
                throw new Error("Player profile not found");
            }

            const now = new Date().toISOString();
            const existingMetadata = (stats as any)?.syncMetadata;

            await firestoreServiceAdmin.updateDocument("playerStats", uid, {
                "currentProfile.isGameCompleted": isGameCompleted,
                "syncMetadata.lastModifiedAt": now,
                "syncMetadata.syncVersion": (existingMetadata?.syncVersion || 0) + 1,
            });

            console.log(`Updated game completion status for user ${uid} to ${isGameCompleted}`);
        } catch (error) {
            console.error("Failed to update game completion status:", error);
            throw error;
        }
    },

    /**
     * Deletes a player's data completely.
     * @param uid - The player's user ID
     */
    async deletePlayer(uid: string): Promise<void> {
        try {
            await Promise.all([
                firestoreServiceAdmin.deleteDocument("userProfiles", uid),
                statsService.deletePlayerStats(uid),
            ]);

            console.log(`Deleted player ${uid}`);
        } catch (error) {
            console.error("Failed to delete player:", error);
            throw error;
        }
    },

    /**
     * Gets player statistics summary.
     * @returns A promise that resolves with summary statistics
     */
    async getPlayersSummary(): Promise<{
        totalPlayers: number;
        activePlayers: number; // Joueurs actifs dans les dernières 24h
        averageStats: PlayerStats;
        totalPlayTime: number;
    }> {
        try {
            const players = await this.getAllPlayers();
            const now = new Date();
            const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

            const activePlayers = players.filter(
                (player) => new Date(player.lastModifiedAt) > oneDayAgo
            ).length;

            const totalStats = players.reduce(
                (acc, player) => ({
                    character: acc.character + player.stats.character,
                    skills: acc.skills + player.stats.skills,
                    context: acc.context + player.stats.context,
                    experience: acc.experience + player.stats.experience,
                }),
                { character: 0, skills: 0, context: 0, experience: 0 }
            );

            const averageStats: PlayerStats = {
                character: players.length > 0 ? totalStats.character / players.length : 0,
                skills: players.length > 0 ? totalStats.skills / players.length : 0,
                context: players.length > 0 ? totalStats.context / players.length : 0,
                experience: players.length > 0 ? totalStats.experience / players.length : 0,
            };

            const totalPlayTime = players.reduce((acc, player) => acc + player.totalPlayTime, 0);

            return {
                totalPlayers: players.length,
                activePlayers,
                averageStats,
                totalPlayTime,
            };
        } catch (error) {
            console.error("Failed to get players summary:", error);
            throw error;
        }
    },
};
