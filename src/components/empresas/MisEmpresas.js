import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { getEmpresasPorUsuario } from "../../services/empresas/empresas";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Building2, ArrowRight } from "lucide-react";
const MisEmpresas = () => {
    const { user, logout } = useAuth();
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser)
            return;
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
            document.documentElement.classList.remove("dark");
            navigate(`/mis-empresas/${empresaId}/dashboard`);
        }
    };
    if (loading)
        return _jsx("p", { className: "text-center py-10 text-gray-600", children: "Cargando empresas..." });
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsxs("header", { className: "bg-white shadow p-4 flex justify-between items-center sticky top-0 z-10", children: [_jsxs("h1", { className: "text-xl font-bold text-gray-800 flex items-center gap-2", children: [_jsx(Building2, { className: "w-6 h-6 text-indigo-600" }), "Mis Empresas"] }), _jsx("button", { className: "bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2", onClick: logout, children: "Cerrar sesi\u00F3n" })] }), _jsx("main", { className: "p-6 space-y-4", children: empresas.length === 0 ? (_jsx("p", { className: "text-center text-gray-600", children: "No tienes empresas asignadas." })) : (empresas.map((empresa) => (_jsxs("div", { className: "flex items-center bg-white rounded-xl shadow-md border border-gray-100 p-4 transition duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-indigo-50 group", children: [_jsx("div", { className: "flex-shrink-0 transform transition duration-300 group-hover:scale-105", children: _jsx("img", { src: `https://app.amigovet123.com:8443/uploads/logos/${empresa.emp_foto}`, alt: empresa.emp_nombre, className: "w-24 h-24 object-cover rounded-lg border" }) }), _jsxs("div", { className: "flex-1 px-6", children: [_jsxs("h2", { className: "text-lg font-semibold text-gray-800 flex items-center gap-2 transition duration-300 group-hover:text-indigo-600", children: [_jsx("span", { children: "\uD83C\uDFE2" }), empresa.emp_nombre] }), _jsx("span", { className: `inline-block text-xs font-medium px-2 py-1 rounded-full mt-1 ${empresa.activo
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"}`, children: empresa.activo ? "Activa" : "Desactivada" })] }), empresa.activo ? (_jsxs("button", { onClick: () => goEmpresas(empresa.emp_id), className: "bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:bg-indigo-700", children: ["Entrar", _jsx(ArrowRight, { className: "w-4 h-4" })] })) : (_jsxs("button", { onClick: () => Swal.fire({
                                icon: "warning",
                                title: "Empresa desactivada",
                                text: "Comuníquese con su administrador.",
                                confirmButtonColor: "#6366F1",
                            }), className: "bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed flex items-center gap-2", children: ["Conectar", _jsx(ArrowRight, { className: "w-4 h-4" })] }))] }, empresa.emp_id)))) })] }));
};
export default MisEmpresas;
