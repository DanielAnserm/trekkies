import React, { useCallback, useEffect, useState } from "react";
import { PseudoContext } from "~/infrastructure/context/PseudoContext";
import { firestoreService } from "~/services/firestoreService";
import { useAuthContext } from "./AuthContext";
import { Spinner } from "@heroui/react";
import { GlobalStatsManager } from "../utils/stats/GlobalStatsManager";

export type UserProfile = {
    pseudonym: string;
    createdAt: string;
    uid: string;
    hasCompletedFirstLogin?: boolean;
    hasCompletedGame?: boolean;
};

type Props = {
    children?: React.ReactNode;
};

export const PseudoProvider = ({ children }: Props) => {
    const { user } = useAuthContext();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [sync, setSync] = useState(true);
    const [error, setError] = useState("");
    const [needsFirstLogin, setNeedsFirstLogin] = useState(false);
    const [hasCompletedGame, setHasCompletedGame] = useState(false);

    const retrieveUserProfile = useCallback(async () => {
        if (user) {
            const uid = user?.uid;
            try {
                // Vérifier si le profil existe dans Firestore
                const profileDoc = await firestoreService.getDocument(
                    "userProfiles",
                    uid
                );

                if (profileDoc.exists()) {
                    const profile = profileDoc.data() as UserProfile;
                    setUserProfile(profile);

                    // Vérifier si le profil de jeu existe dans localStorage
                    const globalStatsManager = new GlobalStatsManager();
                    const globalData =
                        await globalStatsManager.loadGlobalStats();
                    console.log("Données globales chargées:", globalData);
                    if (
                        !globalData ||
                        !globalData.profile ||
                        globalData.profile.isNewProfile
                    ) {
                        setNeedsFirstLogin(true);
                    } else {
                        setNeedsFirstLogin(false);
                    }
                    // Synchroniser l'état isGameCompleted
                    if (globalData?.profile.isGameCompleted) {
                        setHasCompletedGame(true);
                    } else {
                        setHasCompletedGame(false);
                    }
                } else {
                    // Pas de profil Firestore = première connexion
                    setNeedsFirstLogin(true);
                }
                setSync(false);
            } catch (err) {
                console.error("Erreur lors de la récupération du profil:", err);
                setSync(false);
                throw err;
            }
        }
    }, [user]);

    useEffect(() => {
        retrieveUserProfile();

        // Écouter les changements dans localStorage (pour la synchronisation depuis Firebase)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'trekkie_global_stats' || e.key === null) {
                // Recharger le profil quand localStorage change
                retrieveUserProfile();
            }
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [retrieveUserProfile]);

    const setPseudo = async (pseudo: string) => {
        setLoading(true);
        setError("");

        try {
            if (user) {
                const profile: UserProfile = {
                    pseudonym: pseudo.trim(),
                    createdAt: new Date().toISOString(),
                    uid: user.uid,
                    hasCompletedFirstLogin: true,
                };

                await firestoreService.setDocument(
                    "userProfiles",
                    user.uid,
                    profile
                );
                setUserProfile(profile);
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Erreur lors de la connexion");
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const removePseudo = async () => {
        if (!user || !userProfile) {
            throw new Error(
                "Utilisateur non connecté ou profil non disponible"
            );
        }
        setLoading(true);
        setError("");
        try {
            // Supprimer le profil utilisateur
            await firestoreService.deleteDocument("userProfiles", user.uid);
            setUserProfile(null);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Erreur lors de la suppression du pseudonyme");
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <PseudoContext
            value={{
                userProfile,
                setPseudo,
                removePseudo,
                loading,
                setError,
                error,
                sync,
                needsFirstLogin,
                setNeedsFirstLogin,
                hasCompletedGame,
                setHasCompletedGame,
            }}
        >
            {children}
        </PseudoContext>
    );
};
