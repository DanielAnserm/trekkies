import { Button, Card, CardBody, CardHeader, Chip, Image } from "@heroui/react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import { useGameContext } from "~/infrastructure/context/GameProvider";
import { useViewContext } from "~/infrastructure/context/ViewProvider";
import { TraitsCard } from "./TraitsCard";
import { InterestsCard } from "./InterestsCard";
import { StatisticsCard } from "./StatisticsCard";
import { GoalCard } from "./GoalCard";

type Props = {};

type Profile = {
    profile: {
        name: string;
        description: string;
        image?: string;
    };
    traits: Record<string, string>;
    interests: string[];
    statistics: {
        character: number;
        skills: number;
        context: number;
        experience: number;
    };
    goal?: string;
};

export const ProfiletCard = (props: Props) => {
    const { t } = useTranslation();
    const { gameState, currentScenario } = useGameContext();

    const { navigateToGame } = useViewContext();
    return (
        <>
            <h3 className="font-semibold">{currentScenario?.title}</h3>
            <Markdown>{currentScenario?.description}</Markdown>
            {!!currentScenario?.image && <Image src={currentScenario?.image}></Image>}
            {/* {gameState && <TraitsCard profile={gameState?.profile} />} */}
            {/* <InterestsCard profile={gameState?.profile} /> */}
            {/* {gameState && <StatisticsCard profile={gameState.profile} />} */}
            {/* <GoalCard profile={gameState?.profile}/> */}

            <div className="flex flex-col gap-2 items-center">
                <Button onPress={navigateToGame} type="submit" color="primary" size="lg" className="w-full max-w-2xs">
                    {t("start.button.continue.label")}
                </Button>
            </div>
        </>
    );
};
