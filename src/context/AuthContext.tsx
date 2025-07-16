import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { setAuthHooks } from '../api';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthData {
    user: User;
    accessToken: string;
}

interface AuthContextType {
    auth: AuthData | null;
    setAuth: React.Dispatch<React.SetStateAction<AuthData | null>>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [auth, setAuth] = useState<AuthData | null>(null);

    const logout = () => {
        setAuth(null);
        // Optional: could also call a /api/auth/logout endpoint here
    };

    useEffect(() => {
        // Set the hooks for the API client to use, connecting the context to the interceptor
        setAuthHooks(
            () => auth?.accessToken || null,
            logout,
            (newAuthData) => setAuth(newAuthData)
        );
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};