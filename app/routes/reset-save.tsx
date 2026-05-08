import { Button } from "@heroui/react";
import type { Route } from "./+types/reset-save";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { use, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { LayoutCard, LayoutCardBody, LayoutCardHeader } from "~/components/common/LayoutCard";
import { GlobalStatsManager } from "~/infrastructure/utils/stats/GlobalStatsManager";
import { useAuthContext } from "~/infrastructure/context/AuthContext";
import { AuthProvider } from "~/infrastructure/context/AuthProvider";
import { authService } from "~/services/authService";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Trekkie" }, { name: "description", content: "Trekkie" }];
}

export default function Home() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const globalStatsManager = new GlobalStatsManager();

    const user = useMemo(() => {
        return authService.getCurrentUser();
    }, [authService]);
    const handleUserAction = async () => {
        if (window.confirm(t("navbar.resetConfirm"))) {
            try {
                // Utiliser GlobalStatsManager pour supprimer à la fois localStorage et Firebase
                await globalStatsManager.resetGlobalStats(user?.uid);
                localStorage.removeItem("trekkie_game_save");
                await navigate("/");
                window.location.reload();
            } catch (error) {
                console.error("Erreur lors de la réinitialisation:", error);
                // Même en cas d'erreur Firebase, supprimer localStorage
                localStorage.removeItem("trekkie_game_save");
                localStorage.removeItem("trekkie_global_stats");
                alert(
                    t("resetSave.warning") ||
                        "Données locales supprimées. Les données Firebase n'ont pas pu être supprimées (authentification requise)."
                );
                await navigate("/");
                window.location.reload();
            }
        }
    };
    return (
        <main className="flex flex-col gap-4 items-center justify-center h-full w-full grow-1 mx-auto">
            <LayoutCard>
                <LayoutCardHeader>{t("resetSave.title")}</LayoutCardHeader>
                <LayoutCardBody>
                    <Button onPress={handleUserAction} startContent={<TrashIcon className="h-4 w-4" />} color="danger">
                        {t("navbar.resetGame")}
                    </Button>
                </LayoutCardBody>
            </LayoutCard>
        </main>
    );
}
