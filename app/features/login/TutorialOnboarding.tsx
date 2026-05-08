/**
 * TutorialOnboarding
 * Affiche le scénario tutoriel dans le flux d'onboarding (first login)
 * avant que le profile description ne soit affiché
 */

import { useEffect, useState, useMemo } from "react";
import { Button, Image } from "@heroui/react";
import Markdown from "react-markdown";
import { LayoutCard, LayoutCardBody, LayoutCardHeader } from "~/components/common/LayoutCard";
import { scenarioService } from "~/infrastructure/services/scenarioService";
import { GameEngine } from "~/game-engine";
import { GlobalStatsManager } from "~/infrastructure/utils/stats/GlobalStatsManager";
import type { Scenario, Stage, Choice } from "~/models/scenario";

type Props = {
    onComplete: () => void;
};

export const TutorialOnboarding = ({ onComplete }: Props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [scenario, setScenario] = useState<Scenario | null>(null);
    const [currentStage, setCurrentStage] = useState<Stage | null>(null);
    const [availableChoices, setAvailableChoices] = useState<Choice[]>([]);
    const [error, setError] = useState<string | null>(null);

    const gameEngine = useMemo(() => GameEngine.getInstance(), []);

    // Charger le scénario tutoriel
    useEffect(() => {
        const loadTutorial = async () => {
            try {
                setIsLoading(true);

                // Charger le scénario tutoriel
                const tutorialScenario = await scenarioService.getScenario("tutoriel_trekkie");

                if (!tutorialScenario) {
                    throw new Error("Scénario tutoriel non trouvé");
                }

                setScenario(tutorialScenario);

                // Charger le profil initial
                const globalStatsManager = new GlobalStatsManager();
                const initialProfile = await globalStatsManager.getInitialProfile();

                // Initialiser le GameEngine avec le tutoriel
                await gameEngine.initialize(
                    tutorialScenario,
                    initialProfile.statistics,
                    initialProfile
                );

                // Récupérer l'état initial
                const stage = gameEngine.getCurrentStage();
                const choices = gameEngine.getAvailableChoicesForCurrentStage();

                setCurrentStage(stage || null);
                setAvailableChoices(choices);
            } catch (err) {
                console.error("Erreur lors du chargement du tutoriel:", err);
                setError("Impossible de charger le tutoriel");
            } finally {
                setIsLoading(false);
            }
        };

        loadTutorial();
    }, []);

    // Écouter les changements du GameEngine
    useEffect(() => {
        const listener = () => {
            const stage = gameEngine.getCurrentStage();
            const choices = gameEngine.getAvailableChoicesForCurrentStage();

            setCurrentStage(stage || null);
            setAvailableChoices(choices);
        };

        gameEngine.addEventListener(listener);
        return () => {
            gameEngine.removeEventListener(listener);
        };
    }, [gameEngine]);

    // Gérer un choix
    const handleChoice = async (choice: Choice) => {
        try {
            // Si c'est le dernier choix du tutoriel (stage isEnd)
            if (currentStage?.isEnd) {
                // Nettoyer la sauvegarde du tutoriel
                await gameEngine.clearSave();
                // Passer à l'étape suivante (affichage du profil)
                onComplete();
            } else {
                // Choix normal - déléguer au GameEngine
                await gameEngine.handleChoice(choice);
            }
        } catch (error) {
            console.error("Erreur lors du traitement du choix:", error);
        }
    };

    if (isLoading) {
        return (
            <LayoutCard>
                <LayoutCardBody>
                    <div className="flex justify-center items-center p-8">
                        <div className="text-lg">Chargement du tutoriel...</div>
                    </div>
                </LayoutCardBody>
            </LayoutCard>
        );
    }

    if (error || !scenario || !currentStage) {
        return (
            <LayoutCard>
                <LayoutCardBody>
                    <div className="text-center text-red-500">
                        {error || "Erreur lors du chargement du tutoriel"}
                    </div>
                    <Button onPress={onComplete} color="primary" className="mt-4">
                        Passer
                    </Button>
                </LayoutCardBody>
            </LayoutCard>
        );
    }

    return (
        <LayoutCard>
            <LayoutCardHeader>
                <h1>{scenario.title}</h1>
            </LayoutCardHeader>
            <LayoutCardBody>
                {/* Description du stage actuel */}
                <MarkdownCustom text={currentStage.description} />

                {/* Note: Dans le stage isEnd, on n'affiche pas les stats */}
                {/* Les stats ne sont affichées que si on est pas dans un onboarding */}

                {/* Afficher les choix disponibles */}
                <div className="flex flex-col gap-4 mt-6">
                    {availableChoices.map((choice) => (
                        <Button
                            key={choice.text}
                            size="lg"
                            color={currentStage.isEnd ? "primary" : "secondary"}
                            variant={currentStage.isEnd ? "solid" : "bordered"}
                            onPress={() => handleChoice(choice)}
                            className="w-full whitespace-normal h-auto min-h-12"
                        >
                            {choice.text}
                        </Button>
                    ))}
                </div>
            </LayoutCardBody>
        </LayoutCard>
    );
};

const MarkdownCustom = ({ text }: { text?: string }) => {
    if (!text) return null;
    return (
        <Markdown
            components={{
                img: (imgOption) => {
                    const { node, onError, ...rest } = imgOption || {};
                    const handleError = onError
                        ? ((() => {
                              try {
                                  onError({} as any);
                              } catch {}
                          }) as () => void)
                        : undefined;

                    return <Image removeWrapper width={178} height={178} className="mx-auto" {...rest} onError={handleError} />;
                },
            }}
        >
            {text}
        </Markdown>
    );
};
