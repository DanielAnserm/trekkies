import { Spinner } from "@heroui/react";
import { useLocation, useNavigate } from "react-router";
import { usePseudoContext } from "../context/PseudoContext";
import { useEffect } from "react";
import { FirstLoginPage } from "~/features/login/FirstLoginPage";

type Props = {
    children: React.ReactNode;
};

export const FirstLoginGuard = ({ children }: Props) => {
    const { needsFirstLogin, sync } = usePseudoContext();
    const navigate = useNavigate();
    const location = useLocation();

    // Pendant le chargement
    if (sync) {
        return (
            <main className="flex flex-col gap-4 items-center justify-center h-full w-full grow-1 mx-auto">
                <Spinner size="lg" color="secondary" />
            </main>
        );
    }

    // Si on a besoin de first login et qu'on n'y est pas, afficher un spinner
    if (needsFirstLogin) {
        return (
            <main className="flex flex-col gap-4 items-center justify-center h-full w-full grow-1 mx-auto">
                <FirstLoginPage />
            </main>
        );
    }

    return <>{children}</>;
};
