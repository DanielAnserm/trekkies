import {
    signInWithEmailAndPassword,
    signOut,
    type User,
} from "firebase/auth";
import { adminAuth } from "~/config/firebase";
import { rolesService } from "./rolesService";

/**
 * AdminAuthService provides authentication methods specifically for admin users.
 * It extends the basic auth service with email/password login and role verification.
 */
export const adminAuthService = {
    /**
     * Signs in an admin user with email and password.
     * Verifies that the user has admin role before allowing access.
     * @param email - The admin user's email
     * @param password - The admin user's password
     * @returns A promise that resolves with the authenticated user
     * @throws Error if credentials are invalid or user is not an admin
     */
    signInAdmin: async (email: string, password: string): Promise<User> => {
        try {
            const userCredential = await signInWithEmailAndPassword(adminAuth, email, password);
            const user = userCredential.user;

            // Vérifier que l'utilisateur a le rôle admin
            const isAdmin = await rolesService.isAdmin(user.uid);

            if (!isAdmin) {
                await signOut(adminAuth);
                throw new Error("Accès refusé : vous n'êtes pas administrateur");
            }

            return user;
        } catch (error: any) {
            console.error("Admin sign-in failed:", error);
            if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found") {
                throw new Error("Email ou mot de passe incorrect");
            }
            throw error;
        }
    },

    /**
     * Signs out the current admin user.
     * @returns A promise that resolves when the user is signed out
     */
    signOutAdmin: () => signOut(adminAuth),
};
