/**
 * Firebase configuration and initialization.
 * This module initializes Firebase services such as Authentication, Firestore, Storage, and Realtime Database
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};

// Init Firebase app for players (default app)
const app = initializeApp(firebaseConfig);

// Init separate Firebase app for admins
const adminApp = initializeApp(firebaseConfig, "admin");

/**
 * Firebase Authentication service instance for players (anonymous auth).
 */
export const auth = getAuth(app);

/**
 * Firebase Authentication service instance for admins (email/password auth).
 * This is a separate instance to avoid conflicts with player auth.
 */
export const adminAuth = getAuth(adminApp);

/**
 * Firebase Firestore service instance.
 */
export const db = getFirestore(app);

/**
 * Firebase Firestore service instance.
 */
export const dbAdmin = getFirestore(adminApp);

/**
 * Firebase Storage service instance.
 */
export const storage = getStorage(app);
/**
 * Firebase Realtime Database service instance.
 */
export const rtdb = getDatabase(app);

export default app;
