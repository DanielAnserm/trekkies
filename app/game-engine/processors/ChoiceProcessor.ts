/**
 * ChoiceProcessor
 * Traite les choix du joueur et applique les changements
 */

import type { ChoiceChanges, PlayerStats, Profile } from "../types";
import { StatsManager } from "../managers/StatsManager";
import { ProfileManager } from "../managers/ProfileManager";

export interface ComputedChanges {
  stats?: PlayerStats;
  traits?: Record<string, string>;
  interests?: string[];
  goal?: string;
  playerParameters?: Record<string, string | number | boolean>;
  unlockTrophies?: string[];
  gameCompleted?: boolean;
}

export class ChoiceProcessor {
  private static instance: ChoiceProcessor;
  private statsManager: StatsManager;
  private profileManager: ProfileManager;

  private constructor() {
    this.statsManager = StatsManager.getInstance();
    this.profileManager = ProfileManager.getInstance();
  }

  public static getInstance(): ChoiceProcessor {
    if (!ChoiceProcessor.instance) {
      ChoiceProcessor.instance = new ChoiceProcessor();
    }
    return ChoiceProcessor.instance;
  }

  /**
   * Calcule les changements sans les appliquer
   * Utile pour prévisualiser les effets d'un choix
   */
  public computeChanges(changes?: ChoiceChanges): ComputedChanges {
    if (!changes) {
      return {};
    }

    const computed: ComputedChanges = {};

    // Stats
    if (changes.stats) {
      const currentStats = this.statsManager.getStats();
      const tempStatsManager = StatsManager.getInstance();
      tempStatsManager.initialize(currentStats);
      computed.stats = tempStatsManager.applyChanges(changes.stats);
    }

    // Traits
    if (changes.traits) {
      const currentProfile = this.profileManager.getProfile();
      const tempProfileManager = ProfileManager.getInstance();
      tempProfileManager.initialize(currentProfile);
      computed.traits = tempProfileManager.applyTraitChanges(changes.traits);
    }

    // Interests
    if (changes.interests) {
      const currentProfile = this.profileManager.getProfile();
      const tempProfileManager = ProfileManager.getInstance();
      tempProfileManager.initialize(currentProfile);
      computed.interests = tempProfileManager.applyInterestChanges(changes.interests);
    }

    // Goals
    if (changes.goals) {
      const currentProfile = this.profileManager.getProfile();
      const tempProfileManager = ProfileManager.getInstance();
      tempProfileManager.initialize(currentProfile);
      computed.goal = tempProfileManager.applyGoalChanges(changes.goals);
    }

    // Player Parameters
    if (changes.playerParameters) {
      const currentProfile = this.profileManager.getProfile();
      const tempProfileManager = ProfileManager.getInstance();
      tempProfileManager.initialize(currentProfile);
      computed.playerParameters = tempProfileManager.applyPlayerParameterChanges(
        changes.playerParameters
      );
    }

    // Trophies
    if (changes.unlockTrophies) {
      const currentProfile = this.profileManager.getProfile();
      const currentTrophies = currentProfile.trophies || [];
      const trophySet = new Set([...currentTrophies, ...changes.unlockTrophies]);
      computed.unlockTrophies = [...trophySet];
    }

    // Game Completed
    if (changes.gameCompleted !== undefined) {
      computed.gameCompleted = changes.gameCompleted;
    }

    return computed;
  }

  /**
   * Applique les changements calculés
   */
  public applyChanges(changes?: ChoiceChanges): ComputedChanges {
    if (!changes) {
      return {};
    }

    const computed: ComputedChanges = {};

    // Stats
    if (changes.stats) {
      computed.stats = this.statsManager.applyChanges(changes.stats);
    }

    // Traits
    if (changes.traits) {
      computed.traits = this.profileManager.applyTraitChanges(changes.traits);
    }

    // Interests
    if (changes.interests) {
      computed.interests = this.profileManager.applyInterestChanges(changes.interests);
    }

    // Goals
    if (changes.goals) {
      computed.goal = this.profileManager.applyGoalChanges(changes.goals);
    }

    // Player Parameters
    if (changes.playerParameters) {
      computed.playerParameters = this.profileManager.applyPlayerParameterChanges(
        changes.playerParameters
      );
    }

    // Trophies - applique au ProfileManager
    if (changes.unlockTrophies) {
      computed.unlockTrophies = this.profileManager.addTrophies(changes.unlockTrophies);
    }

    // Game Completed - applique au ProfileManager
    if (changes.gameCompleted !== undefined) {
      this.profileManager.setGameCompleted(changes.gameCompleted);
      computed.gameCompleted = changes.gameCompleted;
    }

    return computed;
  }

  /**
   * Applique les changements d'un choix et d'un stage
   */
  public applyChoiceAndStageChanges(
    choiceChanges?: ChoiceChanges,
    stageChanges?: ChoiceChanges
  ): ComputedChanges {
    const choiceResult = this.applyChanges(choiceChanges);
    const stageResult = this.applyChanges(stageChanges);

    // Merge les résultats
    return {
      stats: stageResult.stats || choiceResult.stats,
      traits: stageResult.traits || choiceResult.traits,
      interests: stageResult.interests || choiceResult.interests,
      goal: stageResult.goal || choiceResult.goal,
      playerParameters: stageResult.playerParameters || choiceResult.playerParameters,
      unlockTrophies: [
        ...(choiceResult.unlockTrophies || []),
        ...(stageResult.unlockTrophies || []),
      ],
      gameCompleted: stageResult.gameCompleted ?? choiceResult.gameCompleted,
    };
  }
}
