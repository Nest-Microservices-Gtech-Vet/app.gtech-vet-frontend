import { useState } from "react";
import { Home, Users2Icon, Building2, Bell, User, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div
            className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-300 
                ${isExpanded ? "w-64" : "w-16"}`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className="flex flex-col h-full p-2">
                <div className="flex items-center justify-center p-4">
                    <Menu size={28} />
                </div>

                <nav className="flex-1 space-y-4">
                    {[
                        { icon: <Home />, text: "Dashboard", path: "/dashboard" },
                        { icon: <Users2Icon />, text: "Usuarios", path: "/users" },
                        { icon: <Building2 />, text: "Empresas", path: "/companies" },
                        // { icon: <Bell />, text: "Notificaciones", path: "/notifications" },
                        // { icon: <User />, text: "Perfil", path: "/profile" },
                    ].map((item, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(item.path)}
                            className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-lg cursor-pointer"
                        >
                            {item.icon}
                            {isExpanded && <span>{item.text}</span>}
                        </div>
                    ))}
                </nav>

                <div className="space-y-4">
                    <div
                        className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-lg cursor-pointer"
                        onClick={() => {
                            logout();
                            navigate("/");
                        }}
                    >
                        <LogOut />
                        {isExpanded && <span>Salir</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
