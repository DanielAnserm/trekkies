import { type User } from "firebase/auth";
import { createContext, use, useContext } from "react";

export type AuthContextType = {
    user?: User;
    addEmail?: (value: string) => void;
};

export const AuthContext = createContext<AuthContextType>({});

export const useAuthContext = () => useContext(AuthContext);
