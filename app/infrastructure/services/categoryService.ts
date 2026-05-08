import type { Profile } from "~/models/game";
import type { CategoriesData, Category, CategoryScenario, Scenario } from "~/models/scenario";
import { checkConditionSafe } from "../utils/tokenizer";


const CATEGORIES_API_PATH = import.meta.env.VITE_CATEGORIES_API_PATH || "/api/categories";

export class CategoryService {
    private static instance: CategoryService;
    private cachedCategories: CategoriesData | null = null;

    static getInstance(): CategoryService {
        if (!CategoryService.instance) {
            CategoryService.instance = new CategoryService();
        }
        return CategoryService.instance;
    }

    async loadCategories(): Promise<CategoriesData> {
        if (this.cachedCategories) {
            return this.cachedCategories;
        }

        try {
            const response = await fetch(CATEGORIES_API_PATH, { cache: "no-cache" });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.cachedCategories = data;
            return this.cachedCategories as CategoriesData;
        } catch (error) {
            console.error("Failed to load categories:", error);
            throw new Error("Unable to load categories");
        }
    }

    async getCategory(categoryId: string): Promise<Category | null> {
        const categories = await this.loadCategories();
        return categories.categories[categoryId] || null;
    }

    filterScenariosByConditions(categoryScenarios: CategoryScenario[], profile: Profile): CategoryScenario[] {
        return categoryScenarios.filter((scenario) => {
            // Vérifier d'abord le profil si spécifié
            if (scenario.profileId && profile.profileId) {
                if (scenario.profileId !== profile.profileId) {
                    return false;
                }
            }

            // Puis vérifier la condition du scénario
            if (!scenario.condition || scenario.condition.trim() === "") {
                return true;
            }
            return checkConditionSafe(scenario.condition, profile);
        });
    }

    selectRandomScenario(eligibleScenarios: CategoryScenario[]): CategoryScenario | null {
        if (eligibleScenarios.length === 0) {
            return null;
        }

        const randomIndex = Math.floor(Math.random() * eligibleScenarios.length);
        return eligibleScenarios[randomIndex];
    }
    async checkPrerequisites(categoryId: string, profile: Profile): Promise<boolean> {
        const category = await this.getCategory(categoryId);

        if (!category || !category.prerequisites) {
            return true; // Pas de prérequis
        }

        const prereqs = category.prerequisites;

        // Vérifier les trophées requis
        if (prereqs.trophies && prereqs.trophies.length > 0) {
            const hasTrophies = prereqs.trophies.every((trophy) => profile.trophies?.includes(trophy));

            if (!hasTrophies) {
                return false;
            }
        }

        // Vérifier la condition sur les stats
        if (prereqs.condition && prereqs.condition.trim() !== "") {
            const meetsCondition = checkConditionSafe(prereqs.condition, profile);

            if (!meetsCondition) {
                return false;
            }
        }

        return true;
    }

    async getRandomScenarioFromCategory(
        categoryId: string,
        profile: Profile,
        completedScenarios: string[] = []
    ): Promise<CategoryScenario | null> {
        // Vérifier les prérequis
        const hasPrerequisites = await this.checkPrerequisites(categoryId, profile);

        if (!hasPrerequisites) {
            throw new Error("PREREQUISITES_NOT_MET");
        }

        const category = await this.getCategory(categoryId);

        if (!category) {
            console.warn(`Category "${categoryId}" not found`);
            return null;
        }

        let eligibleScenarios = this.filterScenariosByConditions(category.scenarios, profile);

        eligibleScenarios = eligibleScenarios.filter((scenario) => !completedScenarios.includes(scenario.key));

        if (eligibleScenarios.length === 0) {
            console.warn(`No eligible scenarios found in category "${categoryId}"`);
            return null;
        }

        return this.selectRandomScenario(eligibleScenarios);
    }

    /**
     * Détermine la catégorie actuelle du joueur basée sur ses trophées
     * Retourne la catégorie la plus avancée que le joueur peut jouer
     */
    async getCurrentCategory(profile: Profile): Promise<string> {
        const trophies = profile.trophies || [];

        // L'ordre des catégories de la plus avancée à la moins avancée
        // On retourne la première catégorie dont les prérequis sont remplis
        const categoryOrder = ["selection", "renforcement", "validation", "orientation"];

        for (const categoryId of categoryOrder) {
            const hasPrerequisites = await this.checkPrerequisites(categoryId, profile);
            if (hasPrerequisites) {
                return categoryId;
            }
        }

        // Par défaut, retourner "orientation" (première catégorie sans prérequis)
        return "orientation";
    }

    clearCache(): void {
        this.cachedCategories = null;
    }
}

export const categoryService = CategoryService.getInstance();
