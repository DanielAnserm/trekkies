import { Spinner } from "@heroui/react";
import { usePseudoContext } from "../context/PseudoContext";
import { EndGameCard } from "~/features/endGame/EndGameCard";
import { useLocation } from "react-router";

type Props = {
    children: React.ReactNode;
};

export const EndGameGuard = ({ children }: Props) => {
    const { hasCompletedGame, sync } = usePseudoContext();
    const location = useLocation();
    // Pendant le chargement
    if (sync) {
        return (
            <main className="flex flex-col gap-4 items-center justify-center h-full w-full grow-1 mx-auto">
                <Spinner size="lg" color="secondary" />
            </main>
        );
    }

    if (
        location.pathname == "/leaderboard" ||
        location.pathname == "/reset-save"
    ) {
        return <>{children}</>;
    }

    if (hasCompletedGame) {
        // Si on a besoin de first login et qu'on n'y est pas, afficher un spinner
        return (
            <main className="flex flex-col gap-4 items-center justify-center h-full w-full grow-1 mx-auto">
                <EndGameCard />
            </main>
        );
    }

    return <>{children}</>;
};
