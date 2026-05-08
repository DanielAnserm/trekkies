// app/features/leaderboard/LeaderboardPage.tsx
import {
    TrophyIcon,
    ChartBarIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import {
    Card,
    Chip,
    Spinner,
    Avatar,
    Button,
    Progress,
    Link,
    Accordion,
    AccordionItem,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    LayoutCard,
    LayoutCardBody,
    LayoutCardHeader,
} from "~/components/common/LayoutCard";
import {
    STAT_ICONS,
    type PlayerStats,
    StatKeys,
    type Profile,
} from "~/models/game";
import { statsService, type PlayerGlobalStats } from "~/services/statsService";
import { useAuthContext } from "~/infrastructure/context/AuthContext";
import { adventureService } from "~/infrastructure/services/adventureService";

type LeaderboardEntry = {
    uid: string;
    pseudonym: string;
    totalScore: number;
    stats: PlayerStats;
    totalScenarios: number;
    rank: number;
    isCurrentUser: boolean;
};

type SortField =
    | "totalScore"
    | "character"
    | "context"
    | "skills"
    | "experience"
    | "totalScenarios";
// https://feathericons.dev/?search=award&iconset=feather&format=strict-jsx
export function Award(props: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            class="main-grid-item-icon"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            {...props}
        >
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
    );
}

export const LeaderboardPage = () => {
    const { t } = useTranslation();
    const { user } = useAuthContext();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasOngoingScenario, setHasOngoingScenario] = useState(false);

    useEffect(() => {
        loadLeaderboard();
    }, [user]);

    const loadLeaderboard = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const allPlayerStats = await statsService.getAllPlayerStats();
            const userProfiles = await statsService.getAllUserProfiles();
            const hasOngoingScenario =
                await adventureService.hasOngoingScenario();
            setHasOngoingScenario(hasOngoingScenario);

            console.log(allPlayerStats);
            // Combiner les stats avec les pseudonymes
            const leaderboardData: LeaderboardEntry[] = allPlayerStats
                .map((playerStat) => {
                    const profile = userProfiles.find(
                        (p) => p.uid === playerStat.uid
                    );
                    const totalScore = calculateTotalScore(playerStat);

                    return {
                        uid: playerStat.uid,
                        pseudonym:
                            profile?.pseudonym ||
                            t("common.anonymousPlayer", {
                                defaultValue: "Joueur Anonyme",
                            }),
                        totalScore,
                        stats: playerStat.currentProfile.statistics,
                        totalScenarios: playerStat.totalScenarios,
                        rank: 0,
                        isCurrentUser: user?.uid === playerStat.uid,
                    };
                })
                .sort((a, b) => b.totalScore - a.totalScore);

            // Assigner les rangs
            leaderboardData.forEach((entry, index) => {
                entry.rank = index + 1;
            });

            setLeaderboard(leaderboardData);
        } catch (err) {
            console.error("Erreur lors du chargement du classement:", err);
            setError(t("leaderboard.errors.loadError"));
        } finally {
            setIsLoading(false);
        }
    };

    const calculateTotalScore = (playerStat: PlayerGlobalStats): number => {
        const score =
            playerStat.currentProfile?.statistics.character +
            playerStat.currentProfile?.statistics.context +
            playerStat.currentProfile?.statistics.skills +
            playerStat.currentProfile?.statistics.experience * 2 -
            playerStat.totalScenarios;
        return score > 0 ? score : 0;
    };

    const sortedLeaderboard = [...leaderboard].sort((a, b) => {
        let aValue: number;
        let bValue: number;

        aValue = a.totalScore;
        bValue = b.totalScore;
        return bValue - aValue;
    });

    const getStatIcon = (stat: StatKeys) => {
        return STAT_ICONS[stat];
    };

    const getStatColor = (value: number, max: number = 10) => {
        const percentage = (value / max) * 100;
        if (percentage >= 80) return "primary";
        if (percentage >= 60) return "secondary";
        if (percentage >= 20) return "warning";
        return "default";
    };

    if (isLoading) {
        return (
            <LayoutCard>
                <LayoutCardBody>
                    <div className="flex justify-center items-center h-64">
                        <Spinner size="lg" color="primary" />
                    </div>
                </LayoutCardBody>
            </LayoutCard>
        );
    }

    if (error) {
        return (
            <LayoutCard>
                <LayoutCardBody>
                    <p className="text-danger">{error}</p>
                    <Button color="primary" onPress={loadLeaderboard}>
                        {t("leaderboard.errors.retry")}
                    </Button>
                </LayoutCardBody>
            </LayoutCard>
        );
    }

    const currentUserEntry = leaderboard.find((e) => e.isCurrentUser);

    return (
        <Card className="max-w-6xl w-full  text-center grow-1">
            <LayoutCardHeader>
                <div className="flex items-center gap-2">
                    <TrophyIcon className="h-6 w-6 text-warning" />
                    <h2 className="text-2xl font-bold">
                        {t("leaderboard.title")}
                    </h2>
                </div>
            </LayoutCardHeader>
            <LayoutCardBody>
                <div className="flex flex-col gap-4 overflow-hidden">
                    <div className="flex flex-wrap max-w-md justify-center gap-4 mt-6 mx-auto">
                        {hasOngoingScenario && (
                            <Button
                                fullWidth
                                color="secondary"
                                variant="solid"
                                as={Link}
                                href="/game"
                            >
                                {t("leaderboard.actions.continueGame")}
                            </Button>
                        )}
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <Button
                                fullWidth
                                as={Link}
                                href="/"
                                color="primary"
                                variant="bordered"
                            >
                                {t("leaderboard.actions.backHome")}
                            </Button>
                            <Button
                                fullWidth
                                color="primary"
                                onPress={loadLeaderboard}
                                startContent={
                                    <ChartBarIcon className="h-4 w-4" />
                                }
                            >
                                {t("leaderboard.actions.refresh")}
                            </Button>
                        </div>
                    </div>
                    {currentUserEntry && (
                        <div className="text-left border-2 border-primary rounded-medium p-4">
                            <div className="uppercase font-semibold text-tiny text-default-800 mb-2">
                                {t("leaderboard.userRank")}
                            </div>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Avatar
                                        size="lg"
                                        color={"secondary"}
                                        name={
                                            currentUserEntry?.pseudonym ||
                                            t("common.anonymousPlayer")
                                        }
                                        fallback={
                                            <UserIcon className="h-5 w-5" />
                                        }
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <div className="">
                                        <span className="font-semibold text-medium">
                                            {currentUserEntry?.pseudonym ||
                                                t("common.anonymousPlayer")}
                                        </span>
                                    </div>
                                    <div className="text-small">
                                        {t("home.playerCard.totalScore", {
                                            totalScore:
                                                currentUserEntry?.totalScore,
                                        })}
                                    </div>
                                </div>
                                <div className="ml-auto mt-auto">
                                    <div className="text-right text-default-700 text-tiny">
                                        {t("leaderboard.rank")}
                                    </div>
                                    <div className="text-primary-600 text-2xl font-extrabold">
                                        #{currentUserEntry?.rank}
                                        <span className="text-tiny text-default-700 font-medium">
                                            /{leaderboard.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <Accordion
                        variant="splitted"
                        className="p-0 grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]"
                    >
                        {sortedLeaderboard.map((entry, index) => (
                            <AccordionItem
                                key={index}
                                className="shadow-none border border-default relative h-fit"
                                aria-label={
                                    entry.pseudonym ||
                                    t("common.anonymousPlayer")
                                }
                                title={
                                    <div>
                                        <div className="inline-flex items-center gap-4 ">
                                            <div className="font-bold text-default-700">
                                                #{entry.rank}
                                            </div>
                                            <div className="flex gap-2 ">
                                                <div className="relative">
                                                    <Avatar
                                                        size="md"
                                                        color={
                                                            entry.isCurrentUser
                                                                ? "primary"
                                                                : "secondary"
                                                        }
                                                        name={
                                                            entry.pseudonym ||
                                                            t(
                                                                "common.anonymousPlayer"
                                                            )
                                                        }
                                                        fallback={
                                                            <UserIcon className="h-5 w-5" />
                                                        }
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="">
                                                        <span className="font-semibold text-small">
                                                            {entry.pseudonym ||
                                                                t(
                                                                    "common.anonymousPlayer"
                                                                )}
                                                        </span>
                                                        {entry.isCurrentUser && (
                                                            <>
                                                                {" "}
                                                                <Chip
                                                                    size="sm"
                                                                    variant="flat"
                                                                    radius="md"
                                                                    color="primary"
                                                                    className="text-tiny"
                                                                >
                                                                    {t(
                                                                        "leaderboard.playerCard.isYou"
                                                                    )}
                                                                </Chip>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="text-tiny">
                                                        {t(
                                                            "home.playerCard.totalScore",
                                                            {
                                                                totalScore:
                                                                    entry.totalScore,
                                                            }
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-small flex items-center gap-1">
                                            {getStatIcon(StatKeys.Character)}{" "}
                                            {t(
                                                "home.playerCard.stats.character"
                                            )}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Progress
                                                value={
                                                    (entry.stats.character /
                                                        10) *
                                                    100
                                                }
                                                className="w-20"
                                                size="sm"
                                                color={getStatColor(
                                                    entry.stats.character
                                                )}
                                            />
                                            <span className="text-small font-semibold w-6 text-right whitespace-nowrap">
                                                {entry.stats.character}
                                                <span className="text-tiny font-medium text-default-800">
                                                    /10
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-small flex items-center gap-1">
                                            {getStatIcon(StatKeys.Skills)}{" "}
                                            {t("home.playerCard.stats.skills")}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Progress
                                                value={
                                                    (entry.stats.skills / 10) *
                                                    100
                                                }
                                                className="w-20"
                                                size="sm"
                                                color={getStatColor(
                                                    entry.stats.skills
                                                )}
                                            />
                                            <span className="text-small font-semibold w-6 text-right whitespace-nowrap">
                                                {entry.stats.skills}
                                                <span className="text-tiny font-medium text-default-800">
                                                    /10
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-small flex items-center gap-1">
                                            {getStatIcon(StatKeys.Context)}{" "}
                                            {t("home.playerCard.stats.context")}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Progress
                                                value={
                                                    (entry.stats.context / 10) *
                                                    100
                                                }
                                                className="w-20"
                                                size="sm"
                                                color={getStatColor(
                                                    entry.stats.context
                                                )}
                                            />
                                            <span className="text-small font-semibold w-6 text-right whitespace-nowrap">
                                                {entry.stats.context}
                                                <span className="text-tiny font-medium text-default-800">
                                                    /10
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-small flex items-center gap-1">
                                            {getStatIcon(StatKeys.Experience)}{" "}
                                            {t(
                                                "home.playerCard.stats.experience"
                                            )}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Progress
                                                value={
                                                    (entry.stats.experience /
                                                        10) *
                                                    100
                                                }
                                                className="w-20"
                                                size="sm"
                                                color={getStatColor(
                                                    entry.stats.experience
                                                )}
                                            />
                                            <span className="text-small font-semibold w-6 text-left whitespace-nowrap">
                                                {entry.stats.experience}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    {/* Cartes du classement */}
                    {leaderboard.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-default-500">
                                {t("leaderboard.noPlayers")}
                            </p>
                        </div>
                    )}
                </div>
            </LayoutCardBody>
        </Card>
    );
};
