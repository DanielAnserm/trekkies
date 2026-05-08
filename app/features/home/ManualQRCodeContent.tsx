import { ChevronLeftIcon, QrCodeIcon } from "@heroicons/react/24/outline";
import { Button, Form, Input, ModalBody, ModalFooter, ModalHeader } from "@heroui/react";
import { useId, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

type ManualQRCodeContentProps = {
    onCloseManualInput: () => void;
    onSubmit: (categoryId: string) => void;
    onClose: () => void;
};

export const ManualQRCodeContent = ({ onClose, onCloseManualInput, onSubmit }: ManualQRCodeContentProps) => {
    const { t } = useTranslation();
    const [code, setCode] = useState("");
    const [isSubbmitting, setIsSubmitting] = useState(false);
    const isCodeInvalid = code.trim().length === 0;
    const formId = useId();

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (isCodeInvalid) {
            return;
        }
        onSubmit(code.trim());
        onClose();
    };

    return (
        <>
            <ModalHeader className="flex items-center gap-2">
                <Button isIconOnly variant="light" color="secondary" size="sm" onPress={onCloseManualInput}>
                    <ChevronLeftIcon className="h-5 w-5 stroke-2" />
                </Button>
                <h3 className="text-lg font-semibold text-gray-800">{t("qr.manual.title")}</h3>
            </ModalHeader>
            <ModalBody>
                <Form id={formId} onSubmit={handleOnSubmit} className="w-full flex flex-col gap-4">
                    <Input
                        variant="bordered"
                        size="lg"
                        classNames={{ label: "text-gray-600 p-0 m-0 text-sm", base: "gap-3", mainWrapper: "aspect-[4/3]" }}
                        label={t("qr.manual.label")}
                        labelPlacement="outside-top"
                        startContent={<QrCodeIcon className="text-gray-400 h-5 w-5" />}
                        placeholder={t("qr.manual.placeholder")}
                        onChange={(e) => setCode(e.target.value)}
                    />
                </Form>
            </ModalBody>
            <ModalFooter className="flex justify-end gap-2">
                <Button color="secondary" variant="bordered" onPress={onClose} fullWidth>
                    {t("qr.manual.close")}
                </Button>
                <Button
                    color="secondary"
                    fullWidth
                    type="submit"
                    isDisabled={isCodeInvalid || isSubbmitting}
                    isLoading={isSubbmitting}
                    form={formId}
                >
                    {t("qr.manual.validate")}
                </Button>
            </ModalFooter>
        </>
    );
};