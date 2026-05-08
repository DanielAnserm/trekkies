import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { useTranslation } from "react-i18next";
import type { Scenario } from "~/models/scenario";

type Props = {
    isOpen: boolean;
    currentScenario?: Scenario;
    newScenario: Scenario;
    onContinueExisting: () => void;
    onStartNew: () => void;
    onCancel: () => void;
};

export const ConflictModal = ({ isOpen, currentScenario, newScenario, onContinueExisting, onStartNew, onCancel }: Props) => {
    const { t } = useTranslation();
    return (
        <Modal isOpen={isOpen} onClose={onCancel}>
            <ModalContent>
                <ModalHeader>
                    <h2>{t("scenario.conflict.title", { defaultValue: "Scénario en cours" })}</h2>
                </ModalHeader>
                <ModalBody>
                    <p className="mb-4">
                        {t("scenario.conflict.description", {
                            defaultValue: "Vous avez déjà une partie en cours. Que souhaitez-vous faire ?",
                        })}
                    </p>
                    <div className="space-y-3">
                        <div className="p-3 bg-warning-50 border border-warning-200 rounded">
                            <p className="font-semibold text-warning-800">
                                {t("scenario.conflict.current", { defaultValue: "Scénario actuel" })} :
                            </p>
                            <p className="text-sm text-warning-700">{currentScenario?.title || t("scenario.unknownScenario")}</p>
                        </div>

                        <div className="p-3 bg-primary-50 border border-primary-200 rounded">
                            <p className="font-semibold text-primary-800">
                                {t("scenario.conflict.new", { defaultValue: "Nouveau scénario" })} :
                            </p>
                            <p className="text-sm text-primary-700">{newScenario.title}</p>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="flex-col">
                    <Button color="secondary" onPress={onContinueExisting}>
                        {t("scenario.conflict.continue", { defaultValue: "Continuer l'actuel" })}
                    </Button>
                    <Button color="danger" onPress={onStartNew}>
                        {t("scenario.conflict.startNew", { defaultValue: "Commencer le nouveau" })}
                    </Button>
                    <Button variant="light" onPress={onCancel}>
                        {t("scenario.conflict.cancel", { defaultValue: "Annuler" })}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
