import { useEffect, useRef } from "react";
import { syncService } from "~/services/syncService";
import type { Profile } from "~/models/game";

/**
 * Custom hook for automatically synchronizing player stats with Firebase.
 * Syncs player data at regular intervals and on mount.
 *
 * @param uid - The user's Firebase UID
 * @param profile - The player's current profile
 * @param pseudonym - The player's pseudonym (optional)
 * @param syncIntervalMinutes - Sync interval in minutes (default: 5)
 * @param enabled - Whether auto-sync is enabled (default: true)
 */
export const useAutoSync = (
    uid: string | null | undefined,
    profile: Profile | null | undefined,
    pseudonym?: string,
    syncIntervalMinutes: number = 5,
    enabled: boolean = true
) => {
    const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastSyncRef = useRef<string | null>(null);

    useEffect(() => {
        // Ne rien faire si désactivé ou si les données manquent
        if (!enabled || !uid || !profile) {
            return;
        }

        // Fonction de synchronisation
        const performSync = async (force: boolean = false) => {
            try {
                await syncService.autoSync(uid, profile, pseudonym, force);
                lastSyncRef.current = new Date().toISOString();
                console.log("✅ Stats synchronized successfully");
            } catch (error) {
                console.error("❌ Failed to sync stats:", error);
            }
        };

        // Synchroniser immédiatement au montage
        performSync(true);

        // Configurer la synchronisation périodique
        syncIntervalRef.current = setInterval(() => {
            performSync(false);
        }, syncIntervalMinutes * 60 * 1000);

        // Nettoyer l'intervalle au démontage
        return () => {
            if (syncIntervalRef.current) {
                clearInterval(syncIntervalRef.current);
                syncIntervalRef.current = null;
            }
        };
    }, [uid, profile, pseudonym, syncIntervalMinutes, enabled]);

    // Retourner une fonction pour forcer la synchronisation manuellement
    const forceSync = async () => {
        if (!uid || !profile) {
            console.warn("Cannot force sync: missing uid or profile");
            return;
        }

        try {
            await syncService.syncPlayerStats(uid, profile, pseudonym);
            lastSyncRef.current = new Date().toISOString();
            console.log("✅ Manual sync completed");
        } catch (error) {
            console.error("❌ Manual sync failed:", error);
            throw error;
        }
    };

    return {
        lastSync: lastSyncRef.current,
        forceSync,
    };
};
