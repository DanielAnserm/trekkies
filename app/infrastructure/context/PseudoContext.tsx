import { createContext, useContext } from "react";
import type { UserProfile } from "./PseudoProvider";

export type PseudoContextType = {
    userProfile: UserProfile | null;
    setPseudo: (pseudo: string) => Promise<void>;
    removePseudo: () => Promise<void>;
    setError: (error: string) => void;
    loading: boolean;
    sync: boolean;
    error: string;
    needsFirstLogin: boolean;
    setNeedsFirstLogin: (value: boolean) => void;
    hasCompletedGame: boolean;
    setHasCompletedGame: (value: boolean) => void;
};

export const PseudoContext = createContext<PseudoContextType>({
    error: "",
    loading: false,
    sync: true,
    userProfile: null,
    setPseudo: async () => {
        throw new Error("setPseudo function not implemented");
    },
    removePseudo: async () => {
        throw new Error("removePseudo function not implemented");
    },
    setError: () => {
        throw new Error("setError function not implemented");
    },
    needsFirstLogin: false,
    setNeedsFirstLogin: () => {
        throw new Error("setNeedsFirstLogin function not implemented");
    },
    hasCompletedGame: false,
    setHasCompletedGame: () => {
        throw new Error("setHasCompletedGame function not implemented");
    },
});

export const usePseudoContext = () => useContext(PseudoContext);
