import { type CameraDevice, Html5Qrcode, type Html5QrcodeCameraScanConfig } from "html5-qrcode";
import { use, useEffect, useLayoutEffect, useRef, useState, type Key } from "react";
import { addToast, Button, Chip, Select, SelectItem, Spinner, toast, type SharedSelection } from "@heroui/react";
import { QRScanAnimation } from "./QRScanAnimation";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const qrcodeRegionId = "qr-reader";

type Props = {
    onScanSuccess?: (scenario: string) => void;
};

export const Html5QrcodePlugin = ({ onScanSuccess = () => {} }: Props) => {
    const { t } = useTranslation();
    const [isScanning, setIsScanning] = useState(false);
    const [isCodeInvalid, setIsCodeInvalid] = useState(false);
    const [scannedResult, setScannedResult] = useState<any>();
    const [cameras, setCameras] = useState<CameraDevice[]>([]);
    const [selectedCamera, setSelectedCamera] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const html5QrCodeRef = useRef<Html5Qrcode>(null);
    const resultFound = scannedResult !== undefined && scannedResult !== null;

    const scanRef = useRef<HTMLDivElement>(null);
    const onNewScanResult = (decodedText: string, decodedResult: any) => {
        if (resultFound) {
            return;
        }
        const result = isValidCode(decodedText);
        if (result.isValid) {
            html5QrCodeRef.current?.pause(true);
            const newResult = {
                id: Date.now(),
                text: decodedText,
                timestamp: new Date().toLocaleString(),
                format: decodedResult.result.format?.formatName || "QR_CODE",
            };
            setScannedResult(newResult);
            setTimeout(() => {
                stopScanning();
                onScanSuccess(result.categoryId!);
            }, 2000);
        } else {
            setIsCodeInvalid(true);
            html5QrCodeRef.current?.pause();
            setTimeout(() => {
                setIsCodeInvalid(false);
                html5QrCodeRef.current?.resume();
            }, 2000);
        }
    };
    const startScanning = async () => {
        if (!selectedCamera) {
            setError(t("qr.scanner.noCamera"));
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const html5QrCode = new Html5Qrcode(qrcodeRegionId);
            html5QrCodeRef.current = html5QrCode;
            const config: Html5QrcodeCameraScanConfig = {
                fps: 10,
                aspectRatio: 4 / 3,
            };

            await html5QrCode.start(selectedCamera, config, onNewScanResult, (errorMessage) => {
                // Handle scan errors silently
            });

            setIsScanning(true);
        } catch (err) {
            setError(t("qr.scanner.errorStarting") + ": " + err);
        } finally {
            setIsLoading(false);
        }
    };

    const stopScanning = async () => {
        if (html5QrCodeRef?.current) {
            try {
                html5QrCodeRef.current.pause(true);
                await html5QrCodeRef.current.stop();
                html5QrCodeRef.current.clear();
                html5QrCodeRef.current = null;
                setIsScanning(false);
            } catch (err) {
                console.error("Error stopping scanner:", err);
            }
        }
    };

    const isValidCode = (text: string) => {
        try {
            const url = new URL(text);
            if ((url.protocol !== "http:" && url.protocol !== "https:") || url.host !== window.location.host) {
                throw new Error("Invalid URL");
            }

            const categoryId = url.searchParams.get("category");

            return {
                isValid: categoryId !== null && categoryId !== undefined && categoryId.length > 0,
                categoryId: categoryId,
            };
        } catch {
            return { isValid: false, categoryId: null };
        }
    };

    useEffect(() => {
        // Get available cameras
        Html5Qrcode.getCameras()
            .then((devices) => {
                if (devices && devices.length) {
                    setCameras(devices);
                    const camera =
                        devices.find((c) => c.label.includes("back") || c.label.includes("environment")) || devices[0];
                    setSelectedCamera(camera.id);
                }
            })
            .catch((err: DOMException) => {
                if (err.name === "NotAllowedError") {
                    setError(t("qr.scanner.cameraPermissionDenied"));
                } else {
                    setError(t("qr.scanner.cameraAccessError"));
                }
                setIsLoading(false);
            });

        return () => {
            stopScanning();
        };
    }, [t]);

    useEffect(() => {
        if (isScanning) {
            stopScanning().then(() => {
                startScanning();
            });
        } else {
            startScanning();
        }
    }, [selectedCamera]);

    const [rotation, setRotation] = useState(0);
    const handleToggleCamera = () => {
        const current = cameras.findIndex((x) => x.id === selectedCamera);
        const next = cameras.length <= current + 1 ? 0 : current + 1;
        setSelectedCamera(cameras[next].id);
        setRotation((prev) => prev + 360);
    };
    return (
        <>
            <div className="w-full relative bg-secondary-800 rounded-medium p-6 aspect-[4/3]">
                <div id={qrcodeRegionId} />
                {isScanning && (
                    <QRScanAnimation isSuccess={resultFound} isScanning={isScanning} isCodeInvalid={isCodeInvalid} />
                )}
                {cameras.length > 1 ? (
                    <div className="absolute bottom-8 right-8">
                        <Button isIconOnly variant="shadow" color="primary" onPress={handleToggleCamera}>
                            <motion.div
                                animate={{ rotate: rotation }}
                                transition={{
                                    duration: 1,
                                    ease: [0.4, 0, 0.2, 1],
                                }}
                            >
                                <ArrowPathIcon className="h-5 text-current" />
                            </motion.div>
                        </Button>
                    </div>
                ) : null}

                {isLoading && (
                    <div className="absolute text-secondary-foreground inset-0 flex items-center justify-center">
                        <Chip color="primary" endContent={<Spinner size="sm" color="current" variant="dots" />}>
                            {t("qr.scanner.loadingCamera")}
                        </Chip>
                    </div>
                )}
                {error && !isLoading && (
                    <div className="absolute text-secondary-foreground inset-0 flex flex-col gap-3 items-center justify-center">
                        <Chip color="danger">{error}</Chip>
                    </div>
                )}
            </div>
        </>
    );
};
