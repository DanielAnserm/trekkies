import React, { useMemo } from "react";
import Markdown from "react-markdown";
import { useGameContext } from "~/infrastructure/context/GameProvider";
import { InfoStatUpdateChip } from "./InfoStatUpdateChip";
import { Avatar, AvatarIcon, Button, Card, Divider, Image } from "@heroui/react";
import type { StatKeys } from "~/models/game";
import { useTranslation } from "react-i18next";
import { TrophyIcon } from "@heroicons/react/24/outline";
import {
    compareProfiles,
    hasChanges,
    hasChangesGoal,
    hasChangesTrophies,
    type ProfileDiff,
} from "~/infrastructure/utils/profile/compare";

type Props = {};

export const EndCard = (props: Props) => {
    const { stage: scenario, availableChoices, gameState, handleChoice } = useGameContext();
    const { t } = useTranslation();

    const statAtBegining = gameState?.profileAtStart?.statistics;

    const profileDiff: ProfileDiff = useMemo(() => {
        return compareProfiles(gameState?.profileAtStart, gameState?.profile);
    }, [gameState?.profile, gameState?.profileAtStart]);

    return (
        <>
            <MarkdownCustom text={scenario?.description} />
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h3 className="text-left font-large flex gap-2 font-bold mb-1">
                        <span className="text-warning">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                className="main-grid-item-icon"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                            >
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                            </svg>
                        </span>
                        {t("endCard.newStatistics")}
                    </h3>
                    <dl className="grid w-full grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-2 text-left ">
                        {gameState?.profile?.statistics &&
                            Object.entries(gameState?.profile?.statistics).map(([stat, value]) => (
                                <Card key={stat} className="border border-transparent dark:border-default-100" shadow="sm">
                                    <div className="flex p-2">
                                        <div className="flex flex-col gap-y-1">
                                            <dt className="text-small font-medium text-default-700">
                                                {t(`profile.statistics.${stat}`, { defaultValue: stat })}
                                            </dt>
                                            <dd className="text-2xl font-semibold text-default-900">{value}</dd>

                                            {statAtBegining && (
                                                <InfoStatUpdateChip
                                                    before={statAtBegining[stat as StatKeys]}
                                                    after={value}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                    </dl>
                </div>
                {hasChanges(profileDiff) && <Divider />}
                {hasChangesGoal(profileDiff) && (
                    <div className="text-left">
                        <div className="flex flex-grow flex-row w-full py-3 px-4 gap-x-1 border-small rounded-medium items-center text-primary-800 bg-primary-50 border-primary-300 shadow-lg shadow-primary/20">
                            <div className="flex-none relative w-9 h-9 rounded-full grid place-items-center bg-primary-50 border-primary-100 shadow-small border-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                    className="main-grid-item-icon w-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <circle cx="12" cy="12" r="6" />
                                    <circle cx="12" cy="12" r="2" />
                                </svg>
                            </div>
                            <div className="h-full flex-grow min-h-10 ms-2 flex flex-col box-border items-start text-inherit justify-center">
                                <div className="text-tiny w-full font-semibold block text-inherit leading-5">
                                    {t("endCard.newObjective")}
                                </div>
                                <div className="pl-[1px] text-small font-semibold text-left text-foreground">
                                    {gameState?.profile.goal}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {hasChangesTrophies(profileDiff) && (
                    <div className="text-left">
                        <div className="flex flex-grow flex-row w-full py-3 px-4 gap-x-1 rounded-medium items-center text-warning-700 bg-warning-50  border-small border-warning-300 shadow-lg shadow-warning/20">
                            <div className="flex-none relative w-9 h-9 rounded-full grid place-items-center bg-warning-50 border-warning-100 shadow-small border-1">
                                <TrophyIcon className="w-6" />
                            </div>
                            <div className="h-full flex-grow min-h-10 ms-2 flex flex-col box-border items-start text-inherit justify-center">
                                <div className="text-tiny w-full font-semibold block text-inherit leading-5">
                                    {t("endCard.newTrophy")}
                                </div>
                                {profileDiff.trophies.added.map((x) => (
                                    <div className="pl-[1px] text-small font-semibold text-left text-foreground flex gap-2 items-center">
                                        <Avatar size="sm" src={x.img} />
                                        {t(`trophy.${x.key}.title`, { defaultValue: x.key })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {availableChoices.map((choice) => (
                <Button
                    size="lg"
                    key={choice.text}
                    onPress={() => handleChoice(choice)}
                    color="primary"
                    className="w-full whitespace-normal"
                >
                    {choice.text}
                </Button>
            ))}
        </>
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

                    return  <Image removeWrapper width={178} height={178} className="mx-auto" {...rest} onError={handleError} />;
                },
            }}
        >
            {text}
        </Markdown>
    );
};
