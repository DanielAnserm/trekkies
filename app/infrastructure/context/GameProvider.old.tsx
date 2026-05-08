import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    type Scenario,
    type Choice,
    type Stage,
    type StatisticChanges,
    StatisticChangeType,
    PlayerParameterChangeType,
    ProfileChangeType,
    type ChoiceChanges,
} from "~/models/scenario";
import {
    type GoalProfile,
    type HistoryEntry,
    type InterestsProfile,
    type PlayerParameters,
    type Profile,
    type SaveData,
    type TraitsProfile,
} from "~/models/game";
import { type AppState } from "~/models/game";
import { type PlayerStats } from "~/models/game";

import { checkConditionSafe } from "../utils/tokenizer";
import { generateDynamicProfile } from "../utils/profile/generator";
import { LocalStorageSaveManager } from "../utils/save/LocalStorageSaveManager";
import { useNavigate } from "react-router";
import { useViewContext } from "./ViewProvider";
import { GlobalStatsManager } from "../utils/stats/GlobalStatsManager";
import { useScenarioCompletion } from "../hooks/useScenarioCompletion";
import { useAuthContext } from "./AuthContext";
import { ConfettiComponent } from "~/components/common/ConfettiComponent";
import { usePseudoContext } from "./PseudoContext";

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
const MAX_STATS = 10;
const START_STAGE = "start";
const END_STAGE = "end";
const POSTULATION_STAGE = "postulation_badge";

// Fonction synchrone qui applique les changements et retourne les nouvelles valeurs
const computeChanges = (
    changes: ChoiceChanges | undefined,
    currentStats: PlayerStats,
    currentPlayerParameters: PlayerParameters,
    currentTraits: TraitsProfile,
    currentInterests: InterestsProfile,
    currentGoal: GoalProfile | undefined,
    currentTrophies: string[]
): {
    stats: PlayerStats;
    playerParameters: PlayerParameters;
    traits: TraitsProfile;
    interests: InterestsProfile;
    goal: GoalProfile | undefined;
    trophies: string[];
    gameCompleted?: boolean;
} => {
    if (!changes) {
        return {
            stats: currentStats,
            playerParameters: currentPlayerParameters,
            traits: currentTraits,
            interests: currentInterests,
            goal: currentGoal,
            trophies: currentTrophies,
        };
    }

    let newStats = { ...currentStats };
    let newPlayerParameters = { ...currentPlayerParameters };
    let newTraits = { ...currentTraits };
    let newInterests = [...currentInterests];
    let newGoal = currentGoal;
    let newTrophies = [...currentTrophies];

    // Appliquer les changements de stats
    if (changes.stats) {
        const statChanges = changes.stats;
        Object.keys(statChanges).forEach((key) => {
            const statKey = key as keyof StatisticChanges;
            const statToUpdate = statChanges[statKey];
            switch (statToUpdate.type) {
                case StatisticChangeType.Add:
                    newStats[statKey] = newStats[statKey] + statToUpdate.value;
                    break;
                case StatisticChangeType.Sub:
                    newStats[statKey] = newStats[statKey] - statToUpdate.value;
                    break;
                case StatisticChangeType.Set:
                    newStats[statKey] = statToUpdate.value;
                    break;
            }

            // Pas de limite supérieure pour l'expérience
            if (statKey !== "experience" && newStats[statKey] > MAX_STATS) {
                newStats[statKey] = MAX_STATS;
            } else if (newStats[statKey] < 0) {
                newStats[statKey] = 0;
            }
        });
    }

    // Appliquer les changements de playerParameters
    if (changes.playerParameters) {
        const playerParamsToUpdate = changes.playerParameters;
        Object.keys(playerParamsToUpdate).forEach((key) => {
            const playerParamToUpdate = playerParamsToUpdate[key];
            switch (playerParamToUpdate.type) {
                case PlayerParameterChangeType.Add:
                    if (typeof playerParamToUpdate.value === "number") {
                        if (!newPlayerParameters[key])
                            newPlayerParameters[key] = 0;
                        (newPlayerParameters[key] as number) +=
                            playerParamToUpdate.value;
                    }
                    break;
                case PlayerParameterChangeType.Set:
                    newPlayerParameters[key] = playerParamToUpdate.value;
                    break;
                case PlayerParameterChangeType.Remove:
                    delete newPlayerParameters[key];
                    break;
            }
        });
    }

    // Appliquer les changements de goals
    if (changes.goals) {
        const goalsToUpdate = changes.goals;
        Object.keys(goalsToUpdate).forEach((key) => {
            const goalToUpdate = goalsToUpdate[key];
            switch (goalToUpdate.type) {
                case ProfileChangeType.Add:
                    newGoal = key;
                    break;
                case ProfileChangeType.Remove:
                    newGoal = "";
                    break;
            }
        });
    }

    // Appliquer les changements de trophies
    if (changes.unlockTrophies) {
        const trophyToUpdate = changes.unlockTrophies || [];
        const trophySet = new Set(newTrophies);
        trophyToUpdate.forEach((key) => {
            trophySet.add(key);
        });
        newTrophies = [...trophySet];
    }

    // Appliquer les changements d'interests
    if (changes.interests) {
        const interestsToUpdate = changes.interests;
        Object.keys(interestsToUpdate).forEach((key) => {
            const interestToUpdate = interestsToUpdate[key];
            switch (interestToUpdate.type) {
                case ProfileChangeType.Add:
                    if (!newInterests.includes(key)) {
                        newInterests.push(key);
                    }
                    break;
                case ProfileChangeType.Remove:
                    const index = newInterests.findIndex((x) => x === key);
                    if (index >= 0) {
                        newInterests.splice(index, 1);
                    }
                    break;
            }
        });
    }

    // Appliquer les changements de traits
    if (changes.traits) {
        const traitsToUpdate = changes.traits;
        Object.keys(traitsToUpdate).forEach((key) => {
            const traitToUpdate = traitsToUpdate[key];
            switch (traitToUpdate.type) {
                case ProfileChangeType.Add:
                    newTraits[key] = traitToUpdate.value;
                    break;
                case ProfileChangeType.Remove:
                    delete newTraits[key];
                    break;
            }
        });
    }

    return {
        stats: newStats,
        playerParameters: newPlayerParameters,
        traits: newTraits,
        interests: newInterests,
        goal: newGoal,
        trophies: newTrophies,
        gameCompleted: changes.gameCompleted,
    };
};

const applyChanges = (
    changes: ChoiceChanges | undefined,
    setStats: React.Dispatch<React.SetStateAction<PlayerStats>>,
    setPlayerParameters: React.Dispatch<React.SetStateAction<PlayerParameters>>,
    setTraits: React.Dispatch<React.SetStateAction<TraitsProfile>>,
    setInterests: React.Dispatch<React.SetStateAction<InterestsProfile>>,
    setGoal: React.Dispatch<React.SetStateAction<GoalProfile | undefined>>,
    setTrophies: React.Dispatch<React.SetStateAction<string[]>>,
    setGameCompleted: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if (!changes) return;

    // Appliquer les changements de stats
    if (changes.stats) {
        const statChanges = changes.stats;
        setStats((prevStats) => {
            const newStats = { ...prevStats };
            Object.keys(statChanges).forEach((key) => {
                const statKey = key as keyof StatisticChanges;
                const statToUpdate = statChanges[statKey];
                switch (statToUpdate.type) {
                    case StatisticChangeType.Add:
                        newStats[statKey] =
                            newStats[statKey] + statToUpdate.value;
                        break;
                    case StatisticChangeType.Sub:
                        newStats[statKey] =
                            newStats[statKey] - statToUpdate.value;
                        break;
                    case StatisticChangeType.Set:
                        newStats[statKey] = statToUpdate.value;
                        break;
                }

                // Pas de limite supérieure pour l'expérience
                if (statKey !== "experience" && newStats[statKey] > MAX_STATS) {
                    newStats[statKey] = MAX_STATS;
                } else if (newStats[statKey] < 0) {
                    newStats[statKey] = 0;
                }
            });
            return newStats;
        });
    }

    // Appliquer les changements de playerParameters
    if (changes.playerParameters) {
        const playerParamsToUpdate = changes.playerParameters;
        setPlayerParameters((prevParams) => {
            const newParams = { ...prevParams };
            Object.keys(playerParamsToUpdate).forEach((key) => {
                const playerParamToUpdate = playerParamsToUpdate[key];
                switch (playerParamToUpdate.type) {
                    case PlayerParameterChangeType.Add:
                        if (typeof playerParamToUpdate.value === "number") {
                            if (!newParams[key]) newParams[key] = 0;
                            (newParams[key] as number) +=
                                playerParamToUpdate.value;
                        }
                        break;
                    case PlayerParameterChangeType.Set:
                        newParams[key] = playerParamToUpdate.value;
                        break;
                    case PlayerParameterChangeType.Remove:
                        delete newParams[key];
                        break;
                }
            });
            return newParams;
        });
    }

    // Appliquer les changements de goals
    if (changes.goals) {
        const goalsToUpdate = changes.goals;
        Object.keys(goalsToUpdate).forEach((key) => {
            const goalToUpdate = goalsToUpdate[key];
            switch (goalToUpdate.type) {
                case ProfileChangeType.Add:
                    setGoal(key);
                    break;
                case ProfileChangeType.Remove:
                    setGoal("");
                    break;
            }
        });
    }

    // Appliquer les changements de trophies
    if (changes.unlockTrophies) {
        const trophyToUpdate = changes.unlockTrophies || [];
        setTrophies((prevParams) => {
            const newParams = new Set(prevParams || []);
            trophyToUpdate.forEach((key) => {
                newParams.add(key);
            });
            return [...newParams];
        });
    }

    // Appliquer les changements d'interests
    if (changes.interests) {
        const interestsToUpdate = changes.interests;
        setInterests((prevParams) => {
            const newParams = [...prevParams];
            Object.keys(interestsToUpdate).forEach((key) => {
                const interestToUpdate = interestsToUpdate[key];
                switch (interestToUpdate.type) {
                    case ProfileChangeType.Add:
                        if (!newParams.includes(key)) {
                            newParams.push(key);
                        }
                        break;
                    case ProfileChangeType.Remove:
                        const index = newParams.findIndex((x) => x === key);
                        if (index >= 0) {
                            newParams.splice(index, 1);
                        }
                        break;
                }
            });
            return newParams;
        });
    }

    // Appliquer les changements de traits
    if (changes.traits) {
        const traitsToUpdate = changes.traits;
        setTraits((prevParams) => {
            const newParams = { ...prevParams };
            Object.keys(traitsToUpdate).forEach((key) => {
                const traitToUpdate = traitsToUpdate[key];
                switch (traitToUpdate.type) {
                    case ProfileChangeType.Add:
                        newParams[key] = traitToUpdate.value;
                        break;
                    case ProfileChangeType.Remove:
                        delete newParams[key];
                        break;
                }
            });
            return newParams;
        });
    }

    console.log("HERE", changes);
    if (changes.gameCompleted) {
        setGameCompleted(changes.gameCompleted);
    }
};

export const GameProvider = ({ children, currentScenario }: Props) => {
    const [currentStage, setCurrentStage] = useState(START_STAGE);
    const [gameHistory, setGameHistory] = useState<HistoryEntry[]>([]);
    const [stats, setStats] = useState<PlayerStats>({
        character: 0,
        context: 0,
        skills: 0,
        experience: 0,
    });
    const [traits, setTraits] = useState<TraitsProfile>({});
    const [interests, setInterests] = useState<InterestsProfile>([]);
    const [trophies, setTrophies] = useState<string[]>([]);
    const [goal, setGoal] = useState<GoalProfile>();
    const [playerParameters, setPlayerParameters] = useState<PlayerParameters>(
        {}
    );
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isGameCompleted, setIsGameCompleted] = useState(false);
    const [gameStartTime, setGameStartTime] = useState<number>(Date.now());

    const saveManager = useMemo(() => new LocalStorageSaveManager(), []);
    const globalStatsManager = useMemo(() => new GlobalStatsManager(), []);
    const { navigateToStart, navigateToProfile, navigateToPostulationBadge } =
        useViewContext();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { completeScenario, syncStatsWithFirebase } = useScenarioCompletion();
    const [profileAtStart, setProfilAtStart] = useState<Profile>();
    const { setHasCompletedGame } = usePseudoContext();
    if (!currentScenario) {
        throw new Error("Scenario not found");
    }

    const stages = currentScenario?.stages;

    if (stages === undefined) {
        throw new Error("Stages not found in the current scenario");
    }

    if (!stages[currentStage]) {
        throw new Error(
            `Stage "${currentStage}" not found in the current scenario`
        );
    }

    // const dynamicProfile = useMemo(() => generateDynamicProfile(stats, currentScenario), [currentScenario, stats]);

    const gameState: AppState = {
        currentScenario: currentStage,
        gameHistory,
        profile: {
            ...profileAtStart,
            statistics: stats,
            traits,
            interests,
            goal,
            playerParameters,
            trophies,
            isGameCompleted,
        },
        profileAtStart,
    };

    useEffect(() => {
        const initializeGame = async () => {
            try {
                setIsLoading(true);
                const initialProfile =
                    await globalStatsManager.getInitialProfile();
                const saveData = await saveManager.load();

                if (saveData && saveData.scenarioId === currentScenario.id) {
                    // Charger la partie sauvegardée
                    setCurrentStage(saveData.currentScenario);
                    setStats(saveData.profile.statistics ?? saveData.stats);
                    setTraits(saveData.profile.traits);
                    setGoal(saveData.profile.goal);
                    setInterests(saveData.profile.interests);
                    setPlayerParameters(saveData.profile.playerParameters);
                    setTrophies(saveData.profile.trophies);
                    setGameHistory(saveData.history);
                    setGameStartTime(saveData.timestamp);
                    setProfilAtStart(saveData.profileAtStart);

                    console.log("Game loaded from save");
                } else {
                    // Pas de sauvegarde, commencer une nouvelle partie
                    await saveManager.delete();
                    setStats(initialProfile.statistics);
                    setTraits(initialProfile.traits);
                    setGoal(initialProfile.goal);
                    setInterests(initialProfile.interests);
                    setPlayerParameters(initialProfile.playerParameters);
                    setTrophies(initialProfile.trophies);
                    setGameStartTime(Date.now());
                    setProfilAtStart(initialProfile);
                    initialProfile.isNewProfile
                        ? navigateToStart()
                        : navigateToProfile();
                    initialProfile.isNewProfile
                        ? navigateToStart()
                        : navigateToProfile();

                    console.log("No save found, starting new game");
                }
            } catch (error) {
                console.error("Error loading game:", error);
                // En cas d'erreur, on commence une nouvelle partie
                const defaultProfile =
                    await globalStatsManager.getInitialProfile();
                setStats(defaultProfile.statistics);
                setTraits(defaultProfile.traits);
                setGoal(defaultProfile.goal);
                setInterests(defaultProfile.interests);
                setPlayerParameters(defaultProfile.playerParameters);
                setTrophies(defaultProfile.trophies);
                setGameStartTime(Date.now());
                setProfilAtStart(defaultProfile);
                navigateToStart();
            } finally {
                setIsLoading(false);
                setIsInitialized(true);
            }
        };

        initializeGame();
    }, [saveManager, globalStatsManager]);

    useEffect(() => {
        // Ne pas sauvegarder si le jeu n'est pas initialisé, en cours de chargement,
        // ou si on est au scénario de départ
        if (!isInitialized || isLoading) {
            return;
        }

        const saveGame = async () => {
            try {
                console.log(gameHistory);
                const saveData: SaveData = {
                    currentScenario: currentStage,
                    stats,
                    profile: gameState.profile,
                    scenarioId: currentScenario.id,
                    history: gameHistory,
                    timestamp: Date.now(),
                    version: "1.0.0",
                    profileAtStart,
                };

                await saveManager.save(saveData);
                await globalStatsManager.saveGlobalStats(
                    saveData.stats,
                    saveData.profile
                );
                if (user) {
                    await syncStatsWithFirebase(saveData.profile);
                }
                console.log("Game auto-saved");
            } catch (error) {
                console.error("Auto-save failed:", error);
            }
        };

        saveGame();
    }, [
        currentStage,
        stats,
        gameHistory,
        isInitialized,
        isLoading,
        saveManager,
    ]);

    const getAvailableChoices = (scenario: Stage) => {
        const choices = scenario?.choices?.filter((choice) =>
            checkConditionSafe(choice.condition, gameState.profile)
        );
        return choices || [];
    };

    const handleChoice = useCallback(
        async (choice: Choice) => {
            console.log("Handling choice:", choice);
            if (
                choice.next === END_STAGE ||
                choice.next === POSTULATION_STAGE
            ) {
                try {
                    // Calculer tous les changements de manière synchrone
                    const computedChanges = computeChanges(
                        choice.changes,
                        stats,
                        playerParameters,
                        traits,
                        interests,
                        goal,
                        trophies
                    );

                    const finalProfile = {
                        ...gameState.profile,
                        statistics: computedChanges.stats,
                        playerParameters: computedChanges.playerParameters,
                        traits: computedChanges.traits,
                        interests: computedChanges.interests,
                        goal: computedChanges.goal,
                        trophies: computedChanges.trophies,
                        isGameCompleted: computedChanges.gameCompleted,
                    };
                    if (choice.next === POSTULATION_STAGE) {
                        finalProfile.playerParameters["postulationDone"] = 1;
                    }
                    const result = await completeScenario(
                        currentScenario,
                        finalProfile,
                        gameHistory,
                        gameStartTime
                    );
                    await globalStatsManager.saveGlobalStats(
                        finalProfile.statistics,
                        finalProfile,
                        currentScenario.id,
                        true
                    );
                    await saveManager.delete();

                    if (result?.success) {
                        console.log("Scenario completed successfully:", {
                            completionTime: result.completionTime,
                            totalChoices: result.totalChoices,
                        });
                    } else {
                        console.warn("Scenario completion had issues:", result);
                    }
                    if (finalProfile.isGameCompleted) {
                        setHasCompletedGame(true);
                    }
                    console.log("Save deleted on game end");
                } catch (error) {
                    console.error("Failed to complete scenario:", error);
                    try {
                        await saveManager.delete();
                    } catch (deleteError) {
                        console.error("Failed to delete save:", deleteError);
                    }
                }

                if (choice.next === POSTULATION_STAGE) {
                    navigateToPostulationBadge();
                } else {
                    navigate("/");
                }
                return;
            }
            const newHistory = [
                ...gameHistory,
                {
                    scenario: currentStage,
                    choice: choice.text,
                    statsAtTime: { ...stats },
                },
            ];

            setGameHistory(newHistory);
            applyChanges(
                choice.changes,
                setStats,
                setPlayerParameters,
                setTraits,
                setInterests,
                setGoal,
                setTrophies,
                setIsGameCompleted
            );

            setCurrentStage(choice.next!);
            const stage = stages[choice.next!];
            if (stage?.changes) {
                console.log(
                    `Applying stage changes for stage: ${currentStage}`,
                    stage.changes
                );
                applyChanges(
                    stage.changes,
                    setStats,
                    setPlayerParameters,
                    setTraits,
                    setInterests,
                    setGoal,
                    setTrophies,
                    setIsGameCompleted
                );
            }
        },
        [
            completeScenario,
            currentScenario,
            stats,
            traits,
            interests,
            goal,
            gameHistory,
            gameStartTime,
            saveManager,
            navigate,
            currentStage,
        ]
    );

    const stage = stages[currentStage];
    const availableChoices = getAvailableChoices(stage);

    return (
        <GameContext
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
        </GameContext>
    );
};
