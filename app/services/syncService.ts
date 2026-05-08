import { statsService, type PlayerGlobalStats } from "./statsService";
import { firestoreService } from "./firestoreService";
import type { Profile, PlayerStats } from "~/models/game";
import type { UserProfile } from "~/infrastructure/context/PseudoProvider";

export interface SyncMetadata {
    lastSyncedAt: string; // ISO timestamp
    lastModifiedAt: string; // ISO timestamp
    syncVersion: number;
}

export interface PlayerSyncData extends PlayerGlobalStats {
    pseudonym?: string;
    syncMetadata: SyncMetadata;
}

/**
 * SyncService manages synchronization of player stats between local storage and Firebase.
 * It uses timestamps to track changes and prevent conflicts.
 */
export const syncService = {
    /**
     * Synchronizes player stats to Firebase with timestamp tracking.
     * @param uid - The user ID
     * @param profile - The player's profile data
     * @param pseudonym - Optional player pseudonym
     * @returns A promise that resolves when sync is complete
     */
    async syncPlayerStats(uid: string, profile: Profile, pseudonym?: string): Promise<void> {
        try {
            const existingStats = await statsService.getPlayerStats(uid);
            const now = new Date().toISOString();

            // Déterminer si les données ont changé en comparant les stats
            const statsChanged = !existingStats ||
                JSON.stringify(existingStats.currentStats) !== JSON.stringify(profile.statistics) ||
                JSON.stringify(existingStats.currentProfile) !== JSON.stringify(profile);

            // Préparer les métadonnées de synchronisation
            const syncMetadata: SyncMetadata = {
                lastSyncedAt: now,
                // Ne mettre à jour lastModifiedAt que si les données ont changé
                lastModifiedAt: statsChanged ? now : ((existingStats as any)?.syncMetadata?.lastModifiedAt || now),
                syncVersion: ((existingStats as any)?.syncMetadata?.syncVersion || 0) + 1,
            };

            // Préparer les données complètes
            let playerData: Partial<PlayerGlobalStats & { syncMetadata: SyncMetadata; pseudonym?: string }> = {
                uid,
                currentStats: profile.statistics,
                currentProfile: profile,
                syncMetadata,
            };

            if (pseudonym) {
                playerData.pseudonym = pseudonym;
            }

            // Si c'est la première synchronisation, initialiser les champs
            if (!existingStats) {
                playerData.totalScenarios = 0;
                playerData.completedScenarios = [];
                playerData.totalPlayTime = 0;
                playerData.createdAt = now;
            } else {
                playerData = { ...existingStats, ...playerData };
            }

            await firestoreService.setDocument("playerStats", uid, playerData);
            if (statsChanged) {
                console.log("✅ Player stats synced to Firebase - Data changed, updated timestamp:", syncMetadata.lastModifiedAt);
            } else {
                console.log("✅ Player stats synced to Firebase - No data changes, kept existing timestamp:", syncMetadata.lastModifiedAt);
            }
        } catch (error) {
            console.error("Failed to sync player stats:", error);
            throw error;
        }
    },

    /**
     * Gets the last sync timestamp for a player.
     * @param uid - The user ID
     * @returns A promise that resolves with the last sync timestamp or null
     */
    async getLastSyncTimestamp(uid: string): Promise<string | null> {
        try {
            const stats = await statsService.getPlayerStats(uid);
            if (stats && (stats as any).syncMetadata) {
                return (stats as any).syncMetadata.lastSyncedAt;
            }
            // Fallback: utiliser createdAt si syncMetadata n'existe pas
            return (stats as any)?.createdAt || null;
        } catch (error) {
            console.error("Failed to get last sync timestamp:", error);
            return null;
        }
    },

    /**
     * Checks if player data needs to be synced based on time elapsed.
     * @param uid - The user ID
     * @param syncIntervalMinutes - Sync interval in minutes (default: 5)
     * @returns A promise that resolves to true if sync is needed
     */
    async needsSync(uid: string, syncIntervalMinutes: number = 5): Promise<boolean> {
        try {
            const lastSync = await this.getLastSyncTimestamp(uid);
            if (!lastSync) return true;

            const lastSyncDate = new Date(lastSync);
            const now = new Date();
            const minutesSinceSync = (now.getTime() - lastSyncDate.getTime()) / (1000 * 60);

            return minutesSinceSync >= syncIntervalMinutes;
        } catch (error) {
            console.error("Failed to check sync status:", error);
            return true; // En cas d'erreur, on assume qu'une sync est nécessaire
        }
    },

    /**
     * Gets player sync data including metadata.
     * @param uid - The user ID
     * @returns A promise that resolves with player sync data
     */
    async getPlayerSyncData(uid: string): Promise<PlayerSyncData | null> {
        try {
            const doc = await firestoreService.getDocument("playerStats", uid);
            if (doc.exists()) {
                return doc.data() as PlayerSyncData;
            }
            return null;
        } catch (error) {
            console.error("Failed to get player sync data:", error);
            return null;
        }
    },

    /**
     * Synchronizes player data FROM Firebase TO localStorage.
     * Used to apply admin changes to the player's local data.
     * @param uid - The user ID
     * @returns True if local data was updated, false otherwise
     */
    async syncFromFirebase(uid: string): Promise<boolean> {
        try {
            // Récupérer les données depuis Firebase
            const firebaseData = await this.getPlayerSyncData(uid);
            if (!firebaseData) {
                console.log("No Firebase data to sync from");
                return false;
            }

            // Récupérer les données locales
            const localData = localStorage.getItem("trekkie_global_stats");
            if (!localData) {
                console.log("No local data found");
                return false;
            }

            const localStats = JSON.parse(localData);
            // Utiliser syncMetadata.lastModifiedAt pour la comparaison
            const localLastModified = new Date(localStats.syncMetadata?.lastModifiedAt || localStats.lastUpdated || 0).getTime();
            const firebaseLastModified = new Date(firebaseData.syncMetadata?.lastModifiedAt || 0).getTime();

            // Si Firebase est plus récent, mettre à jour localStorage
            if (firebaseLastModified > localLastModified) {
                console.log("🔄 Firebase data is newer, updating localStorage");

                // Mettre à jour localStorage avec les données de Firebase
                // IMPORTANT: Convertir completedScenarios de ScenarioCompletion[] vers string[] pour localStorage
                const completedScenarioIds = firebaseData.completedScenarios
                    ? firebaseData.completedScenarios.map((scenario) => scenario.scenarioId)
                    : localStats.completedScenarios || [];

                const updatedLocalData = {
                    ...localStats,
                    stats: firebaseData.currentStats,
                    profile: firebaseData.currentProfile,
                    totalPlayedAdventures: firebaseData.totalScenarios || localStats.totalPlayedAdventures,
                    completedScenarios: completedScenarioIds, // ✅ Extraire les IDs depuis les objets Firebase
                    syncMetadata: firebaseData.syncMetadata, // ✅ Garder syncMetadata
                };

                localStorage.setItem("trekkie_global_stats", JSON.stringify(updatedLocalData));
                console.log("✅ Local data updated from Firebase - Synced", completedScenarioIds.length, "completed scenarios");

                // Déclencher un événement storage pour notifier les autres composants
                window.dispatchEvent(new StorageEvent('storage', {
                    key: 'trekkie_global_stats',
                    newValue: JSON.stringify(updatedLocalData),
                    url: window.location.href
                }));

                return true;
            } else {
                console.log("✅ Local data is up to date (local:", new Date(localLastModified).toISOString(), "vs firebase:", new Date(firebaseLastModified).toISOString(), ")");
                return false;
            }
        } catch (error) {
            console.error("Failed to sync from Firebase:", error);
            return false;
        }
    },

    /**
     * Auto-sync function to be called periodically.
     * Now performs bidirectional sync: checks for updates from Firebase first,
     * then syncs local changes to Firebase ONLY if Firebase wasn't updated.
     * @param uid - The user ID
     * @param profile - The player's current profile
     * @param pseudonym - Optional player pseudonym
     * @param forceSync - Force sync regardless of interval
     */
    async autoSync(uid: string, profile: Profile, pseudonym?: string, forceSync: boolean = false): Promise<void> {
        try {
            // D'abord, vérifier si Firebase a des modifications (admin)
            const wasUpdatedFromFirebase = await this.syncFromFirebase(uid);

            // Ne synchroniser vers Firebase QUE si on n'a PAS téléchargé depuis Firebase
            // (pour éviter de ré-écraser Firebase avec l'ancien profil en mémoire)
            if (!wasUpdatedFromFirebase && (forceSync || (await this.needsSync(uid)))) {
                await this.syncPlayerStats(uid, profile, pseudonym);
            } else if (wasUpdatedFromFirebase) {
                console.log("⏭️  Skipping upload to Firebase (just downloaded from Firebase)");
            }
        } catch (error) {
            console.error("Auto-sync failed:", error);
        }
    },
};
