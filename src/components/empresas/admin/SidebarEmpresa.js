import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LayoutDashboard, LogOut, Menu, MonitorCheck, PawPrint, SquareUser, Users2, } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { logout } from "../../../services/auth";
// ✅ Creamos los ítems del sidebar usando el id dinámico
const getSidebarItems = (id) => [
    { name: "Dashboard", icon: LayoutDashboard, color: "#EC4899", href: `/mis-empresas/${id}/dashboard` },
    {
        name: "Perfil",
        icon: Users2,
        color: "#1E90FF",
        href: "#",
        submenu: [
            { name: "Crear Usuarios", href: "#" },
            {
                name: "Administrar Usuarios",
                href: "#",
                submenu: [
                    { name: "Activos", href: "#" },
                    { name: "Inactivos", href: "#" },
                ],
            },
        ],
    },
    { name: "Clientes", icon: SquareUser, color: "#EC4899", href: `/mis-empresas/${id}/clientes` },
    { name: "Pacientes", icon: PawPrint, color: "#32CD32", href: `/mis-empresas/${id}/mascotas` },
    // { name: "Historial clínico", icon: MonitorCheck, color: "#8A2BE2", href: `/mis-empresas/${id}/historial` },
    { name: "Módulo-3", icon: MonitorCheck, color: "#20B2AA", href: `/mis-empresas/${id}/modulo3` },
];
const SidebarEmpresa = ({ isOpen, setIsOpen }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [openSubmenus, setOpenMenus] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();
    const SIDEBAR_ITEMS = getSidebarItems(id); // ✅ Generamos los ítems dinámicamente
    useEffect(() => {
        if (!isOpen) {
            setOpenMenus({});
        }
    }, [isOpen]);
    const toggleMenu = (key) => {
        setOpenMenus((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };
    const renderMenuItems = (items, level = 0, parentKey = "") => {
        return items.map((item, index) => {
            const key = parentKey ? `${parentKey}-${index}` : `${index}`;
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isExpanded = !!openSubmenus[key];
            return (_jsxs("div", { children: [_jsxs("div", { onClick: () => {
                            if (hasSubmenu) {
                                toggleMenu(key);
                            }
                            else {
                                navigate(item.href);
                                setIsMobileOpen(false);
                            }
                        }, className: `flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors mb-1 ${level > 0 ? `ml-${level * 4}` : ""}`, children: [_jsxs("div", { className: "flex items-center space-x-2", children: [item.icon && _jsx(item.icon, { size: 18, style: { color: item.color } }), isOpen && _jsx("span", { className: "text-base font-medium", children: item.name })] }), hasSubmenu && isOpen && (_jsx(ChevronDown, { className: `transition-transform ${isExpanded ? "rotate-180" : ""}`, size: 16 }))] }), _jsx(AnimatePresence, { children: hasSubmenu && isExpanded && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: "auto", opacity: 1 }, exit: { height: 0, opacity: 0 }, className: "ml-4", children: renderMenuItems(item.submenu, level + 1, key) })) })] }, key));
        });
    };
    return (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => setIsMobileOpen(!isMobileOpen), className: "md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md text-black", children: _jsx(Menu, { size: 24 }) }), isMobileOpen && (_jsx("div", { className: "fixed inset-0 bg-white bg-opacity-50 z-40 md:hidden", onClick: () => setIsMobileOpen(false) })), _jsx(motion.div, { className: `fixed md:relative top-0 left-0 h-full bg-white text-black transition-all duration-200 z-50
        ${isMobileOpen ? "w-64" : "w-20"} md:w-20 md:hover:w-64`, animate: { width: isMobileOpen ? 256 : isOpen ? 256 : 80 }, onMouseEnter: () => setIsOpen(true), onMouseLeave: () => setIsOpen(false), children: _jsxs("div", { className: "h-full bg-white bg-opacity-50 backdrop-blur-md shadow-lg p-4 flex flex-col border-r border-gray-200", children: [_jsx(motion.button, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, className: "p-2 rounded-full hover:bg-white-700 transition-colors max-w-fit", children: _jsx("h1", { children: "Men\u00FA" }) }), _jsxs("nav", { className: "mt-8 flex-grow", children: [renderMenuItems(SIDEBAR_ITEMS), _jsxs("div", { className: "flex items-center space-x-3 p-2 hover:bg-white-700 rounded-lg cursor-pointer mt-4", onClick: () => {
                                        logout();
                                        navigate("/");
                                        setIsMobileOpen(false);
                                    }, children: [_jsx(LogOut, {}), isOpen && _jsx("span", { children: "Salir del sistema" })] })] })] }) })] }));
};
export default SidebarEmpresa;
