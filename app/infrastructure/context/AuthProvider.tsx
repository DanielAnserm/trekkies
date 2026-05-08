import { updateEmail, verifyBeforeUpdateEmail, type User } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "~/infrastructure/context/AuthContext";
import { authService } from "~/services/authService";

type Props = {
    children?: React.ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
    const { t } = useTranslation();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const unsubscribe = authService.onAuthStateChanged(
            async (firebaseUser) => {
                if (firebaseUser) {
                    setUser(firebaseUser);
                } else {
                    setUser(null);
                }
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const signIn = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            // Anonymous sign-in
            await authService.signInAnonymously();
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
    }, []);

    const signOut = async () => {
        try {
            await authService.signOut();
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    };

    const addEmail = async (email: string) => {
        if (!user) {
            console.error("invalid user");
            return;
        }
        await verifyBeforeUpdateEmail(user, email);
        updateEmail(user, email)
            .then(() => {
                console.log("Email mis à jour avec succès");
            })
            .catch((error) => {
                console.error("Erreur:", error);
            });
    };

    useEffect(() => {
        if (user) {
            console.log("Utilisateur connecté:", user);
        } else {
            console.log("Aucun utilisateur connecté");
            signIn();
        }
    }, [user, signIn]);

    if (loading) {
        return <></>;
    }
    // if (error) {
    //     return <div>{t("auth.error", { message: error })}</div>;
    // }
    if (!user) {
        return <></>;
    }

    return <AuthContext value={{ user, addEmail }}>{children}</AuthContext>;
};
