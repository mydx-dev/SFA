import { createContext, ReactNode, useContext } from "react";

export interface AuthUser {
    email: string;
    role?: string;
}

const AuthContext = createContext<AuthUser | null | undefined>(undefined);

export const AuthProvider = ({ children, user }: { children: ReactNode; user: AuthUser | null }) => (
    <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
);

export const useAuth = (): AuthUser | null | undefined => useContext(AuthContext);
