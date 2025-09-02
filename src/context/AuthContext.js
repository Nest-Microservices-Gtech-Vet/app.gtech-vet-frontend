import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from "react";
import { login as loginUser, logout as logoutUser, isAuthenticated } from "../services/auth";
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    useEffect(() => {
        setIsLoggedIn(isAuthenticated());
    }, []);
    const login = async (username, password) => {
        const success = await loginUser(username, password);
        if (success) {
            const storedUser = localStorage.getItem("user");
            if (storedUser)
                setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
            return true;
        }
        return false;
    };
    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("empresaSeleccionada");
        logoutUser();
        setIsLoggedIn(false);
        setUser(null);
    };
    return (_jsx(AuthContext.Provider, { value: { isLoggedIn, login, logout, user }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }
    return context;
};
