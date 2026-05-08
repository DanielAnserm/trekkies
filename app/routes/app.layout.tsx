import { Outlet } from "react-router";
import { BaseLayout } from "~/components/common/Layout";
import { NavbarComponent } from "~/components/common/NavbarComponent";
import { FirstLoginGuard } from "~/infrastructure/guards/FirstLoginGuard";
import { EndGameGuard } from "~/infrastructure/guards/EndGameGuard";
import { AuthProvider } from "~/infrastructure/context/AuthProvider";
import { PseudoProvider } from "~/infrastructure/context/PseudoProvider";
import { AutoSyncWrapper } from "~/infrastructure/components/AutoSyncWrapper";

/**
 * Layout pour les routes de l'application principale (jeu).
 * Inclut AuthProvider et PseudoProvider pour l'authentification des joueurs,
 * ainsi que les guards de première connexion et de fin de jeu.
 * AutoSyncWrapper synchronise automatiquement les stats avec Firebase toutes les minutes.
 *
 * Note: Les routes admin utilisent leur propre AdminProvider séparé
 * pour éviter les conflits d'authentification.
 */
export default function AppLayout() {
    return (
        <AuthProvider>
            <PseudoProvider>
                <AutoSyncWrapper />
                <BaseLayout>
                    <main className="flex flex-col gap-4 items-center justify-center h-full w-full grow-1 mx-auto">
                        <FirstLoginGuard>
                            <EndGameGuard>
                                <Outlet />
                                <NavbarComponent />
                            </EndGameGuard>
                        </FirstLoginGuard>
                    </main>
                </BaseLayout>
            </PseudoProvider>
        </AuthProvider>
    );
}
