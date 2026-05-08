/**
 * ConditionEvaluator
 * Singleton pour évaluer les conditions des choix et scénarios
 * Utilise le tokenizer existant
 */

import { checkConditionSafe } from "~/infrastructure/utils/tokenizer/tokenizer";
import type { Profile } from "../types";

export class ConditionEvaluator {
  private static instance: ConditionEvaluator;

  private constructor() {}

  public static getInstance(): ConditionEvaluator {
    if (!ConditionEvaluator.instance) {
      ConditionEvaluator.instance = new ConditionEvaluator();
    }
    return ConditionEvaluator.instance;
  }

  /**
   * Évalue une condition avec le profil du joueur
   * Le profil contient statistics, playerParameters, etc.
   */
  public evaluate(
    condition: string | undefined,
    profile: Profile
  ): boolean {
    if (!condition) {
      return true;
    }

    return checkConditionSafe(condition, profile);
  }

  /**
   * Vérifie si un choix est disponible
   */
  public isChoiceAvailable(
    choiceCondition: string | undefined,
    profile: Profile
  ): boolean {
    return this.evaluate(choiceCondition, profile);
  }

  /**
   * Vérifie si un scénario est accessible
   */
  public isScenarioAccessible(
    scenarioCondition: string | undefined,
    profile: Profile
  ): boolean {
    return this.evaluate(scenarioCondition, profile);
  }
}
