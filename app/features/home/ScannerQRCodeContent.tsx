import { Button, ModalBody, ModalFooter, ModalHeader } from "@heroui/react";
import { QRScanAnimation } from "./QRScanAnimation";
import { Html5QrcodePlugin } from "./Html5QrcodePlugin";
import { useTranslation } from "react-i18next";

type ScannerQRCodeContentProps = {
    onOpenManualInput: () => void;
    onSubmitScenario: (code: string) => void;
    onClose: () => void;
};

export const ScannerQRCodeContent = ({ onClose, onOpenManualInput, onSubmitScenario }: ScannerQRCodeContentProps) => {
    const { t } = useTranslation();

    const handleSuccess = (scenario: string) => {
        onSubmitScenario(scenario);
        onClose();
    };

    return (
        <>
            <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-gray-800">{t("qr.scanner.title")}</h3>
            </ModalHeader>
            <ModalBody>
                <p className="text-gray-600 text-sm">{t("qr.scanner.description")}</p>
                <QRScanAnimation />
                <Html5QrcodePlugin onScanSuccess={handleSuccess} />
            </ModalBody>
            <ModalFooter className="flex justify-end gap-2">
                <Button color="secondary" variant="bordered" onPress={onClose} fullWidth>
                    {t("qr.scanner.close")}
                </Button>
                <Button color="secondary" fullWidth onPress={onOpenManualInput}>
                    {t("qr.scanner.manualEntry")}
                </Button>
            </ModalFooter>
        </>
    );
};
