/**
 * StatsManager
 * Singleton pour gérer les statistiques du joueur
 */

import type { PlayerStats, StatisticChanges } from "../types";
import { StatKeys } from "../types";

const STAT_MAX_DEFAULT = 10;
const STAT_MIN = 0;

export class StatsManager {
  private static instance: StatsManager;
  private stats: PlayerStats;

  private constructor() {
    this.stats = {
      [StatKeys.Character]: 0,
      [StatKeys.Skills]: 0,
      [StatKeys.Context]: 0,
      [StatKeys.Experience]: 0,
    };
  }

  public static getInstance(): StatsManager {
    if (!StatsManager.instance) {
      StatsManager.instance = new StatsManager();
    }
    return StatsManager.instance;
  }

  /**
   * Initialise les stats avec des valeurs
   */
  public initialize(stats: PlayerStats): void {
    this.stats = { ...stats };
  }

  /**
   * Récupère toutes les stats
   */
  public getStats(): PlayerStats {
    return { ...this.stats };
  }

  /**
   * Récupère une stat spécifique
   */
  public getStat(key: StatKeys): number {
    return this.stats[key] ?? 0;
  }

  /**
   * Applique des changements aux stats
   * Format: { "character": { type: "add", value: 2 }, "skills": { type: "sub", value: 1 } }
   */
  public applyChanges(changes: StatisticChanges): PlayerStats {
    const newStats = { ...this.stats };

    Object.keys(changes).forEach((key) => {
      const statKey = key as StatKeys;
      const statChange = changes[statKey];
      const maxValue = statKey === StatKeys.Experience ? Infinity : STAT_MAX_DEFAULT;

      switch (statChange.type) {
        case 'add':
          // Appliquer min ET max pour garantir [0, maxValue]
          newStats[statKey] = Math.max(STAT_MIN, Math.min((newStats[statKey] ?? 0) + statChange.value, maxValue));
          break;
        case 'sub':
          newStats[statKey] = Math.max((newStats[statKey] ?? 0) - statChange.value, STAT_MIN);
          break;
        case 'set':
          newStats[statKey] = Math.max(STAT_MIN, Math.min(statChange.value, maxValue));
          break;
      }
    });

    this.stats = newStats;
    return this.getStats();
  }

  /**
   * Réinitialise les stats
   */
  public reset(): void {
    this.stats = {
      [StatKeys.Character]: 0,
      [StatKeys.Skills]: 0,
      [StatKeys.Context]: 0,
      [StatKeys.Experience]: 0,
    };
  }

  /**
   * Clone les stats actuelles
   */
  public clone(): PlayerStats {
    return { ...this.stats };
  }
}
