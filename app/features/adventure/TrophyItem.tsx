import {
    Avatar,
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import Markdown from "react-markdown";

export type TrophyItem = {
    key: string;
    img: string;
    imgLocked: string;
    unlock?: boolean;
};

type Props = { trophy: TrophyItem };

export const TrophyItem = ({ trophy }: Props) => {
    const { t } = useTranslation();
    return (
        <Popover key={trophy.key} showArrow size="sm">
            <PopoverTrigger>
                <Button
                    className="flex flex-col items-center gap-1.5 h-auto"
                    variant="light"
                >
                    <Avatar
                        src={trophy.unlock ? trophy.img : trophy.imgLocked}
                        color="default"
                        size="md"
                        fallback={<></>}
                    ></Avatar>
                    <div
                        className={classNames("text-primary-700 text-tiny", {
                            "font-semibold": trophy.unlock,
                        })}
                    >
                        {t(`trophy.${trophy.key}.title`, {
                            defaultValue: trophy.key,
                        })}
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-sm">
                <div className="px-1 py-2 flex flex-col gap-1.5">
                    <div className="text-small font-bold">
                        {t(`trophy.${trophy.key}.popover.title`)}
                    </div>
                    <div className="text-tiny flex flex-col gap-1">
                        <Markdown>
                            {t(`trophy.${trophy.key}.popover.description`)}
                        </Markdown>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};
