import { ArrowDownLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { Chip } from "@heroui/react";
import React, { useMemo } from "react";

enum ChangeType {
    Positive = "positive",
    Negative = "negative",
    Neutral = "neutral",
}
const ChangeStatIcon = ({ changeType }: { changeType: ChangeType }) => {
    switch (changeType) {
        case ChangeType.Positive:
            return <ArrowUpRightIcon className="h-3" />;
        case ChangeType.Negative:
            return <ArrowDownLeftIcon className="h-3" />;
        case ChangeType.Neutral:
            return <ArrowRightIcon className="h-3" />;
        default:
            return null;
    }
};

export const InfoStatUpdateChip = ({ before, after }: { before: number; after: number }) => {
    const diff = after - before;
    const changeType: ChangeType = useMemo(() => {
        if (diff > 0) return ChangeType.Positive;
        if (diff == 0) return ChangeType.Neutral;
        return ChangeType.Negative;
    }, [before, after]);

    return (
        <Chip
            size="sm"
            radius="full"
            className={"absolute right-2 top-1.5"}
            classNames={{
                content: "font-semibold text-[0.65rem]",
            }}
            variant="flat"
            startContent={<ChangeStatIcon changeType={changeType} />}
            color={changeType === ChangeType.Positive ? "success" : changeType === ChangeType.Neutral ? "warning" : "danger"}
        >
            {Math.abs(diff * -1)}
        </Chip>
    );
};
