/**
 * Game Engine
 * Architecture singleton pour séparer la logique du jeu de React
 *
 * @example
 * ```typescript
 * import { GameEngine } from "~/game-engine";
 *
 * const engine = GameEngine.getInstance();
 * engine.initialize(scenario, initialStats, initialProfile);
 *
 * // Écouter les événements
 * engine.addEventListener((event) => {
 *   console.log('Game event:', event);
 * });
 *
 * // Gérer un choix
 * await engine.handleChoice(choice);
 *
 * // Récupérer l'état
 * const stats = engine.getStats();
 * const profile = engine.getProfile();
 * ```
 */

// Core
export { GameEngine } from "./core/GameEngine";
export type { GameState } from "./core/GameState";

// Managers
export { StatsManager } from "./managers/StatsManager";
export { ProfileManager } from "./managers/ProfileManager";
export { HistoryManager } from "./managers/HistoryManager";
export { SaveManager } from "./managers/SaveManager";

// Processors
export { ConditionEvaluator } from "./processors/ConditionEvaluator";
export { ChoiceProcessor } from "./processors/ChoiceProcessor";
export type { ComputedChanges } from "./processors/ChoiceProcessor";

// Types
export type {
  AppState,
  SaveData,
  PlayerStats,
  HistoryEntry,
  Profile,
  Scenario,
  Stage,
  Choice,
  GameEngineEvent,
  GameEngineListener,
} from "./types";
