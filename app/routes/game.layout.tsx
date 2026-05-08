import type { Route } from "./+types/game.layout";
import { Outlet, redirect, useMatches, useNavigate, type UIMatch } from "react-router";
import { GameProvider, useGameContext } from "~/infrastructure/context/GameProvider";
import { useTranslation } from "react-i18next";
import { Card, CardBody, CardHeader, Spinner, useDisclosure } from "@heroui/react";
import { usePseudoContext } from "~/infrastructure/context/PseudoContext";
import type { TFunction } from "i18next";
import { StatsCard } from "~/features/adventure/StatsCard";
import { useViewContext, ViewProvider } from "~/infrastructure/context/ViewProvider";
import { scenarioService } from "~/infrastructure/services/scenarioService";
import { adventureService } from "~/infrastructure/services/adventureService";
import { ConflictModal } from "~/components/common/ConflictModal";
import { useEffect } from "react";
import { LocalStorageSaveManager } from "~/infrastructure/utils/save/LocalStorageSaveManager";
import { GlobalStatsManager } from "~/infrastructure/utils/stats/GlobalStatsManager";
import { NoScenarioAvailable } from "~/features/adventure/NoScenarioAvailable";
import { categoryService } from "~/infrastructure/services/categoryService";
import { ErrorStepCard } from "~/features/adventure/ErrorStepCard";

export async function clientLoader({ request, params }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const saveManager = new LocalStorageSaveManager();
    const globalStatsManager = new GlobalStatsManager();

    try {
        const categories = await categoryService.loadCategories();
        const scenarios = await scenarioService.loadScenarios();

        const playerProfile = await globalStatsManager.getInitialProfile();

        const playerProgress = await globalStatsManager.getPlayerProgress();
        const completedScenarios = playerProgress.completedScenarios;

        // Déterminer la catégorie actuelle du joueur (basée sur ses trophées)
        const currentPlayerCategory = await categoryService.getCurrentCategory(playerProfile);

        const currentScenarioId = adventureService.getCurrentScenarioId();
        const categoryId = searchParams.get("category")?.trim()?.toLocaleLowerCase();

        // Vérifier que la catégorie existe
        const currentCategory = Object.keys(categories?.categories).find((c) => c === categoryId);
        if (categoryId && !currentCategory && !currentScenarioId) {
            console.error(`Category "${categoryId}" not found`);
            return redirect("/?error=category-not-found");
        }

        // Vérifier les prérequis de la catégorie AVANT de charger un scénario
        if (categoryId) {
            const hasPrerequisites = await categoryService.checkPrerequisites(categoryId, playerProfile);

            if (!hasPrerequisites) {
                // Catégorie pas encore accessible → utiliser la catégorie actuelle
                return {
                    scenarios,
                    error: "prerequisites",
                    currentPlayerCategory,
                };
            }
        }

        const scenarioFromUrl = await adventureService.getScenarioFromUrl(searchParams, playerProfile, completedScenarios);

        if (!scenarioFromUrl && categoryId && !currentScenarioId) {
            // Déterminer si la catégorie scannée est déjà terminée
            const isCategoryCompleted = playerProfile.trophies?.includes(categoryId) || false;

            // Ordre des catégories pour déterminer la dernière terminée
            const categoryOrder = ["orientation", "validation", "renforcement", "selection"];
            const scannedIndex = categoryOrder.indexOf(categoryId);
            const currentIndex = categoryOrder.indexOf(currentPlayerCategory);

            // Trouver la dernière catégorie terminée (la plus avancée dans l'ordre)
            let lastCompletedCategory = categoryId;
            if (isCategoryCompleted && scannedIndex < currentIndex - 1) {
                // Si on scanne une ancienne catégorie (pas celle qu'on vient de finir)
                // Trouver la dernière catégorie terminée
                const completedCategories = categoryOrder.filter(cat =>
                    playerProfile.trophies?.includes(cat)
                );
                if (completedCategories.length > 0) {
                    // Prendre la dernière dans l'ordre
                    lastCompletedCategory = completedCategories[completedCategories.length - 1];
                }
            }

            return {
                scenarios,
                error: "no-scenario-available",
                // Utiliser la dernière catégorie terminée
                currentPlayerCategory: lastCompletedCategory,
            };
        }

        if (!scenarioFromUrl && !currentScenarioId) {
            return redirect("/");
        }

        if (scenarioFromUrl && !currentScenarioId) {
            return {
                scenarios,
                currentScenario: scenarioFromUrl,
                scenarioId: scenarioFromUrl.id,
            };
        }

        const currentScenario = scenarios.find((scenario) => scenario.id === currentScenarioId);
        if (!currentScenario) {
            console.error(`Scenario "${currentScenarioId}" not found`);
            return redirect("/?error=scenario-not-found");
        }

        const saveData = await saveManager.load();
        const currentStage = currentScenario?.stages[saveData?.currentScenario || "start"];

        if (
            scenarioFromUrl &&
            adventureService.hasActiveGameForDifferentScenario(scenarioFromUrl?.id) &&
            !currentStage?.isEnd
        ) {
            console.log("Conflict detected between current scenario and URL scenario");
            return {
                scenarios,
                currentScenario: currentScenario,
                scenarioId: scenarioFromUrl.id,
                conflictScenario: scenarioFromUrl,
            };
        }

        if (currentStage?.isEnd && scenarioFromUrl && scenarioFromUrl.id !== currentScenario.id) {
            return {
                scenarios,
                currentScenario: scenarioFromUrl,
                scenarioId: scenarioFromUrl.id,
            };
        }

        console.log("No conflict, proceeding with current scenario");
        return {
            scenarios,
            currentScenario,
            scenarioId: currentScenario.id,
        };
    } catch (error) {
        console.error("Failed to load game data:", error);
        throw new Response("Failed to load game data", { status: 500 });
    }
}

export function meta({}: Route.MetaArgs) {
    return [{ title: "Trekkie" }, { name: "description", content: "Trekkie" }];
}

export default function GameLayout({ loaderData }: Route.ComponentProps) {
    const { scenarios, currentScenario, conflictScenario, currentPlayerCategory, error } = loaderData;
    const { isOpen, onClose, onOpen } = useDisclosure({
        defaultOpen: conflictScenario !== undefined && conflictScenario !== null,
    });

    const navigate = useNavigate();

    const handleContinueExisting = () => {
        const currentScenarioId = adventureService.getCurrentScenarioId();
        if (currentScenarioId) {
            navigate(`/game?category=${currentScenarioId}`);
        }
        onClose();
    };

    const handleStartNewScenario = async () => {
        await adventureService.clearCurrentGame();
        onClose();
        window.location.reload();
    };

    const handleCancelConflict = () => {
        onClose();
        navigate("/");
    };

    useEffect(() => {
        if (conflictScenario) {
            onOpen();
        }
    }, [conflictScenario, onOpen]);

    // Gestion de l'erreur de prérequis
    // Utiliser currentPlayerCategory au lieu de categoryId (catégorie scannée)
    if (error === "prerequisites") {
        return <ErrorStepCard categoryId={currentPlayerCategory} />;
    }

    if (error === "no-scenario-available") {
        return <NoScenarioAvailable categoryId={currentPlayerCategory} />;
    }

    return (
        <ViewProvider>
            {!conflictScenario && (
                <GameProvider currentScenario={currentScenario!}>
                    <GameLayoutContent />
                </GameProvider>
            )}
            {conflictScenario && (
                <ConflictModal
                    currentScenario={currentScenario}
                    isOpen={isOpen}
                    onContinueExisting={handleContinueExisting}
                    onStartNew={handleStartNewScenario}
                    onCancel={handleCancelConflict}
                    newScenario={conflictScenario}
                />
            )}
        </ViewProvider>
    );
}

const GameLayoutContent = () => {
    const matches = useMatches() as UIMatch<unknown, RouteHandle>[];
    const activeMatch = matches[matches.length - 1];
    const handle = activeMatch?.handle;
    const { isLoading } = useGameContext();

    return (
        <>
            <Card className="max-w-lg w-full h-full text-center grow-1">
                {isLoading ? (
                    <Spinner variant="wave" size="lg" className="m-auto" />
                ) : (
                    <>
                        <CardHeader className="text-large font-semibold text-center justify-center">
                            <Title />
                        </CardHeader>
                        <CardBody className="gap-4 text-center">
                            <Outlet />
                        </CardBody>
                    </>
                )}
            </Card>
            {handle?.displayStatsCard && <StatsCard />}
        </>
    );
};

export type HandleContextType = {
    userContext: ReturnType<typeof usePseudoContext>;
    gameContext: ReturnType<typeof useGameContext>;
    viewContext: ReturnType<typeof useViewContext>;
};

export type RouteHandle = {
    titleKey: string;
    displayStatsCard?: boolean;
    getDynamicTitle?: (context: HandleContextType, t: TFunction) => string;
};

const Title = () => {
    const { t } = useTranslation();
    const userContext = usePseudoContext();
    const gameContext = useGameContext();
    const viewContext = useViewContext();
    const matches = useMatches() as UIMatch<unknown, RouteHandle>[];
    const activeMatch = matches[matches.length - 1];
    const handle = activeMatch?.handle;

    const context = {
        userContext,
        gameContext,
        viewContext,
    };

    const dynamicTitle =
        handle?.getDynamicTitle && typeof handle.getDynamicTitle === "function"
            ? handle.getDynamicTitle(context, t)
            : t(handle?.titleKey) || "Trekkie";

    return <h1>{dynamicTitle}</h1>;
};
