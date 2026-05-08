import { onAuthStateChanged, signInAnonymously, signOut, type NextOrObserver, type User } from "firebase/auth";
import { auth } from "~/config/firebase";

/**
 * AuthService provides methods for user authentication using Firebase.
 * It allows signing in anonymously, signing out, and observing authentication state changes.
 */
export const authService = {
    /**
     * Signs in a user anonymously.
     * @returns A promise that resolves when the user is signed in.
     */
    signInAnonymously: () => signInAnonymously(auth),

    /**
     * Signs out the current user.
     * @returns A promise that resolves when the user is signed out.
     */
    signOut: () => signOut(auth),

    /**
     * Sets up an observer for changes to the user's sign-in state.
     * @param callback A function that is called when the user's sign-in state changes.
     */
    onAuthStateChanged: (callback: NextOrObserver<User>) => onAuthStateChanged(auth, callback),

    /**
     * Gets the current user.
     * @returns The currently signed-in user, or null if no user is signed in.
     */
    getCurrentUser: () => auth.currentUser,
};
