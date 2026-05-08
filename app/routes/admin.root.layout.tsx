import { Outlet } from "react-router";
import { AdminProvider } from "~/infrastructure/context/AdminProvider";

/**
 * Layout racine pour toutes les routes admin.
 * Fournit le AdminProvider partagé pour /admin/login et /admin/*
 * Cela permet de conserver l'état d'authentification lors de la navigation.
 */
export default function AdminRootLayout() {
    return (
        <AdminProvider>
            <Outlet />
        </AdminProvider>
    );
}
