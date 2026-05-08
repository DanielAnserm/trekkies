import { useEffect, useState } from "react";
import { useAuthContext } from "~/infrastructure/context/AuthContext";
import { usePseudoContext } from "~/infrastructure/context/PseudoContext";
import { useAutoSync } from "~/infrastructure/hooks/useAutoSync";
import { GlobalStatsManager } from "~/infrastructure/utils/stats/GlobalStatsManager";
import type { Profile } from "~/models/game";

/**
 * AutoSyncWrapper
 *
 * Composant invisible qui gère la synchronisation automatique des stats du joueur.
 * Il charge le profil de jeu actuel et utilise useAutoSync pour synchroniser
 * avec Firebase toutes les minutes.
 */
export const AutoSyncWrapper = () => {
    const { user } = useAuthContext();
    const { userProfile } = usePseudoContext();
    const [gameProfile, setGameProfile] = useState<Profile | null>(null);

    // Charger le profil de jeu depuis localStorage et le rafraîchir régulièrement
    useEffect(() => {
        const loadGameProfile = async () => {
            try {
                const globalStatsManager = new GlobalStatsManager();
                const playerProgress = await globalStatsManager.getPlayerProgress();

                if (playerProgress?.profile) {
                    setGameProfile(playerProgress.profile);
                }
            } catch (error) {
                console.error("Failed to load game profile for sync:", error);
            }
        };

        if (user) {
            // Charger au montage
            loadGameProfile();

            // Rafraîchir toutes les 30 secondes pour capturer les changements
            const interval = setInterval(loadGameProfile, 30000);

            return () => clearInterval(interval);
        }
    }, [user]);

    // Activer la synchronisation automatique
    useAutoSync(
        user?.uid,
        gameProfile,
        userProfile?.pseudonym,
        1, // Sync toutes les minutes
        true // Activé
    );

    // Ce composant n'affiche rien
    return null;
};
