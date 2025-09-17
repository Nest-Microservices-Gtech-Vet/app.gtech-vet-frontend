import { createContext, useContext, useState, useEffect } from "react";
import { login as loginUser, logout as logoutUser, isAuthenticated, User } from "../services/auth";

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
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

  const login = async (email: string, password: string) => {
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

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};