import { firestoreServiceAdmin } from "./firestoreServiceAdmin";

export type UserRole = "player" | "admin";

export interface UserRoleData {
    uid: string;
    role: UserRole;
    email?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * RolesService manages user roles in Firestore.
 * It provides methods to check, assign, and revoke admin privileges.
 */
export const rolesService = {
    /**
     * Checks if a user has admin role.
     * @param uid - The user ID to check
     * @returns A promise that resolves to true if the user is an admin
     */
    async isAdmin(uid: string): Promise<boolean> {
        try {
            const doc = await firestoreServiceAdmin.getDocument("userRoles", uid);
            if (doc.exists()) {
                const data = doc.data() as UserRoleData;
                return data.role === "admin";
            }
            return false;
        } catch (error) {
            console.error("Failed to check admin role:", error);
            return false;
        }
    },

    /**
     * Gets a user's role data.
     * @param uid - The user ID
     * @returns A promise that resolves with the user's role data or null
     */
    async getUserRole(uid: string): Promise<UserRoleData | null> {
        try {
            const doc = await firestoreServiceAdmin.getDocument("userRoles", uid);
            if (doc.exists()) {
                return doc.data() as UserRoleData;
            }
            return null;
        } catch (error) {
            console.error("Failed to get user role:", error);
            return null;
        }
    },

};
