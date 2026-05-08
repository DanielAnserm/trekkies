import { Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import type { Profile } from "~/models/game";

type Props = {
    profile: Profile;
};

export const StatisticsCard = ({ profile }: Props) => {
    const { t } = useTranslation();

    if (!profile?.statistics) {
        return null;
    }

    return (
        <Card shadow="none" className="text-left bg-secondary-50 text-secondary-600">
            <CardHeader className="pb-1">
                <h3 className="font-bold">{t("profile.statisticsTitle")}</h3>
            </CardHeader>
            <CardBody className="pt-1 text-secondary-500 text-small">
                <dl>
                    {Object.entries(profile?.statistics).map(([stat, value]) => (
                        <div key={stat} className="flex">
                            <dt className="font-semibold">
                                {t(`profile.statistics.${stat}`, { defaultValue: stat })}&nbsp;:
                            </dt>
                            <dd className="ml-2">{value}</dd>
                        </div>
                    ))}
                </dl>
            </CardBody>
        </Card>
    );
};
