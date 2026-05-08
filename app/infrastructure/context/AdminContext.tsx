import { createContext, useContext } from "react";
import type { User } from "firebase/auth";

export interface AdminContextType {
    adminUser: User | null;
    isAdmin: boolean;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdminContext = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error("useAdminContext must be used within an AdminProvider");
    }
    return context;
};
