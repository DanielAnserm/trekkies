import type { Scenario } from "~/models/scenario";

const SCENARIO_API_PATH = import.meta.env.VITE_SCENARIO_API_PATH || "/api/scenarios.json";

export class ScenarioService {
    private static instance: ScenarioService;
    private cachedScenarios: Scenario[] | null = null;

    static getInstance(): ScenarioService {
        if (!ScenarioService.instance) {
            ScenarioService.instance = new ScenarioService();
        }
        return ScenarioService.instance;
    }
    async loadScenarios(): Promise<Scenario[]> {
        // Si déjà en cache, retourner le cache
        if (this.cachedScenarios) {
            return this.cachedScenarios;
        }

        try {
            if (import.meta.env.DEV) {
                const response = await fetch(SCENARIO_API_PATH, { cache: "no-cache" });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                this.cachedScenarios = data.scenarios as Scenario[];
                return this.cachedScenarios;
            }

            // TODO: Change endpoint with config
            const response = await fetch(SCENARIO_API_PATH, { cache: "no-cache" });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.cachedScenarios = data.scenarios as Scenario[];
            return this.cachedScenarios;
        } catch (error) {
            console.error("Failed to load scenarios:", error);
            throw new Error("Unable to load scenarios");

            try {
                // const scenarioJson = await import("~/scenarios.json");
                // this.cachedScenarios = scenarioJson.scenarios as Scenario[];
                // return this.cachedScenarios;
                return [];
            } catch (fallbackError) {
                console.error("Fallback failed:", fallbackError);
                throw new Error("Unable to load scenarios");
            }
        }
    }

    async getScenario(scenarioId: string): Promise<Scenario | null> {
        const scenarios = await this.loadScenarios();
        return scenarios.find((scenario) => scenario.id === scenarioId) || null;
    }

    clearCache(): void {
        this.cachedScenarios = null;
    }
}

export const scenarioService = ScenarioService.getInstance();
