/**
 * ProfileManager
 * Singleton pour gérer le profil du joueur (traits, intérêts, objectifs)
 */

import type { Profile, ProfileChanges } from "../types";

export class ProfileManager {
  private static instance: ProfileManager;
  private profile: Profile;

  private constructor() {
    this.profile = {
      traits: {},
      interests: [],
      goal: undefined,
      playerParameters: {},
      statistics: {
        character: 0,
        skills: 0,
        context: 0,
        experience: 0,
      },
      trophies: [],
    };
  }

  public static getInstance(): ProfileManager {
    if (!ProfileManager.instance) {
      ProfileManager.instance = new ProfileManager();
    }
    return ProfileManager.instance;
  }

  /**
   * Initialise le profil avec des valeurs
   */
  public initialize(profile: Profile): void {
    this.profile = { ...profile };
  }

  /**
   * Récupère le profil complet
   */
  public getProfile(): Profile {
    return { ...this.profile };
  }

  /**
   * Applique des changements de traits
   * Traits est un Record<string, string> (objet clé-valeur)
   * Format: { "key": { type: "add", value: "value" }, "key2": { type: "remove" } }
   */
  public applyTraitChanges(changes: ProfileChanges): Record<string, string> {
    const newTraits = { ...this.profile.traits };

    Object.keys(changes).forEach((key) => {
      const traitChange = changes[key];
      switch (traitChange.type) {
        case 'add':
          newTraits[key] = traitChange.value;
          break;
        case 'remove':
          delete newTraits[key];
          break;
      }
    });

    this.profile.traits = newTraits;
    return { ...newTraits };
  }

  /**
   * Applique des changements d'intérêts
   * Format: { "coding": { type: "add" }, "music": { type: "remove" } }
   */
  public applyInterestChanges(changes: ProfileChanges): string[] {
    const newInterests = [...this.profile.interests];

    Object.keys(changes).forEach((key) => {
      const interestChange = changes[key];
      switch (interestChange.type) {
        case 'add':
          if (!newInterests.includes(key)) {
            newInterests.push(key);
          }
          break;
        case 'remove':
          const index = newInterests.indexOf(key);
          if (index > -1) {
            newInterests.splice(index, 1);
          }
          break;
      }
    });

    this.profile.interests = newInterests;
    return [...newInterests];
  }

  /**
   * Applique des changements d'objectif
   * Goal est une string (singulier), pas un tableau
   * Format: { "engineer": { type: "add" }, "scientist": { type: "remove" } }
   */
  public applyGoalChanges(changes: ProfileChanges): string | undefined {
    let newGoal = this.profile.goal;

    Object.keys(changes).forEach((key) => {
      const goalChange = changes[key];
      switch (goalChange.type) {
        case 'add':
          newGoal = key;
          break;
        case 'remove':
          newGoal = undefined;
          break;
      }
    });

    this.profile.goal = newGoal;
    return newGoal;
  }

  /**
   * Applique des changements de paramètres joueur
   * Format: { "key": { type: "add|set|remove", value: ... } }
   */
  public applyPlayerParameterChanges(changes: Record<string, { type: string; value: any }>): Record<string, string | number | boolean> {
    const newParams = { ...this.profile.playerParameters };

    Object.entries(changes).forEach(([key, change]) => {
      switch (change.type) {
        case 'add':
          if (typeof change.value === 'number' && typeof newParams[key] === 'number') {
            // Si c'est un nombre et qu'il existe déjà, on additionne
            newParams[key] = (newParams[key] as number) + change.value;
          } else {
            // Sinon on définit directement
            newParams[key] = change.value;
          }
          break;
        case 'set':
          newParams[key] = change.value;
          break;
        case 'remove':
          delete newParams[key];
          break;
      }
    });

    this.profile.playerParameters = newParams;
    return { ...newParams };
  }

  /**
   * Récupère les traits
   */
  public getTraits(): Record<string, string> {
    return { ...this.profile.traits };
  }

  /**
   * Récupère les intérêts
   */
  public getInterests(): string[] {
    return [...this.profile.interests];
  }

  /**
   * Récupère l'objectif
   */
  public getGoal(): string | undefined {
    return this.profile.goal;
  }

  /**
   * Récupère les paramètres joueur
   */
  public getPlayerParameters(): Record<string, string | number | boolean> {
    return { ...this.profile.playerParameters };
  }

  /**
   * Ajoute des trophées au profil
   */
  public addTrophies(trophies: string[]): string[] {
    const trophySet = new Set([...this.profile.trophies, ...trophies]);
    this.profile.trophies = [...trophySet];
    return [...this.profile.trophies];
  }

  /**
   * Récupère les trophées
   */
  public getTrophies(): string[] {
    return [...this.profile.trophies];
  }

  /**
   * Marque le jeu comme complété
   */
  public setGameCompleted(completed: boolean): void {
    this.profile.isGameCompleted = completed;
  }

  /**
   * Vérifie si le jeu est complété
   */
  public isGameCompleted(): boolean | undefined {
    return this.profile.isGameCompleted;
  }

  /**
   * Réinitialise le profil
   */
  public reset(): void {
    this.profile = {
      traits: {},
      interests: [],
      goal: undefined,
      playerParameters: {},
      statistics: {
        character: 0,
        skills: 0,
        context: 0,
        experience: 0,
      },
      trophies: [],
    };
  }

  /**
   * Clone le profil actuel
   */
  public clone(): Profile {
    return {
      traits: { ...this.profile.traits },
      interests: [...this.profile.interests],
      goal: this.profile.goal,
      playerParameters: { ...this.profile.playerParameters },
      statistics: { ...this.profile.statistics },
      trophies: [...this.profile.trophies],
    };
  }
}
