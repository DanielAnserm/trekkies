/**
 * GameState
 * Représente l'état actuel du jeu
 */

import type { Scenario, Stage, Choice, Profile } from "../types";

export interface GameState {
  scenarioId: string;
  currentStageId: string;
  scenario?: Scenario;
  currentStage?: Stage;
  availableChoices: Choice[];
  isLoading: boolean;
  profileAtStart?: Profile;
}

export const createInitialGameState = (): GameState => ({
  scenarioId: "",
  currentStageId: "start",
  scenario: undefined,
  currentStage: undefined,
  availableChoices: [],
  isLoading: false,
  profileAtStart: undefined,
});
