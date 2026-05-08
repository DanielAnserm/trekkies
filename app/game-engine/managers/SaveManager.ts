/**
 * SaveManager
 * Singleton pour gérer la sauvegarde et le chargement du jeu
 * Utilise LocalStorageSaveManager existant
 */

import type { SaveData, Profile, HistoryEntry } from "../types";
import { LocalStorageSaveManager } from "~/infrastructure/utils/save/LocalStorageSaveManager";

export class SaveManager {
  private static instance: SaveManager;
  private localStorageManager: LocalStorageSaveManager;

  private constructor() {
    this.localStorageManager = new LocalStorageSaveManager();
  }

  public static getInstance(): SaveManager {
    if (!SaveManager.instance) {
      SaveManager.instance = new SaveManager();
    }
    return SaveManager.instance;
  }

  /**
   * Sauvegarde l'état du jeu
   */
  public async save(
    scenarioId: string,
    currentStage: string,
    profile: Profile,
    history: HistoryEntry[],
    profileAtStart?: Profile
  ): Promise<void> {
    const saveData: SaveData = {
      currentScenario: currentStage,
      scenarioId,
      profile, // Contient déjà statistics
      history,
      timestamp: Date.now(),
      version: "1.0",
      profileAtStart,
    };

    await this.localStorageManager.save(saveData);
  }

  /**
   * Charge l'état du jeu sauvegardé
   */
  public async load(): Promise<SaveData | null> {
    return await this.localStorageManager.load();
  }

  /**
   * Efface la sauvegarde
   */
  public async clear(): Promise<void> {
    await this.localStorageManager.delete();
  }

  /**
   * Vérifie si une sauvegarde existe
   */
  public async hasSave(): Promise<boolean> {
    return await this.localStorageManager.exists();
  }
}
