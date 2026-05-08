/**
 * GameEngine
 * Singleton principal qui orchestre toute la logique du jeu
 * Séparé de React pour une meilleure architecture
 */

import type {
  Scenario,
  Stage,
  Choice,
  PlayerStats,
  Profile,
  HistoryEntry,
  GameEngineListener,
  GameEngineEvent,
} from "../types";
import type { GameState } from "./GameState";
import { StatsManager } from "../managers/StatsManager";
import { ProfileManager } from "../managers/ProfileManager";
import { HistoryManager } from "../managers/HistoryManager";
import { SaveManager } from "../managers/SaveManager";
import { ConditionEvaluator } from "../processors/ConditionEvaluator";
import { ChoiceProcessor, type ComputedChanges } from "../processors/ChoiceProcessor";
import { createInitialGameState } from "./GameState";

export class GameEngine {
  private static instance: GameEngine;

  // Managers
  private statsManager: StatsManager;
  private profileManager: ProfileManager;
  private historyManager: HistoryManager;
  private saveManager: SaveManager;

  // Processors
  private conditionEvaluator: ConditionEvaluator;
  private choiceProcessor: ChoiceProcessor;

  // État du jeu
  private state: GameState;

  // Listeners pour les événements
  private listeners: GameEngineListener[] = [];

  private constructor() {
    this.statsManager = StatsManager.getInstance();
    this.profileManager = ProfileManager.getInstance();
    this.historyManager = HistoryManager.getInstance();
    this.saveManager = SaveManager.getInstance();
    this.conditionEvaluator = ConditionEvaluator.getInstance();
    this.choiceProcessor = ChoiceProcessor.getInstance();
    this.state = createInitialGameState();
  }

  public static getInstance(): GameEngine {
    if (!GameEngine.instance) {
      GameEngine.instance = new GameEngine();
    }
    return GameEngine.instance;
  }

  /**
   * Initialise le jeu avec un scénario
   */
  public async initialize(
    scenario: Scenario,
    initialStats: PlayerStats,
    initialProfile: Profile
  ): Promise<void> {
    this.state.scenario = scenario;
    this.state.scenarioId = scenario.id;

    // Initialise les managers
    this.statsManager.initialize(initialStats);
    this.profileManager.initialize(initialProfile);
    this.historyManager.reset();

    // Tente de charger une sauvegarde
    const saveData = await this.saveManager.load();
    if (saveData && saveData.scenarioId === scenario.id) {
      this.loadFromSave(saveData);
    } else {
      // Nouveau jeu
      this.state.currentStageId = "start";
      this.state.profileAtStart = this.profileManager.clone();

      // Sauvegarder immédiatement pour marquer le scénario comme "en cours"
      // Cela permet à hasOngoingScenario() de retourner true dès le début
      await this.autoSave();
    }

    // Charge le stage actuel
    this.loadCurrentStage();
    this.emitEvent({ type: "stateChanged" });
  }

  /**
   * Charge l'état depuis une sauvegarde
   */
  private loadFromSave(saveData: any): void {
    this.state.currentStageId = saveData.currentScenario;
    // Utiliser profile.statistics (avec fallback sur stats pour anciennes sauvegardes)
    this.statsManager.initialize(saveData.profile.statistics ?? saveData.stats);
    this.profileManager.initialize(saveData.profile);
    this.historyManager.initialize(saveData.history || []);
    this.state.profileAtStart = saveData.profileAtStart;
  }

  /**
   * Charge le stage actuel depuis le scénario
   */
  private loadCurrentStage(): void {
    if (!this.state.scenario) {
      return;
    }

    const stage = this.state.scenario.stages[this.state.currentStageId];
    if (!stage) {
      console.error(`Stage ${this.state.currentStageId} not found`);
      return;
    }

    this.state.currentStage = stage;
    this.state.availableChoices = this.getAvailableChoices(stage);
    this.emitEvent({ type: "stageChanged", data: stage });
  }

  /**
   * Récupère les choix disponibles selon les conditions
   */
  private getAvailableChoices(stage: Stage): Choice[] {
    // Utiliser getProfile() pour avoir les stats synchronisées
    const profile = this.getProfile();

    return stage.choices.filter((choice) =>
      this.conditionEvaluator.isChoiceAvailable(choice.condition, profile)
    );
  }

  /**
   * Traite un choix du joueur
   */
  public async handleChoice(choice: Choice): Promise<void> {
    if (!this.state.currentStage || !this.state.scenario) {
      return;
    }

    this.state.isLoading = true;
    this.emitEvent({ type: "stateChanged" });

    try {
      // Enregistrer les stats AVANT d'appliquer les changements
      const statsBeforeChange = this.statsManager.getStats();

      // Applique les changements du choix
      const choiceResult = this.choiceProcessor.applyChanges(choice.changes);

      // Ajoute à l'historique avec les stats au moment du choix
      this.historyManager.addEntry({
        scenario: this.state.currentStageId,
        choice: choice.text,
        statsAtTime: statsBeforeChange,
      });

      // Passe au stage suivant
      if (choice.next) {
        this.state.currentStageId = choice.next;
        this.loadCurrentStage();

        // Applique les changements du nouveau stage
        if (this.state.currentStage?.changes) {
          const stageResult = this.choiceProcessor.applyChanges(this.state.currentStage.changes);

          // Recalculer les choix disponibles après avoir appliqué les changements du stage
          // Sinon les conditions des choix utilisent les anciennes stats
          this.state.availableChoices = this.getAvailableChoices(this.state.currentStage);
        }
      }

      // Sauvegarde automatique (sauf au démarrage et aux stages de fin)
      if (this.state.currentStageId !== "start" &&
          choice.next !== "end" &&
          choice.next !== "postulation_badge") {
        await this.autoSave();
      }

      // Émet les événements
      this.emitEvent({ type: "choiceMade", data: choice });
      this.emitEvent({ type: "statsChanged" });
      this.emitEvent({ type: "profileChanged" });
    } finally {
      this.state.isLoading = false;
      this.emitEvent({ type: "stateChanged" });
    }
  }

  /**
   * Sauvegarde automatique
   */
  private async autoSave(): Promise<void> {
    if (!this.state.scenario) {
      return;
    }

    // Synchroniser les stats dans le profile
    const profile = this.profileManager.getProfile();
    profile.statistics = this.statsManager.getStats();

    await this.saveManager.save(
      this.state.scenarioId,
      this.state.currentStageId,
      profile,
      this.historyManager.getHistory(),
      this.state.profileAtStart
    );
  }

  /**
   * Récupère l'état actuel du jeu
   */
  public getState(): GameState {
    return { ...this.state };
  }

  /**
   * Récupère les stats actuelles
   */
  public getStats(): PlayerStats {
    return this.statsManager.getStats();
  }

  /**
   * Récupère le profil actuel avec les stats synchronisées
   */
  public getProfile(): Profile {
    const profile = this.profileManager.getProfile();
    // Toujours synchroniser les stats depuis StatsManager
    profile.statistics = this.statsManager.getStats();
    return profile;
  }

  /**
   * Récupère l'historique
   */
  public getHistory(): HistoryEntry[] {
    return this.historyManager.getHistory();
  }

  /**
   * Récupère le scénario actuel
   */
  public getScenario(): Scenario | undefined {
    return this.state.scenario;
  }

  /**
   * Récupère le stage actuel
   */
  public getCurrentStage(): Stage | undefined {
    return this.state.currentStage;
  }

  /**
   * Récupère les choix disponibles
   */
  public getAvailableChoicesForCurrentStage(): Choice[] {
    return [...this.state.availableChoices];
  }

  /**
   * Récupère les trophées débloqués
   */
  public getUnlockedTrophies(): string[] {
    return this.profileManager.getTrophies();
  }

  /**
   * Vérifie si le jeu est en chargement
   */
  public isLoading(): boolean {
    return this.state.isLoading;
  }

  /**
   * Ajoute un listener pour les événements du jeu
   */
  public addEventListener(listener: GameEngineListener): void {
    this.listeners.push(listener);
  }

  /**
   * Retire un listener
   */
  public removeEventListener(listener: GameEngineListener): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Émet un événement à tous les listeners
   */
  private emitEvent(event: GameEngineEvent): void {
    this.listeners.forEach((listener) => listener(event));
  }

  /**
   * Réinitialise complètement le jeu
   */
  public async reset(): Promise<void> {
    this.statsManager.reset();
    this.profileManager.reset();
    this.historyManager.reset();
    await this.saveManager.clear();
    this.state = createInitialGameState();
    this.listeners = [];
    this.emitEvent({ type: "stateChanged" });
  }

  /**
   * Calcule les changements d'un choix sans les appliquer (preview)
   */
  public previewChoiceChanges(choice: Choice): ComputedChanges {
    return this.choiceProcessor.computeChanges(choice.changes);
  }

  /**
   * Calcule l'état final après un choix sans l'appliquer au state
   * Utilisé pour les stages de fin (end/postulation_badge)
   */
  public computeFinalState(choice: Choice): {
    profile: Profile;
    history: HistoryEntry[];
  } {
    // Sauvegarder l'état actuel
    const savedStats = this.statsManager.getStats();
    const savedProfile = this.profileManager.getProfile();
    const savedHistory = this.historyManager.getHistory();

    // Appliquer temporairement les changements pour les calculer
    const choiceChanges = this.choiceProcessor.applyChanges(choice.changes);

    // Récupérer le state après application
    const finalStats = this.statsManager.getStats();
    const finalProfile = this.profileManager.getProfile();

    // Restaurer l'état original
    this.statsManager.initialize(savedStats);
    this.profileManager.initialize(savedProfile);

    return {
      profile: {
        ...finalProfile,
        statistics: finalStats,
      },
      history: savedHistory,
    };
  }

  /**
   * Efface la sauvegarde du jeu (appelé à la fin du jeu)
   */
  public async clearSave(): Promise<void> {
    await this.saveManager.clear();
  }
}
