import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ScrollShadow,
} from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import { profileService } from "~/infrastructure/services/profileService";
import { GlobalStatsManager } from "~/infrastructure/utils/stats/GlobalStatsManager";
import { STAT_ICONS, StatKeys } from "~/models/game";
import type { ProfileConfig } from "~/models/profile";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export const ProfilDescriptionModal = ({ isOpen, onClose }: Props) => {
    const { t } = useTranslation();
    const globalStatsManager = useMemo(() => new GlobalStatsManager(), []);
    const [profile, setProfile] = useState<ProfileConfig | null>();
    const getProfil = useCallback(async () => {
        const profile = await globalStatsManager.getInitialProfile();
        return profile.profileId
            ? await profileService.getProfile(profile.profileId)
            : null;
    }, []);

    useEffect(() => {
        getProfil().then((p) => {
            setProfile(p);
        });
    }, []);
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            scrollBehavior="inside"
            placement="center"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {profile?.description.title}
                    </h2>
                </ModalHeader>
                <ModalBody className="gap-4 pb-6">
                    <ScrollShadow size={10} className="text-gray-600 text-sm">
                        <Markdown>{profile?.description.content}</Markdown>
                    </ScrollShadow>
                    <Button
                        color="secondary"
                        variant="bordered"
                        onPress={onClose}
                        className="mt-4"
                        fullWidth
                    >
                        {t("caracteristiques_joueur.continueButton")}
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
