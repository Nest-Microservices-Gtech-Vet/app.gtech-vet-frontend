import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
const pageTitles = {
    "/mis-empresas/:id/dashboard": "Dashboard",
    "/users": "Usuarios",
    "/user": "Usuario",
    "/user-create": "Agregar Usuarios",
};
const HeaderEmpresa = ({ title }) => {
    const [empresa, setEmpresa] = useState(null);
    const location = useLocation();
    const { user } = useAuth();
    useEffect(() => {
        const storedEmpresa = localStorage.getItem("empresaSeleccionada");
        if (storedEmpresa) {
            setEmpresa(JSON.parse(storedEmpresa));
        }
    }, []);
    const getTitle = () => {
        if (title)
            return title;
        if (location.pathname.startsWith("/mis-empresas/"))
            return "Dashboard";
        return pageTitles[location.pathname] || "Dashboard";
    };
    return (_jsx("header", { className: "bg-white bg-opacity-80 backdrop-blur-md shadow-lg border-b border-gray-200", children: _jsxs("div", { className: "flex justify-between items-center mx-auto py-4 px-4 sm:px-6 lg:px-8", children: [_jsx("div", { children: empresa && (_jsx("p", { className: "text-base text-gray-700 mt-1", children: empresa.emp_nombre })) }), _jsx("div", { className: "text-base text-gray-800 font-medium", children: user ? `👤 ${user.usua_nombre} ${user.usua_apellido}` : "No autenticado" })] }) }));
};
export default HeaderEmpresa;
