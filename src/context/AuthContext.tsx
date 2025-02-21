import { createContext, useContext, useState, useEffect } from "react";
import { login as loginUser, logout as logoutUser, isAuthenticated } from "../services/auth";

interface AuthContextType {
    isLoggedIn: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

    useEffect(() => {
        setIsLoggedIn(isAuthenticated());
    }, []);

    const login = async (username: string, password: string) => {
        const success = await loginUser(username, password);
        if (success) {
            setIsLoggedIn(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        logoutUser();
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }
    return context;
};
