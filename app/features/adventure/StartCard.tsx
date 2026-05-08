import { Button, useDisclosure } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useViewContext } from "~/infrastructure/context/ViewProvider";
import { UpdatePseudoModal } from "../pseudo/UpdatePseudoModal";
import { useGameContext } from "~/infrastructure/context/GameProvider";
import { useEffect } from "react";

type Props = {};

export const StartCard = (props: Props) => {
    const { t } = useTranslation();
    const { gameState } = useGameContext();
    const { profile } = gameState || {};
    const { navigateToProfile } = useViewContext();

    useEffect(() => {
        // if (profile?.isNewProfile) {
        navigateToProfile();
        // }
    }, [gameState]);

    const {
        isOpen: isPseudoModalOpen,
        onClose: onClosePseudoModal,
        onOpen: onOpenPseudoModal,
    } = useDisclosure();
    return (
        <>
            <p className="">{t("start.description")}</p>
            <p className="text-default-600">{t("start.ready")}</p>
            <div className="flex flex-col gap-4 items-center">
                <Button
                    onPress={navigateToProfile}
                    size="lg"
                    color="primary"
                    className="w-full max-w-2xs"
                >
                    {t("start.button.continue.label")}
                </Button>
                <Button
                    onPress={onOpenPseudoModal}
                    variant="light"
                    size="md"
                    color="secondary"
                >
                    {t("start.button.changePseudo.label")}
                </Button>
            </div>
            <UpdatePseudoModal
                isOpen={isPseudoModalOpen}
                onClose={onClosePseudoModal}
            />
        </>
    );
};
