import { CameraIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Chip, Spinner } from "@heroui/react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";

type Props = {
    isSuccess?: boolean;
    isScanning?: boolean;
    isCodeInvalid?: boolean;
};

const MotionChip = motion(Chip);

const viewfinderVariants: Variants = {
    scanning: {
        width: 150,
        height: 150,
        borderRadius: 15,
        borderColor: "#fff",
        borderStyle: "dashed",
        borderWidth: 3,
        backgroundColor: "transparent",
        scale: 1,
    },
    success: {
        width: 120,
        height: 120,
        borderRadius: 20,
        borderColor: "#aaca36",
        borderStyle: "solid",
        borderWidth: 4,
        backgroundColor: "#aaca362a",
        scale: 1,
        transition: {
            duration: 1.2,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    invalid: {
        width: 150,
        height: 150,
        borderRadius: 15,
        borderColor: "#f31260",
        borderStyle: "solid",
        borderWidth: 3,
        backgroundColor: "#f312602a",
        scale: 1,
        transition: {
            duration: 1.2,
            ease: [0.4, 0, 0.2, 1],
        },
    },
};

enum ScanState {
    Scanning = "scanning",
    Success = "success",
    Invalid = "invalid",
}

export const QRScanAnimation = ({ isSuccess, isScanning, isCodeInvalid }: Props) => {
    const { t } = useTranslation();
    const currentState = isSuccess
        ? ScanState.Success
        : isScanning && !isCodeInvalid
        ? ScanState.Scanning
        : ScanState.Invalid;
    return (
        <AnimatePresence>
            {isScanning && (
                <>
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-3"
                        variants={viewfinderVariants}
                        animate={currentState}
                    />
                    <ScanBox currentState={currentState} />

                    <div className="absolute inset-8 flex flex-col items-center justify-end ">
                        {currentState === ScanState.Success ? <ScanSuccessChip /> : null}
                        {currentState === ScanState.Scanning ? <ScanInfoChip /> : null}
                        {currentState === ScanState.Invalid ? <ScanErrorChip /> : null}
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

const ScanBox = ({ currentState }: { currentState: ScanState }) => {
    switch (currentState) {
        case ScanState.Success:
            return (
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    initial={{
                        opacity: 0,
                        scale: 0,
                        rotate: -180,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                    }}
                    transition={{
                        duration: 0.8,
                        ease: [0.34, 1.56, 0.64, 1],
                        delay: 0.3,
                    }}
                >
                    <motion.div
                        animate={{
                            rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                            duration: 0.6,
                            delay: 1,
                            ease: "easeInOut",
                        }}
                    >
                        <CheckIcon className="w-12 h-12 text-primary" strokeWidth={3} />
                    </motion.div>
                </motion.div>
            );
        case ScanState.Invalid:
            return (
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    initial={{
                        opacity: 0,
                        scale: 0,
                        rotate: -180,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                    }}
                    transition={{
                        duration: 0.8,
                        ease: [0.34, 1.56, 0.64, 1],
                        delay: 0.3,
                    }}
                >
                    <motion.div
                        animate={{
                            rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                            duration: 0.6,
                            delay: 1,
                            ease: "easeInOut",
                        }}
                    >
                        <XMarkIcon className="w-12 h-12 text-danger" strokeWidth={3} />
                    </motion.div>
                </motion.div>
            );
    }

    return (
        <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 1, scale: 1 }}
            exit={{
                opacity: 0,
                scale: 0.5,
                transition: { duration: 0.5 },
            }}
        >
            <CameraIcon className="w-16 h-16 text-white" />
        </motion.div>
    );
};

const ScanInfoChip = () => {
    const { t } = useTranslation();
    return (
        <MotionChip
            initial={{ opacity: 1, y: 0 }}
            exit={{
                opacity: 0,
                y: 20,
                transition: { duration: 0.5 },
            }}
            size="sm"
            color="default"
            endContent={<Spinner size="sm" color="current" variant="dots" />}
        >
            {t("qr.scanner.scanning")}
        </MotionChip>
    );
};

const ScanErrorChip = () => {
    const { t } = useTranslation();
    return (
        <MotionChip
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.6,
                delay: 0.4,
                ease: [0.34, 1.56, 0.64, 1],
            }}
            size="sm"
            color="danger"
        >
            {t("qr.scanner.invalid")}
        </MotionChip>
    );
};

const ScanSuccessChip = () => {
    const { t } = useTranslation();
    return (
        <MotionChip
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.6,
                delay: 0.4,
                ease: [0.34, 1.56, 0.64, 1],
            }}
            size="sm"
            color="primary"
        >
            {t("qr.scanner.detected")}
        </MotionChip>
    );
};
