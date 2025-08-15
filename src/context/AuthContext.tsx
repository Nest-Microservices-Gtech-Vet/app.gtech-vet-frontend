import { createContext, useContext, useState, useEffect } from "react";
import { login as loginUser, logout as logoutUser, isAuthenticated } from "../services/auth";

interface User {
  usua_id: number;
  usua_email: string;
  usua_nombre: string;
  usua_apellido: string;
  usua_rol: string; // ADMIN o SUPERADMIN
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const login = async (username: string, password: string) => {
    const success = await loginUser(username, password);
    if (success) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
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

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user }}>
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