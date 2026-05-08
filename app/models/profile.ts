import type { PlayerStats } from "./game";

export interface TraitConfig {
  name: string;
  description: string;
  conditions: {
    minStats?: Partial<PlayerStats>;
    maxStats?: Partial<PlayerStats>;
    totalMinimum?: number;
    totalMaximum?: number;
  };
  weight?: number; // Priorité du trait (plus élevé = plus prioritaire)
}

export interface InterestConfig {
  name: string;
  conditions: {
    minStats?: Partial<PlayerStats>;
    maxStats?: Partial<PlayerStats>;
    dominantStat?: keyof PlayerStats;
    balancedStats?: boolean;
  };
  weight?: number;
}

export interface GoalConfig {
  name: string;
  conditions: {
    minStats?: Partial<PlayerStats>;
    maxStats?: Partial<PlayerStats>;
    dominantStat?: keyof PlayerStats;
    balancedStats?: boolean;
  };
  weight?: number;
}


export interface ProfileConfig {
  id: string;
  name: string;
  weight: number;
  initialStats: PlayerStats;
  randomDistribution: {
    remaining: number;
    stats: Array<keyof PlayerStats>;
  };
  description: {
    title: string;
    content: string;
    continueButton: string;
  };
}

export interface ProfilesData {
  profiles: ProfileConfig[];
}