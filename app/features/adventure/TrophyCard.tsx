import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Profile } from "~/models/game";
import { TrophyItem } from "./TrophyItem";
type Props = {
    profile?: Profile;
};

export const TROPHIES = [
    {
        key: "orientation",
        img: "/images/trophy/orientation.png",
        imgLocked: "/images/trophy/orientation-locked.png",
    },
    {
        key: "validation",
        img: "/images/trophy/validation.png",
        imgLocked: "/images/trophy/validation-locked.png",
    },
    {
        key: "postulation",
        img: "/images/trophy/postulation.png",
        imgLocked: "/images/trophy/postulation-locked.png",
    },
    {
        key: "sommet",
        img: "/images/trophy/sommet.png",
        imgLocked: "/images/trophy/sommet-locked.png",
    },
];

export const TrophyCard = ({ profile }: Props) => {
    const { t } = useTranslation();
    const trophyUnlockCount = profile?.trophies?.length || 0;
    const trophies = useMemo(() => {
        if (!profile?.trophies) {
            return TROPHIES.map((t) => ({ ...t, unlock: false }));
        }
        return TROPHIES.map((t) => ({
            ...t,
            unlock: profile.trophies?.includes(t.key),
        }));
    }, [profile?.trophies]);

    return (
        <Card
            shadow="none"
            className="text-left bg-primary-50 text-primary-800"
        >
            <CardHeader className="pb-1">
                <h3 className="font-bold">{t("profile.trophy.title")}</h3>
                <span className="ml-1 text-tiny">
                    {t("profile.trophy.trophyUnlock", {
                        total: 4,
                        unlock: trophyUnlockCount,
                    })}
                </span>
            </CardHeader>
            <CardBody className="pt-1 text-small text-primary-800">
                <ul className="grid grid-cols-[repeat(auto-fit,minmax(4rem,1fr))] md:grid-cols-4 gap-4 mx-2">
                    {trophies?.map((trophy) => (
                        <li key={trophy.key}>
                            <TrophyItem trophy={trophy} />
                        </li>
                    ))}
                </ul>
            </CardBody>
            <CardFooter>
                <p className="text-tiny">{t("home.trophy.footer")}</p>
            </CardFooter>
        </Card>
    );
};
