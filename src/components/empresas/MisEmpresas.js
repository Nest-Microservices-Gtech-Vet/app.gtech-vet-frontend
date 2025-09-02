import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { getEmpresasPorUsuario } from "../../services/empresas/empresas";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
const MisEmpresas = () => {
    const { user, logout } = useAuth();
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            console.warn("No hay usuario logueado.");
            return;
        }
        const user = JSON.parse(storedUser);
        if (!["ADMIN", "USUARIO"].includes(user.usua_rol)) {
            Swal.fire({
                icon: "error",
                title: "Acceso no autorizado",
                confirmButtonColor: "#6366F1",
            }).then(() => navigate("/"));
            return;
        }
        getEmpresasPorUsuario(user.usua_id)
            .then((data) => setEmpresas(data))
            .catch((err) => console.error("Error cargando empresas:", err))
            .finally(() => setLoading(false));
    }, []);
    const goEmpresas = (empresaId) => {
        const empresa = empresas.find((e) => e.emp_id === empresaId);
        if (empresa) {
            localStorage.setItem("empresaSeleccionada", JSON.stringify(empresa));
            // Asegura que el modo oscuro esté desactivado
            document.documentElement.classList.remove("dark");
            navigate(`/mis-empresas/${empresaId}/dashboard`);
        }
    };
    if (loading)
        return _jsx("p", { children: "Cargando empresas..." });
    return (_jsxs("div", { className: "min-h-screen bg-gray-100 text-gray-900", children: [_jsxs("header", { className: "bg-white shadow p-4 flex justify-between items-center sticky top-0 z-10", children: [_jsx("h1", { className: "text-xl font-bold", children: "Mis Empresas" }), _jsx("div", { className: "flex gap-3 items-center", children: _jsx("button", { className: "bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition", onClick: logout, children: "Cerrar sesi\u00F3n" }) })] }), _jsx("main", { className: "p-6", children: _jsx("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Nombre" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Acciones" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: empresas.map((empresa) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 text-gray-900", children: empresa.emp_nombre }), _jsx("td", { className: "px-6 py-4 space-x-2", children: empresa.activo ? (_jsx("button", { className: "bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm", onClick: () => goEmpresas(empresa.emp_id), children: "Entrar" })) : (_jsx("button", { className: "bg-gray-400 text-white px-3 py-1 rounded  text-sm", onClick: () => Swal.fire({
                                                    icon: 'warning',
                                                    title: 'Empresa desactivada',
                                                    text: 'Comuníquese con su administrador.',
                                                    confirmButtonColor: '#6366F1', // color índigo
                                                }), children: "Conectar" })) })] }, empresa.emp_id))) })] }) }) })] }));
};
export default MisEmpresas;
