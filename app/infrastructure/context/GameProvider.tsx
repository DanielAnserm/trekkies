/**
 * GameProvider v2 - Utilise le GameEngine
 * Version refactorisée qui délègue la logique de jeu au GameEngine singleton
 */

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import type { Scenario, Choice, Stage } from "~/models/scenario";
import type { AppState, Profile } from "~/models/game";

import { useNavigate } from "react-router";
import { useViewContext } from "./ViewProvider";
import { GlobalStatsManager } from "../utils/stats/GlobalStatsManager";
import { useScenarioCompletion } from "../hooks/useScenarioCompletion";
import { useAuthContext } from "./AuthContext";
import { ConfettiComponent } from "~/components/common/ConfettiComponent";
import { usePseudoContext } from "./PseudoContext";
import { GameEngine } from "~/game-engine";

export type GameContextType = {
    gameState?: AppState;
    availableChoices: Choice[];
    handleChoice: (choice: Choice) => void;
    stage?: Stage;
    isLoading?: boolean;
    currentScenario?: Scenario;
};

export const GameContext = createContext<GameContextType>({
    availableChoices: [],
    handleChoice: () => {},
    isLoading: true,
});

export const useGameContext = () => useContext(GameContext);

type Props = {
    children?: React.ReactNode;
    currentScenario: Scenario;
};

const END_STAGE = "end";
const POSTULATION_STAGE = "postulation_badge";

export const GameProvider = ({ children, currentScenario }: Props) => {
    // GameEngine singleton
    const gameEngine = useMemo(() => GameEngine.getInstance(), []);

    // États React synchronisés avec le GameEngine
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [gameStartTime, setGameStartTime] = useState<number>(Date.now());
    const [profileAtStart, setProfileAtStart] = useState<Profile>();

    // Managers et hooks
    const globalStatsManager = useMemo(() => new GlobalStatsManager(), []);
    const { navigateToProfile, navigateToGame, navigateToPostulationBadge } =
        useViewContext();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { completeScenario, syncStatsWithFirebase } = useScenarioCompletion();
    const { setHasCompletedGame } = usePseudoContext();

    // Forcer le re-render quand le GameEngine change
    const [updateTrigger, forceUpdate] = useState({});

    if (!currentScenario) {
        throw new Error("Scenario not found");
    }

    // Synchronisation avec le GameEngine via événements
    useEffect(() => {
        const listener = () => {
            forceUpdate({});
        };

        gameEngine.addEventListener(listener);
        return () => {
            gameEngine.removeEventListener(listener);
        };
    }, [gameEngine]);

    // Initialisation du jeu
    useEffect(() => {
        const initializeGame = async () => {
            try {
                setIsLoading(true);
                const initialProfile =
                    await globalStatsManager.getInitialProfile();

                // Initialiser le GameEngine
                await gameEngine.initialize(
                    currentScenario,
                    initialProfile.statistics,
                    initialProfile
                );

                // Récupérer l'état après initialisation (peut avoir chargé une sauvegarde)
                const state = gameEngine.getState();

                if (state.currentStageId === "start") {
                    // Nouvelle partie
                    setGameStartTime(Date.now());
                    setProfileAtStart(initialProfile);
                    // initialProfile.isNewProfile
                    //     ? navigateToStart()
                    //     :
                    currentScenario.showIntro
                        ? navigateToProfile()
                        : navigateToGame();

                    console.log("No save found, starting new game");
                } else {
                    // Partie chargée
                    setGameStartTime(Date.now()); // TODO: charger le vrai timestamp
                    setProfileAtStart(state.profileAtStart);
                    console.log("Game loaded from save");
                }
            } catch (error) {
                console.error("Error loading game:", error);
                // En cas d'erreur, on commence une nouvelle partie
                const defaultProfile =
                    await globalStatsManager.getInitialProfile();
                await gameEngine.initialize(
                    currentScenario,
                    defaultProfile.statistics,
                    defaultProfile
                );
                setGameStartTime(Date.now());
                setProfileAtStart(defaultProfile);
                currentScenario?.showIntro
                    ? navigateToProfile()
                    : navigateToGame();
            } finally {
                setIsLoading(false);
                setIsInitialized(true);
            }
        };

        initializeGame();
    }, [currentScenario.id]); // Seulement au changement de scénario

    // Auto-save
    useEffect(() => {
        if (!isInitialized || isLoading) {
            return;
        }

        const saveGame = async () => {
            try {
                const profile = gameEngine.getProfile();

                // Sauvegarde locale seulement (pas les stats globales)
                // Les stats globales sont mises à jour uniquement à la fin du scénario
                // profile.statistics contient déjà les stats

                if (user) {
                    await syncStatsWithFirebase(profile);
                }
                console.log("Game auto-saved");
            } catch (error) {
                console.error("Auto-save failed:", error);
            }
        };

        saveGame();
    }, [gameEngine.getState().currentStageId, isInitialized, isLoading]);

    // Gestion des choix
    const handleChoice = useCallback(
        async (choice: Choice) => {
            console.log("Handling choice:", choice);

            // Vérifier si c'est une fin de jeu
            if (
                choice.next === END_STAGE ||
                choice.next === POSTULATION_STAGE
            ) {
                try {
                    // Calculer l'état final SANS l'appliquer au state
                    // (comme dans l'ancien code avec computeChanges)
                    const finalState = gameEngine.computeFinalState(choice);

                    // Compléter le scénario avec le profil final calculé
                    const result = await completeScenario(
                        currentScenario,
                        finalState.profile,
                        finalState.history,
                        gameStartTime
                    );

                    // Sauvegarder les stats globales avec le flag de complétion
                    await globalStatsManager.saveGlobalStats(
                        finalState.profile.statistics,
                        finalState.profile,
                        currentScenario.id,
                        true
                    );

                    // Effacer la sauvegarde du jeu
                    await gameEngine.clearSave();

                    if (result?.success) {
                        console.log("Scenario completed successfully:", {
                            completionTime: result.completionTime,
                            totalChoices: result.totalChoices,
                        });
                    } else {
                        console.warn("Scenario completion had issues:", result);
                    }

                    if (finalState.profile.isGameCompleted) {
                        setHasCompletedGame(true);
                    }

                    console.log("Save deleted on game end");
                } catch (error) {
                    console.error("Failed to complete scenario:", error);
                    // En cas d'erreur, essayer de nettoyer la sauvegarde quand même
                    try {
                        await gameEngine.clearSave();
                    } catch (clearError) {
                        console.error("Failed to clear save:", clearError);
                    }
                }

                if (choice.next === POSTULATION_STAGE) {
                    navigateToPostulationBadge();
                } else {
                    navigate("/");
                }
                return;
            }

            // Choix normal - déléguer au GameEngine
            await gameEngine.handleChoice(choice);
        },
        [gameEngine, completeScenario, currentScenario, gameStartTime, navigate]
    );

    // Construire le gameState pour compatibilité
    const gameState: AppState = useMemo(() => {
        const state = gameEngine.getState();
        const profile = gameEngine.getProfile(); // Contient déjà statistics à jour
        const history = gameEngine.getHistory();

        return {
            currentScenario: state.currentStageId,
            gameHistory: history,
            profile: profile,
            profileAtStart,
        };
    }, [gameEngine, profileAtStart, isLoading, updateTrigger]); // Re-calculer quand le GameEngine émet un événement

    const stage = gameEngine.getCurrentStage();
    const availableChoices = gameEngine.getAvailableChoicesForCurrentStage();

    return (
        <GameContext.Provider
            value={{
                gameState,
                availableChoices,
                stage,
                handleChoice,
                isLoading,
                currentScenario,
            }}
        >
            {children}
            <ConfettiComponent />
        </GameContext.Provider>
    );
};
