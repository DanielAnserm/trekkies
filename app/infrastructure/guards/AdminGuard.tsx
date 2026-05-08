import { Spinner } from "@heroui/react";
import { Navigate, useLocation } from "react-router";
import { useAdminContext } from "../context/AdminContext";

type Props = {
    children: React.ReactNode;
};

export const AdminGuard = ({ children }: Props) => {
    const { isAdmin, loading } = useAdminContext();
    const location = useLocation();

    // Pendant le chargement
    if (loading) {
        return (
            <main className="flex flex-col gap-4 items-center justify-center h-full w-full grow-1 mx-auto">
                <Spinner size="lg" color="secondary" />
                <p className="text-gray-500">Vérification des autorisations...</p>
            </main>
        );
    }

    // Si l'utilisateur n'est pas admin, rediriger vers la page de login admin
    if (!isAdmin) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
