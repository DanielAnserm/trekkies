import { Button, Form, Input, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { usePseudoContext } from "~/infrastructure/context/PseudoContext";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export const UpdatePseudoModal = ({ onClose, isOpen }: Props) => {
    const { t } = useTranslation();
    const { userProfile, loading, sync, setPseudo } = usePseudoContext();
    const handleSetPseudo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));

        const pseudonym = data["pseudo"]?.toString()?.trim();
        console.log("Pseudonyme entré:", pseudonym);

        try {
            await setPseudo(pseudonym);
            onClose();
        } catch (error) {}
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>
                    <h2>{t("pseudo.form.title")}</h2>
                </ModalHeader>
                <ModalBody>
                    <Form className="w-full flex flex-col gap-4  mx-auto" onSubmit={handleSetPseudo}>
                        <Input
                            errorMessage={t("pseudo.form.username.required")}
                            label={t("pseudo.form.username.label")}
                            labelPlacement="outside-top"
                            name="pseudo"
                            defaultValue={userProfile?.pseudonym || ""}
                            type="text"
                            size="lg"
                            maxLength={50}
                            isDisabled={loading || sync}
                        />

                        <Button
                            type="submit"
                            size="lg"
                            isDisabled={loading || sync}
                            color="primary"
                            className="w-full mt-10 animate-appearance-in"
                        >
                            {t("pseudo.form.submit.label")}
                        </Button>
                        <Button variant="light" onPress={onClose} className="w-full">
                            {t("pseudo.form.cancel.label", { defaultValue: "Annuler" })}
                        </Button>
                    </Form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
