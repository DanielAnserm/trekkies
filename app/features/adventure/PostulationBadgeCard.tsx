import { TrophyIcon } from "@heroicons/react/24/outline";
import { Avatar, Button, Link } from "@heroui/react";
import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import { useGameContext } from "~/infrastructure/context/GameProvider";
import {
    compareProfiles,
    hasChangesTrophies,
    type ProfileDiff,
} from "~/infrastructure/utils/profile/compare";
import { TROPHIES } from "./TrophyCard";
import { GlobalStatsManager } from "~/infrastructure/utils/stats/GlobalStatsManager";

type Props = {};

export const PostulationBadgeCard = (props: Props) => {
    const {
        stage: scenario,
        availableChoices,
        gameState,
        handleChoice,
    } = useGameContext();
    const { t } = useTranslation();
    const globalStatsManager = useMemo(() => new GlobalStatsManager(), []);

    const trophy = TROPHIES.find((x) => x.key == "postulation");
    const addBadgePostulation = useCallback(() => {
        const addBadgePostulation = async () => {
            const currentProgress =
                await globalStatsManager.getInitialProfile();
            if (
                trophy?.key &&
                !currentProgress?.trophies.includes(trophy?.key)
            ) {
                currentProgress?.trophies.push(trophy?.key);
                currentProgress.playerParameters["postulationDone"] = 1;
                await globalStatsManager.saveGlobalStats(
                    currentProgress.statistics,
                    currentProgress
                );
            }
        };
        addBadgePostulation();
    }, [globalStatsManager]);

    useEffect(() => {
        addBadgePostulation();
    }, []);

    return (
        <>
            <Markdown>{t("badge_postulation.description")}</Markdown>

            <div className="text-left">
                <div className="flex flex-grow flex-row w-full py-3 px-4 gap-x-1 rounded-medium items-center text-warning-700 bg-warning-50  border-small border-warning-300 shadow-lg shadow-warning/20">
                    <div className="flex-none relative w-9 h-9 rounded-full grid place-items-center bg-warning-50 border-warning-100 shadow-small border-1">
                        <TrophyIcon className="w-6" />
                    </div>
                    <div className="h-full flex-grow min-h-10 ms-2 flex flex-col box-border items-start text-inherit justify-center">
                        <div className="text-tiny w-full font-semibold block text-inherit leading-5">
                            {t("badge_postulation.trophyUnlock")}
                        </div>

                        <div className="pl-[1px] text-small font-semibold text-left text-foreground flex gap-2 items-center">
                            <Avatar size="sm" src={trophy?.img} />
                            {t(`trophy.postulation.title`, {
                                defaultValue: "postulation",
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <Button color="primary" size="lg" as={Link} href="/">
                {t("badge_postulation.continueButton")}
            </Button>
        </>
    );
};
