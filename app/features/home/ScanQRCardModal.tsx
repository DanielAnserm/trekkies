import { Modal, ModalContent, useDisclosure } from "@heroui/react";
import { ManualQRCodeContent } from "./ManualQRCodeContent";
import { ScannerQRCodeContent } from "./ScannerQRCodeContent";
import { useNavigate } from "react-router";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export const ScanQRCardModal = ({ isOpen, onClose }: Props) => {
    const navigate = useNavigate();
    const { isOpen: isOpenManualInput, onClose: onCloseManualInput, onOpen: onOpenManualInput } = useDisclosure();

    const handleOnClose = () => {
        onCloseManualInput();
        onClose();
    };

    const handleSubmitScenario = (categoryId: string) => {
        onCloseManualInput();
        navigate(`/game?category=${categoryId}`);
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={handleOnClose}
            classNames={{ base: "bg-gray-50 min-h-96" }}
            backdrop="blur"
            hideCloseButton
        >
            <ModalContent>
                {isOpenManualInput ? (
                    <ManualQRCodeContent
                        onClose={handleOnClose}
                        onCloseManualInput={onCloseManualInput}
                        onSubmit={handleSubmitScenario}
                    />
                ) : (
                    <ScannerQRCodeContent
                        onSubmitScenario={handleSubmitScenario}
                        onClose={handleOnClose}
                        onOpenManualInput={onOpenManualInput}
                    />
                )}
            </ModalContent>
        </Modal>
    );
};