import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Building2, User, LogOut, ChevronDown } from "lucide-react";
const pageTitles = {
    "/mis-empresas/:id/dashboard": "Dashboard",
    "/users": "Usuarios",
    "/user": "Usuario",
    "/user-create": "Agregar Usuarios",
};
const HeaderEmpresa = ({ title }) => {
    const [empresa, setEmpresa] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    useEffect(() => {
        const storedEmpresa = localStorage.getItem("empresaSeleccionada");
        if (storedEmpresa) {
            setEmpresa(JSON.parse(storedEmpresa));
        }
    }, []);
    // Cerrar menú si se hace clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const getTitle = () => {
        if (title)
            return title;
        if (location.pathname.startsWith("/mis-empresas/"))
            return "Dashboard";
        return pageTitles[location.pathname] || "Dashboard";
    };
    return (_jsx("header", { className: "bg-white bg-opacity-80 backdrop-blur-md shadow-lg border-b border-gray-200", children: _jsxs("div", { className: "flex justify-between items-center mx-auto py-4 px-4 sm:px-6 lg:px-8", children: [_jsx("div", { children: empresa && (_jsx("p", { className: "text-base text-gray-700 mt-1", children: empresa.emp_nombre })) }), _jsxs("div", { className: "relative", ref: menuRef, children: [_jsxs("button", { onClick: () => setIsMenuOpen((prev) => !prev), className: "flex items-center space-x-2 text-base text-gray-800 font-medium hover:text-sky-600 focus:outline-none", children: [_jsx("span", { children: user
                                        ? `${user.usua_nombre} ${user.usua_apellido}`
                                        : "No autenticado" }), _jsx(ChevronDown, { size: 18, className: `transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}` })] }), isMenuOpen && (_jsxs("div", { className: "absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 \r\n                         animate-fade-in", children: [_jsxs("button", { onClick: () => {
                                        navigate("/mis-empresas");
                                        setIsMenuOpen(false);
                                    }, className: "flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left", children: [_jsx(Building2, { size: 16 }), " Mis empresas"] }), _jsxs("button", { onClick: () => {
                                        navigate("/user");
                                        setIsMenuOpen(false);
                                    }, className: "flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left", children: [_jsx(User, { size: 16 }), " Perfil"] }), _jsxs("button", { onClick: () => {
                                        logout();
                                        setIsMenuOpen(false);
                                    }, className: "flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 w-full text-left", children: [_jsx(LogOut, { size: 16 }), " Cerrar sesi\u00F3n"] })] }))] })] }) }));
};
export default HeaderEmpresa;
