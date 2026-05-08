import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { adminAuth } from "~/config/firebase";
import { adminAuthService } from "~/services/adminAuthService";
import { rolesService } from "~/services/rolesService";
import { AdminContext, type AdminContextType } from "./AdminContext";

type Props = {
    children: React.ReactNode;
};

export const AdminProvider = ({ children }: Props) => {
    const [adminUser, setAdminUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(adminAuth, async (user) => {
            if (user) {
                // Vérifier si l'utilisateur a le rôle admin
                const hasAdminRole = await rolesService.isAdmin(user.uid);
                if (hasAdminRole) {
                    setAdminUser(user);
                    setIsAdmin(true);
                } else {
                    setAdminUser(null);
                    setIsAdmin(false);
                }
            } else {
                setAdminUser(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            setLoading(true);
            const user = await adminAuthService.signInAdmin(email, password);
            setAdminUser(user);
            setIsAdmin(true);
        } catch (error) {
            setAdminUser(null);
            setIsAdmin(false);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            await adminAuthService.signOutAdmin();
            setAdminUser(null);
            setIsAdmin(false);
        } catch (error) {
            console.error("Failed to sign out admin:", error);
            throw error;
        }
    };

    const value: AdminContextType = {
        adminUser,
        isAdmin,
        loading,
        signIn,
        signOut,
    };

    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
