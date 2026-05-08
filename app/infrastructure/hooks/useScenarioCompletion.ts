import { useCallback } from "react";
import type { HistoryEntry, PlayerStats, Profile } from "~/models/game";
import type { Scenario } from "~/models/scenario";
import { statsService, type ScenarioCompletion } from "~/services/statsService";
import { GlobalStatsManager } from "../utils/stats/GlobalStatsManager";
import { useAuthContext } from "../context/AuthContext";

export const useScenarioCompletion = () => {
    const { user } = useAuthContext();
    const globalStatsManager = new GlobalStatsManager();

    const completeScenario = useCallback(
        async (scenario: Scenario, finalProfile: Profile, gameHistory: HistoryEntry[], startTime: number) => {
            if (!user) {
                console.warn("No user found, skipping Firebase sync");
                return;
            }

            try {
                // Calculer le temps de completion
                const completionTime = Date.now() - startTime;

                // Extraire les informations de l'historique
                const choices = gameHistory.map((entry) => entry.choice);
                const scenarioPath = gameHistory.map((entry) => entry.scenario);

                // Créer l'objet de completion
                const scenarioCompletion: Omit<ScenarioCompletion, "completedAt"> = {
                    scenarioId: scenario.id,
                    scenarioTitle: scenario.title,
                    finalProfile,
                    choices,
                    completionTime,
                    scenarioPath,
                };

                // Enregistrer dans Firebase
                await statsService.recordScenarioCompletion(user.uid, scenarioCompletion);

                // Mettre à jour les stats globales locales
                await globalStatsManager.saveGlobalStats(finalProfile.statistics, finalProfile, scenario.id, true);

                console.log("Scenario completion saved successfully");

                // Retourner des informations utiles
                return {
                    success: true,
                    completionTime,
                    totalChoices: choices.length,
                };
            } catch (error) {
                console.error("Failed to complete scenario:", error);

                // Fallback : sauvegarder au moins localement
                try {
                    await globalStatsManager.saveGlobalStats(finalProfile.statistics, finalProfile, scenario.id, true);
                    console.log("Scenario completion saved locally as fallback");
                    return {
                        success: false,
                        error: error as Error,
                        savedLocally: true,
                    };
                } catch (localError) {
                    console.error("Failed to save locally:", localError);
                    return {
                        success: false,
                        error: error as Error,
                        savedLocally: false,
                    };
                }
            }
        },
        [user, globalStatsManager]
    );

    const getPlayerStats = useCallback(async () => {
        if (!user) return null;

        try {
            return await statsService.getPlayerStats(user.uid);
        } catch (error) {
            console.error("Failed to get player stats:", error);
            return null;
        }
    }, [user]);

    const syncStatsWithFirebase = useCallback(
        async (profile: Profile) => {
            if (!user) return;

            try {
                await statsService.savePlayerStats(user.uid, profile);
                console.log("Stats synced with Firebase");
            } catch (error) {
                console.error("Failed to sync stats:", error);
            }
        },
        [user]
    );

    return {
        completeScenario,
        getPlayerStats,
        syncStatsWithFirebase,
        isUserAuthenticated: !!user,
        userId: user?.uid,
    };
};
