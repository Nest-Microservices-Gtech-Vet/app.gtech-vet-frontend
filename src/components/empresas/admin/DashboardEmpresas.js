import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const DashboardEmpresa = () => {
    const [empresa, setEmpresa] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const storedEmpresa = localStorage.getItem("empresaSeleccionada");
        if (storedEmpresa) {
            setEmpresa(JSON.parse(storedEmpresa));
        }
        // Asegurar tema claro
        document.documentElement.classList.remove("dark");
    }, []);
    if (!empresa)
        return _jsx("p", { children: "Cargando empresa..." });
    return (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Dashboard" }), _jsx("p", { children: "Aqu\u00ED puedes mostrar widgets, estad\u00EDsticas, etc." })] }));
};
export default DashboardEmpresa;
