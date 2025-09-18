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
    const login = async (email, password) => {
        const result = await loginUser(email, password);
        if (result.success && result.usuario) {
            setUser(result.usuario); // ✅ ahora no hay error
            setIsLoggedIn(true);
            return true;
        }
        return false;
    };
    const logout = () => {
        logoutUser();
        setIsLoggedIn(false);
        setUser(null);
    };
    return (_jsx(AuthContext.Provider, { value: { isLoggedIn, login, logout, user }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    return context;
};
