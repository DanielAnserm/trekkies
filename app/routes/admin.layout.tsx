import { Outlet } from "react-router";
import { AdminGuard } from "~/infrastructure/guards/AdminGuard";

/**
 * Layout pour les routes admin protégées (/admin/*).
 * Vérifie que l'utilisateur est authentifié et a le rôle admin.
 */
export default function AdminLayout() {
    return (
        <AdminGuard>
            <Outlet />
        </AdminGuard>
    );
}
