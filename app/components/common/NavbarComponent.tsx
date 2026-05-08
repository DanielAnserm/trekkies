import { HomeIcon, QrCodeIcon, TrophyIcon } from "@heroicons/react/24/outline";
import { Button, Link, Tooltip, useDisclosure } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { ScanQRCardModal } from "~/features/home/ScanQRCardModal";

type Props = {};

export const NavbarComponent = (props: Props) => {
    const { t } = useTranslation();
    const { isOpen, onClose, onOpen } = useDisclosure();

    return (
        <div className="sticky z-50 bottom-4 mx-auto max-w-lg w-full px-4 mt-auto">
            <nav className="w-full rounded-full bg-background h-14 shadow-medium">
                <div className="grid h-full max-w-lg grid-cols-3 mx-auto">
                    <div className="inline-flex items-center justify-center ">
                        <Tooltip
                            content={t("navbar.tooltips.home")}
                            showArrow={true}
                        >
                            <Button
                                as={Link}
                                href="/"
                                isIconOnly
                                radius="full"
                                variant="light"
                                size="lg"
                            >
                                <HomeIcon className="w-6 h-6" />
                            </Button>
                        </Tooltip>
                    </div>
                    <div className="inline-flex items-center justify-center max-h-[3.5rem] h-full bg-background">
                        <div className="bg-inherit rounded-full">
                            <Button
                                isIconOnly
                                radius="full"
                                color="secondary"
                                size="lg"
                                className="w-[4.5rem] h-[4.5rem]"
                                onPress={onOpen}
                            >
                                <QrCodeIcon className="w-6 h-6" />
                            </Button>
                            <ScanQRCardModal
                                isOpen={isOpen}
                                onClose={onClose}
                            />
                        </div>
                    </div>

                    <div className="inline-flex items-center justify-center ">
                        <Tooltip
                            content={t("navbar.tooltips.leaderboard")}
                            showArrow={true}
                        >
                            <Button
                                as={Link}
                                href="/leaderboard"
                                isIconOnly
                                radius="full"
                                variant="light"
                                size="lg"
                            >
                                <TrophyIcon className="w-6 h-6" />
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </nav>
        </div>
    );
};
