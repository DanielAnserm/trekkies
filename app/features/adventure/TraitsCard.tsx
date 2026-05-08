import { Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import type { Profile } from "~/models/game";

type Props = {
    profile: Profile;
};

export const TraitsCard = ({ profile }: Props) => {
    const { t } = useTranslation();
    const traitCount = profile?.traits ? Object.keys(profile.traits).length : 0;

    return (
        <Card shadow="none" className="text-left bg-primary-50 text-primary-800">
            <CardHeader className="pb-1">
                <h3 className="font-bold">{t("profile.traits", { count: traitCount })}</h3>
            </CardHeader>
            <CardBody className="pt-1 text-primary-800 text-small">
                {profile?.traits && Object.keys(profile?.traits)?.length > 0 ? (
                    Object.entries(profile?.traits).map(([trait, value]) => (
                        <dl key={trait} className="flex flex-wrap">
                            <dt className="font-semibold">
                                {t(`profile.traits.${trait}.name`, { defaultValue: trait })}&nbsp;:
                            </dt>
                            <dd className="ml-2">{t(`profile.traits.${trait}.description`, { defaultValue: value })}</dd>
                        </dl>
                    ))
                ) : (
                    <p className="italic text-primary-700">{t("profile.traits.none")}</p>
                )}
            </CardBody>
        </Card>
    );
};
