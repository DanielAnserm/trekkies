import { ArrowDownLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { Button, Card, Chip, Image } from "@heroui/react";
import confetti from "canvas-confetti";
import { memo, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import { useGameContext } from "~/infrastructure/context/GameProvider";
import type { StatKeys } from "~/models/game";
import { InfoStatUpdateChip } from "./InfoStatUpdateChip";
import { EndCard } from "./EndCard";

type Props = {};

export const GameCard = (props: Props) => {
    const { stage: scenario, availableChoices, gameState, handleChoice } = useGameContext();
    const { t } = useTranslation();

    // useEffect(() => {
    //     if (scenario?.isEnd && scenario?.isSuccess) {
    //         confetti();
    //     }
    // }, [scenario]);

    if (scenario?.isEnd) {
        return <EndCard />;
    }

    return (
        <>
            <MarkdownCustom text={scenario?.description} />
            <div className="text-left flex flex-wrap gap-4 mt-auto p-4">
                {availableChoices.map((choice) => (
                    <Button
                        size="lg"
                        key={choice.text}
                        onPress={() => handleChoice(choice)}
                        color="secondary"
                        variant="bordered"
                        className="w-full whitespace-normal h-auto min-h-12"
                    >
                        {choice.text}
                    </Button>
                ))}
            </div>
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

                    return <Image removeWrapper width={178} height={178} className="mx-auto" {...rest} onError={handleError} />;
                },
            }}
        >
            {text}
        </Markdown>
    );
};
