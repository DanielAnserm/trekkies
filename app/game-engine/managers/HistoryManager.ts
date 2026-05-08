/**
 * HistoryManager
 * Singleton pour gérer l'historique des étapes du jeu
 */

import type { HistoryEntry } from "../types";

export class HistoryManager {
  private static instance: HistoryManager;
  private history: HistoryEntry[];

  private constructor() {
    this.history = [];
  }

  public static getInstance(): HistoryManager {
    if (!HistoryManager.instance) {
      HistoryManager.instance = new HistoryManager();
    }
    return HistoryManager.instance;
  }

  /**
   * Initialise l'historique avec des valeurs
   */
  public initialize(history: HistoryEntry[]): void {
    this.history = [...history];
  }

  /**
   * Ajoute une entrée à l'historique
   */
  public addEntry(entry: HistoryEntry): void {
    this.history.push(entry);
  }

  /**
   * Récupère tout l'historique
   */
  public getHistory(): HistoryEntry[] {
    return [...this.history];
  }

  /**
   * Récupère la dernière entrée
   */
  public getLastEntry(): HistoryEntry | undefined {
    return this.history[this.history.length - 1];
  }

  /**
   * Récupère le nombre d'entrées
   */
  public getLength(): number {
    return this.history.length;
  }

  /**
   * Réinitialise l'historique
   */
  public reset(): void {
    this.history = [];
  }

  /**
   * Clone l'historique actuel
   */
  public clone(): HistoryEntry[] {
    return [...this.history];
  }
}
