import { Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import type { Profile } from "~/models/game";

type Props = {
    profile?: Profile;
};

export const GoalCard = ({ profile }: Props) => {
    const { t } = useTranslation();
    return (
        <Card shadow="none" className="text-left bg-default-100 text-default-foreground">
            <CardHeader className="pb-1">
                <h3 className="font-bold">{t("profile.goal.title")}</h3>
            </CardHeader>
            <CardBody className="pt-1 text-small">
                {profile?.goal ? profile?.goal : <p className="italic text-default-800">{t("profile.goal.none")}</p>}
            </CardBody>
        </Card>
    );
};
