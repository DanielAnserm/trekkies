import { QrCodeIcon } from "@heroicons/react/24/outline";
import { Button, Link, useDisclosure } from "@heroui/react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import { LayoutCard, LayoutCardBody, LayoutCardHeader } from "~/components/common/LayoutCard";
import { ScanQRCardModal } from "./ScanQRCardModal";
import { UpdatePseudoModal } from "../pseudo/UpdatePseudoModal";
import { GlobalStatsManager } from "~/infrastructure/utils/stats/GlobalStatsManager";
import { useEffect, useMemo, useState } from "react";
import { type PlayerStats, type Profile } from "~/models/game";
import { usePseudoContext } from "~/infrastructure/context/PseudoContext";
import { adventureService } from "~/infrastructure/services/adventureService";
import { PlayerProfileCard } from "./PlayerProfileCard";

type Props = {};

export const HomePage = (props: Props) => {
    const { t } = useTranslation();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { isOpen: isPseudoModalOpen, onClose: onClosePseudoModal, onOpen: onOpenPseudoModal } = useDisclosure();
    const globalStatsManager = useMemo(() => new GlobalStatsManager(), []);
    const { userProfile } = usePseudoContext();
    const [entry, setEntry] = useState<{
        pseudonym: string;
        totalScore: number;
        totalScenarios: number;
        stats: PlayerStats;
        profile?: Profile;
        hasOngoingScenario: boolean;
    }>();

    useEffect(() => {
        const loadProfile = async () => {
            const currentProgress = await globalStatsManager.getPlayerProgress();
            const playerStat = currentProgress;
            const profile = userProfile;
            const totalScore = calculateTotalScore(playerStat.currentStats);
            const hasOngoingScenario = await adventureService.hasOngoingScenario();
            setEntry({
                pseudonym: profile?.pseudonym?.trim() || "",
                totalScore,
                stats: playerStat.currentStats,
                totalScenarios: playerStat.totalScenarios,
                profile: currentProgress.profile,
                hasOngoingScenario,
            });
        };

        // Charger au montage
        loadProfile();

        // Recharger toutes les 10 secondes pour voir les mises à jour
        const interval = setInterval(loadProfile, 10000);

        // Écouter les changements dans localStorage (pour les mises à jour depuis d'autres onglets)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "trekkie_global_stats" || e.key === null) {
                loadProfile();
            }
        };
        window.addEventListener("storage", handleStorageChange);

        return () => {
            clearInterval(interval);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [globalStatsManager, userProfile]);

    const calculateTotalScore = (stats: PlayerStats): number => {
        return Object.values(stats).reduce((sum, val) => sum + val, 0);
    };

    return (
        <>
            <LayoutCard>
                <LayoutCardHeader>
                    <h2>
                        {t("home.title", {
                            pseudo: userProfile?.pseudonym || t("common.anonymousPlayer"),
                        })}
                    </h2>
                </LayoutCardHeader>
                <LayoutCardBody>
                    <Markdown>{t("home.description")}</Markdown>
                    <div className="flex flex-col gap-2 text-center">
                        {entry?.hasOngoingScenario && (
                            <>
                                <Button fullWidth color="primary" variant="solid" as={Link} href="/game">
                                    {t("home.continuePartyButton")}
                                </Button>
                                <span className="text-default-800 text-tiny font-semibold">{t("home.or")}</span>
                            </>
                        )}
                        <Button color="secondary" startContent={<QrCodeIcon className="h-6 w-6" />} onPress={onOpen}>
                            {t("home.scanButton")}
                        </Button>
                    </div>
                    <ScanQRCardModal isOpen={isOpen} onClose={onClose} />
                    {entry && !entry.profile?.isNewProfile && (
                        <PlayerProfileCard pseudonym={entry.pseudonym} stats={entry.stats} profile={entry.profile} />
                    )}
                    {/* {entry?.profile?.isNewProfile && (
                        <Button
                            color="secondary"
                            variant="bordered"
                            startContent={<PencilSquareIcon className="h-5" />}
                            onPress={onOpenPseudoModal}
                            className="whitespace-normal"
                        >
                            {t("home.customPseudoButton")}
                        </Button>
                    )} */}
                </LayoutCardBody>
            </LayoutCard>
            <UpdatePseudoModal isOpen={isPseudoModalOpen} onClose={onClosePseudoModal} />
        </>
    );
};
