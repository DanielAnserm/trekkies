import { QuestionMarkCircleIcon, UserIcon } from "@heroicons/react/24/outline";
import {
    Avatar,
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Progress,
    useDisclosure,
} from "@heroui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { STAT_ICONS, StatKeys, type PlayerStats, type Profile } from "~/models/game";
import { GoalCard } from "../adventure/GoalCard";
import { TrophyCard } from "../adventure/TrophyCard";
import { CharacteristicsModal } from "./CharacteristicsModal";
import { ProfilDescriptionModal } from "./ProfilDescriptionModal";
import { useAuthContext } from "~/infrastructure/context/AuthContext";

type PlayerProfileCardProps = {
    pseudonym: string;
    stats: PlayerStats;
    profile?: Profile;
};

export const PlayerProfileCard = ({ pseudonym, stats, profile }: PlayerProfileCardProps) => {
    const { t } = useTranslation();
    const { user } = useAuthContext();
    const [avatarClickCount, setAvatarClickCount] = useState(0);
    const { isOpen: isCharModalOpen, onClose: onCloseCharModal, onOpen: onOpenCharModal } = useDisclosure();
    const {
        isOpen: isProfilDescModalOpen,
        onClose: onCloseProfilDescModal,
        onOpen: onOpenProfilDescModal,
    } = useDisclosure();
    const { isOpen: isUidModalOpen, onClose: onCloseUidModal, onOpen: onOpenUidModal } = useDisclosure();

    const getStatIcon = (stat: StatKeys) => {
        return STAT_ICONS[stat];
    };

    const getStatColor = (value: number, max: number = 10) => {
        const percentage = (value / max) * 100;
        if (percentage >= 80) return "primary";
        if (percentage >= 60) return "secondary";
        if (percentage >= 20) return "warning";
        return "default";
    };

    const handleAvatarClick = () => {
        const newCount = avatarClickCount + 1;
        setAvatarClickCount(newCount);

        if (newCount >= 10) {
            onOpenUidModal();
            setAvatarClickCount(0); // Reset counter
        }
    };

    return (
        <Card className="border-2 border-primary" shadow="sm">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center w-full gap-2">
                    <div className="flex items-center gap-3">
                        <Avatar
                            size="md"
                            className="max-sm:hidden cursor-pointer"
                            name={pseudonym || t("common.anonymousPlayer")}
                            fallback={<UserIcon className="h-5 w-5" />}
                            onClick={handleAvatarClick}
                        />

                        <div className="text-left">
                            <p className="font-semibold text-default-900">{pseudonym || t("common.anonymousPlayer")}</p>
                            {profile?.profileId && (
                                <div className="flex items-center gap-1 text-xs text-default-600">
                                    <span className="font-medium">{t("home.playerProfile")}</span>
                                    <Button size="sm" color="secondary" variant="flat" radius="full" onPress={onOpenProfilDescModal}>
                                        {profile.profileName}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <Button color="secondary" variant="flat" size="sm" radius="full" isIconOnly onPress={onOpenCharModal}>
                            <QuestionMarkCircleIcon className="h-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardBody className="pt-0">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-small flex items-center gap-1">
                            {getStatIcon(StatKeys.Character)} {t("home.playerCard.stats.character")}
                        </span>
                        <div className="flex items-center gap-2">
                            <Progress value={(stats.character / 10) * 100} className="w-20" size="sm" color={getStatColor(stats.character)} />
                            <span className="text-small font-semibold w-6 text-right  whitespace-nowrap">
                                {stats.character}
                                <span className="text-tiny font-medium text-default-800">/10</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-small flex items-center gap-1">
                            {getStatIcon(StatKeys.Skills)} {t("home.playerCard.stats.skills")}
                        </span>
                        <div className="flex items-center gap-2">
                            <Progress value={(stats.skills / 10) * 100} className="w-20" size="sm" color={getStatColor(stats.skills)} />
                            <span className="text-small font-semibold w-6 text-right whitespace-nowrap">
                                {stats.skills}
                                <span className="text-tiny font-medium text-default-800">/10</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-small flex items-center gap-1">
                            {getStatIcon(StatKeys.Context)} {t("home.playerCard.stats.context")}
                        </span>
                        <div className="flex items-center gap-2">
                            <Progress value={(stats.context / 10) * 100} className="w-20" size="sm" color={getStatColor(stats.context)} />
                            <span className="text-small font-semibold w-6 text-right whitespace-nowrap">
                                {stats.context}
                                <span className="text-tiny font-medium text-default-800">/10</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-small flex items-center gap-1">
                            {getStatIcon(StatKeys.Experience)} {t("home.playerCard.stats.experience")}
                        </span>
                        <div className="flex items-center gap-2">
                            <Progress value={(stats.experience / 10) * 100} className="w-20" size="sm" color={getStatColor(stats.experience)} />
                            <span className="text-small font-semibold w-6 text-left whitespace-nowrap">{stats.experience}</span>
                        </div>
                    </div>
                </div>
                {profile && (
                    <>
                        <Divider className="my-3" />
                        <div className="flex flex-col gap-3">
                            <GoalCard profile={profile} />
                            <Divider />
                            <TrophyCard profile={profile} />
                        </div>
                    </>
                )}
            </CardBody>
            <CharacteristicsModal isOpen={isCharModalOpen} onClose={onCloseCharModal} />
            <ProfilDescriptionModal isOpen={isProfilDescModalOpen} onClose={onCloseProfilDescModal} />
            {/* Modal UID */}
            <Modal isOpen={isUidModalOpen} onClose={onCloseUidModal} isDismissable={false}>
                <ModalContent>
                    <ModalHeader>
                        <h3 className="text-lg font-semibold">Identifiant du joueur</h3>
                    </ModalHeader>
                    <ModalBody>
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <p className="text-sm font-mono text-gray-700 break-all">{user?.uid || "UID non disponible"}</p>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onPress={onCloseUidModal}>
                            Fermer
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Card>
    );
};
