import { TrophyIcon } from "@heroicons/react/24/outline";
import { Button, CardBody, Form, Input, Link, Spacer, Spinner } from "@heroui/react";
import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import { LayoutCard, LayoutCardBody, LayoutCardHeader } from "~/components/common/LayoutCard";
import { usePseudoContext } from "~/infrastructure/context/PseudoContext";
import { firestoreService } from "~/services/firestoreService";
import { PlayerProfileCard } from "~/features/home/PlayerProfileCard";
import { GlobalStatsManager } from "~/infrastructure/utils/stats/GlobalStatsManager";
import type { PlayerStats, Profile } from "~/models/game";

type Props = {};
const REDIRECT_TO = import.meta.env.VITE_ENDGAME_REDIRECTTO;

export const EndGameCard = (props: Props) => {
    const { t } = useTranslation();
    const { userProfile } = usePseudoContext();
    const [isRedirecting, setIsRedireting] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [profileData, setProfileData] = useState<{
        pseudonym: string;
        stats: PlayerStats;
        profile?: Profile;
    } | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        const email = data.email as string;
        if (userProfile && email) {
            await firestoreService.setDocument("userEmails", userProfile.uid, {
                email,
            });
        }
        setIsRedireting(true);
    };

    // Charger le profil au montage
    useEffect(() => {
        const loadProfile = async () => {
            try {
                setIsLoadingProfile(true);
                const globalStatsManager = new GlobalStatsManager();
                const progress = await globalStatsManager.getPlayerProgress();

                setProfileData({
                    pseudonym: userProfile?.pseudonym?.trim() || "",
                    stats: progress.currentStats,
                    profile: progress.profile,
                });
            } catch (error) {
                console.error("Failed to load profile:", error);
            } finally {
                setIsLoadingProfile(false);
            }
        };

        loadProfile();
    }, [userProfile]);

    useEffect(() => {
        if (!isRedirecting) {
            return;
        }
        // Décompte (optionnel, pour afficher le temps restant)
        // setCountdown((prev) => prev - 1);
        const countdownInterval = setInterval(() => {
            setCountdown((prev) => (prev - 1 > 0 ? prev - 1 : 0));
        }, 1000);

        // Redirection après 1 seconde
        const redirectTimer = setTimeout(() => {
            window.location.href = REDIRECT_TO;
        }, 3500);

        // Nettoyage
        return () => {
            clearInterval(countdownInterval);
            clearTimeout(redirectTimer);
        };
    }, [isRedirecting]);
    return (
        <LayoutCard>
            <LayoutCardHeader>
                <h1>{t("endGame.title")}</h1>
            </LayoutCardHeader>
            <CardBody className="gap-2 text-center">
                <Markdown>{t("endGame.startDescription")}</Markdown>

                {/* Afficher le profil du joueur */}
                {!isLoadingProfile && profileData && (
                    <div>
                        <PlayerProfileCard
                            pseudonym={profileData.pseudonym}
                            stats={profileData.stats}
                            profile={profileData.profile}
                        />
                    </div>
                )}
                <Spacer />
                <Markdown>{t("endGame.endDescription")}</Markdown>
                {isRedirecting ? (
                    <div className="mx-auto my-auto">
                        <Spinner
                            variant="wave"
                            color="secondary"
                            label={t("endGame.redirectionCountdown", {
                                count: countdown,
                            })}
                        />
                        {countdown < 1 ? (
                            <Button
                                as={Link}
                                size="sm"
                                color="secondary"
                                variant="light"
                                href={REDIRECT_TO}
                                className="w-full max-w-2xs mx-auto mt-1 "
                            >
                                {t("endGame.form.buttonSubmit.label")}
                            </Button>
                        ) : null}
                    </div>
                ) : (
                    <>
                        <Form method="get" onSubmit={handleSubmit} className="flex flex-col gap-4 w-full mx-auto h-full">
                            <Input size="sm" type="email" label={t("endGame.form.email.label")} name="email" />
                            <Button type="submit" size="lg" color="primary" className="w-full max-w-2xs mx-auto">
                                {t("endGame.form.buttonSubmit.label")}
                            </Button>
                            <Button
                                size="md"
                                color="secondary"
                                as={Link}
                                variant="light"
                                className="w-full max-w-2xs mx-auto"
                                href="/leaderboard"
                                startContent={<TrophyIcon className="w-4 h-4" />}
                            >
                                {t("endGame.buttonLeaderboard.label")}
                            </Button>
                        </Form>
                    </>
                )}
            </CardBody>
        </LayoutCard>
    );
};
