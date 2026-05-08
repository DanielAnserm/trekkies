import { Button, Modal, ModalBody, ModalContent, ModalHeader, ScrollShadow } from "@heroui/react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import { STAT_ICONS, StatKeys } from "~/models/game";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export const CharacteristicsModal = ({ isOpen, onClose }: Props) => {
    const { t } = useTranslation();

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside" placement="center">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <h2 className="text-lg font-semibold text-gray-800">{t("caracteristiques_joueur.title")}</h2>
                </ModalHeader>
                <ModalBody className="gap-4 pb-6">
                    <ScrollShadow size={10}>
                        <p className="text-gray-600 text-sm">{t("caracteristiques_joueur.description")}</p>

                        <div className="space-y-4 mt-2">
                            {Object.values(StatKeys).map((key) => (
                                <div key={key} className="p-3 rounded-lg bg-default-100 border-l-3 border-secondary">
                                    <div className="flex items-start gap-2">
                                        <span className="text-small">{STAT_ICONS[key]}</span>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-small mb-1">
                                                {t(`caracteristiques_joueur.characteristics.${key}.name`)}
                                            </h3>
                                            <p className="text-default-700 text-tiny">
                                                {t(`caracteristiques_joueur.characteristics.${key}.description`)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollShadow>
                    <Button color="secondary" variant="bordered" onPress={onClose} className="mt-4" fullWidth>
                        {t("caracteristiques_joueur.continueButton")}
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
