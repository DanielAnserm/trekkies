/**
 * Game Engine Types
 * Réexporte les types du modèle pour le game engine
 */

export type {
  AppState,
  SaveData,
  PlayerStats,
  HistoryEntry,
  Profile,
  ProfileChanges,
  StatisticChanges,
  ChoiceChanges,
  PlayerParameterChanges,
} from "~/models/game";

export type {
  Scenario,
  Stage,
  Choice,
} from "~/models/scenario";

export { StatKeys } from "~/models/game";

/**
 * Game Engine Events
 */
export interface GameEngineEvent {
  type: 'stateChanged' | 'statsChanged' | 'profileChanged' | 'choiceMade' | 'stageChanged' | 'gameCompleted';
  data?: unknown;
}

export type GameEngineListener = (event: GameEngineEvent) => void;
