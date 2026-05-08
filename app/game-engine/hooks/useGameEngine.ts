/**
 * useGameEngine
 * Hook React pour intégrer le GameEngine avec React
 */

import { useEffect, useState, useCallback } from "react";
import { GameEngine } from "../core/GameEngine";
import type {
  Scenario,
  Stage,
  Choice,
  PlayerStats,
  Profile,
  HistoryEntry,
  GameEngineEvent,
} from "../types";

export interface UseGameEngineResult {
  // État
  currentStage?: Stage;
  availableChoices: Choice[];
  stats: PlayerStats;
  profile: Profile;
  history: HistoryEntry[];
  isLoading: boolean;
  scenario?: Scenario;
  unlockedTrophies: string[];

  // Actions
  handleChoice: (choice: Choice) => Promise<void>;
  initialize: (scenario: Scenario, initialStats: PlayerStats, initialProfile: Profile) => Promise<void>;
  reset: () => Promise<void>;
}

/**
 * Hook pour utiliser le GameEngine dans un composant React
 */
export const useGameEngine = (): UseGameEngineResult => {
  const engine = GameEngine.getInstance();

  // États React synchronisés avec le GameEngine
  const [currentStage, setCurrentStage] = useState<Stage | undefined>(
    engine.getCurrentStage()
  );
  const [availableChoices, setAvailableChoices] = useState<Choice[]>(
    engine.getAvailableChoicesForCurrentStage()
  );
  const [stats, setStats] = useState<PlayerStats>(engine.getStats());
  const [profile, setProfile] = useState<Profile>(engine.getProfile());
  const [history, setHistory] = useState<HistoryEntry[]>(engine.getHistory());
  const [isLoading, setIsLoading] = useState<boolean>(engine.isLoading());
  const [scenario, setScenario] = useState<Scenario | undefined>(engine.getScenario());
  const [unlockedTrophies, setUnlockedTrophies] = useState<string[]>(
    engine.getUnlockedTrophies()
  );

  // Synchronise l'état React avec le GameEngine
  const syncState = useCallback(() => {
    setCurrentStage(engine.getCurrentStage());
    setAvailableChoices(engine.getAvailableChoicesForCurrentStage());
    setStats(engine.getStats());
    setProfile(engine.getProfile());
    setHistory(engine.getHistory());
    setIsLoading(engine.isLoading());
    setScenario(engine.getScenario());
    setUnlockedTrophies(engine.getUnlockedTrophies());
  }, [engine]);

  // Écoute les événements du GameEngine
  useEffect(() => {
    const listener = (event: GameEngineEvent) => {
      // Synchronise l'état React à chaque changement
      syncState();
    };

    engine.addEventListener(listener);

    // Cleanup
    return () => {
      engine.removeEventListener(listener);
    };
  }, [engine, syncState]);

  // Actions
  const handleChoice = useCallback(
    async (choice: Choice) => {
      await engine.handleChoice(choice);
    },
    [engine]
  );

  const initialize = useCallback(
    async (scenario: Scenario, initialStats: PlayerStats, initialProfile: Profile) => {
      await engine.initialize(scenario, initialStats, initialProfile);
      syncState();
    },
    [engine, syncState]
  );

  const reset = useCallback(async () => {
    await engine.reset();
    syncState();
  }, [engine, syncState]);

  return {
    currentStage,
    availableChoices,
    stats,
    profile,
    history,
    isLoading,
    scenario,
    unlockedTrophies,
    handleChoice,
    initialize,
    reset,
  };
};
