import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import type { Profile } from "~/models/game";

type Props = {
    profile?: Profile;
};

export const InterestsCard = ({ profile }: Props) => {
    const { t } = useTranslation();
    const interestCount = profile?.interests?.length || 0;

    return (
        <Card shadow="none" className="text-left bg-warning-50 text-warning-800">
            <CardHeader className="pb-1">
                <h3 className="font-bold">{t("profile.interests", { count: interestCount })}</h3>
            </CardHeader>
            <CardBody className="pt-1 text-small">
                {profile?.interests && profile?.interests.length > 0 ? (
                    <ul className="flex flex-wrap gap-2">
                        {profile?.interests.map((interest, index) => (
                            <li key={index}>
                                <Chip color="warning" variant="flat">
                                    {t(`profile.interests.${interest}`, { defaultValue: interest })}
                                </Chip>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="italic text-warning-700">{t("profile.interests.none")}</p>
                )}
            </CardBody>
        </Card>
    );
};
