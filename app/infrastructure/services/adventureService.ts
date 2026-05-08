import type { Profile, SaveData } from "~/models/game";
import type { Scenario } from "~/models/scenario";
import { categoryService } from "./categoryService";
import { scenarioService } from "./scenarioService";

export class AdventureService {
    private static instance: AdventureService;

    static getInstance(): AdventureService {
        if (!AdventureService.instance) {
            AdventureService.instance = new AdventureService();
        }
        return AdventureService.instance;
    }

    /**
     * Récupère un scénario depuis l'URL via une catégorie
     * Format: ?category=category_id
     */
    async getScenarioFromUrl(searchParams: URLSearchParams, profile: Profile, completedScenarios: string[] = []): Promise<Scenario | null> {
        const categoryId = searchParams.get("category");
        const scenarioId = searchParams.get("scenario");
        if (scenarioId) {
            const scenario = await scenarioService.getScenario(scenarioId);
            if (!scenario) {
                console.error(`Scenario "${scenarioId}" not found`);
            }
            return scenario;
        }
        if (!categoryId) {
            console.warn("No category ID found in URL parameters");
            return null;
        }

        return await this.getScenarioFromCategory(categoryId, profile, completedScenarios);
    }

    /**
     * Récupère un scénario aléatoire d'une catégorie
     */
    async getScenarioFromCategory(categoryId: string, profile: Profile, completedScenarios: string[] = []): Promise<Scenario | null> {
        try {
            const selectedScenario = await categoryService.getRandomScenarioFromCategory(
                categoryId,
                profile,
                completedScenarios
            );

            if (!selectedScenario) {
                console.warn(`No eligible scenario found for category "${categoryId}"`);
                return null;
            }

            const scenario = await scenarioService.getScenario(selectedScenario.key);
            
            if (!scenario) {
                console.error(`Scenario "${selectedScenario.key}" not found`);
                return null;
            }

            return scenario;
        } catch (error) {
            console.error(`Error getting scenario from category "${categoryId}":`, error);
            return null;
        }
    }

    getCurrentScenarioId(): string | null {
        try {
            const saveData = localStorage.getItem("trekkie_game_save");
            if (!saveData) return null;

            const parsed = JSON.parse(saveData) as SaveData;
            return parsed.scenarioId || null;
        } catch {
            return null;
        }
    }

    hasActiveGameForDifferentScenario(newScenarioId: string): boolean {
        const currentScenarioId = this.getCurrentScenarioId();
        const hasGameSave = localStorage.getItem("trekkie_game_save");

        return !!(hasGameSave && currentScenarioId && currentScenarioId !== newScenarioId);
    }

    async clearCurrentGame(): Promise<void> {
        localStorage.removeItem("trekkie_game_save");
        localStorage.removeItem("trekkie_current_view");
    }

    async loadCurrentGame(): Promise<SaveData | null> {
        const saveData = localStorage.getItem("trekkie_game_save");
        if (!saveData) return null;
        return JSON.parse(saveData);
    }

    async hasOngoingScenario(): Promise<boolean> {
        const saveData = localStorage.getItem("trekkie_game_save");
        return !!saveData;
    }
}

export const adventureService = AdventureService.getInstance();