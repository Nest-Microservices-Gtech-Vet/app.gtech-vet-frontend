import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmpresaById } from "../../services/empresas/empresas";
import { getCantones, getProvincias } from "../../services/empresas/catalogosEmpresa";
const EmpresaDetalle = ({ empresaId }) => {
    const [empresa, setEmpresa] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [provinciaNombre, setProvinciaNombre] = useState(null);
    const [cantonNombre, setCantonNombre] = useState(null);
    const [nombreAdmin, setNombreAdmin] = useState("");
    useEffect(() => {
        const fetchEmpresa = async () => {
            try {
                setLoading(true);
                const data = await getEmpresaById(empresaId);
                setEmpresa(data);
                // 🔍 Buscar nombres de provincia y cantón por ID
                const provincias = await getProvincias();
                const cantones = await getCantones();
                const nombreProvincia = provincias.find(p => p.prov_id === data.provincia_id)?.prov_nombre || null;
                const nombreCanton = cantones.find(c => c.can_id === data.canton_id)?.can_nombre || null;
                setProvinciaNombre(nombreProvincia);
                setCantonNombre(nombreCanton);
                if (Array.isArray(data.admins)) {
                    setUsuarios(data.admins);
                }
            }
            catch (err) {
                setError("No se pudo cargar la empresa.");
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        };
        if (empresaId) {
            fetchEmpresa();
        }
    }, [empresaId]);
    if (loading)
        return _jsx("p", { className: "text-gray-500", children: "Cargando empresa..." });
    if (error)
        return _jsx("p", { className: "text-red-500", children: error });
    if (!empresa)
        return _jsx("p", { children: "No se encontr\u00F3 la empresa." });
    const updatedEmpresa = (empresaId) => {
        navigate(`/empresa-edit/${empresaId}`);
    };
    return (_jsxs("div", { className: "bg-gray-700 shadow-lg rounded-2xl p-6 max-w-7xl mx-auto text-gray-100 overflow-auto", children: [_jsx("h2", { className: "text-2xl font-semibold text-white mb-6 border-b border-gray-500 pb-2", children: "Detalles de la Empresa" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6", children: [_jsx(Detail, { label: "Nombre", value: empresa.emp_nombre }), _jsx(Detail, { label: "RUC", value: empresa.emp_ruc }), _jsx(Detail, { label: "Correo", value: empresa.emp_correo }), _jsx(Detail, { label: "Tel\u00E9fono", value: empresa.emp_telefono }), _jsx(Detail, { label: "Direcci\u00F3n", value: empresa.emp_direccion }), _jsx(Detail, { label: "Provincia", value: provinciaNombre || "—" }), _jsx(Detail, { label: "Cant\u00F3n", value: cantonNombre || "—" }), _jsx(Detail, { label: "Tipo de empresa", value: empresa.emp_tipo_empresa }), _jsx(Detail, { label: "Activo", value: empresa.activo ? "Sí" : "No" }), _jsx(Detail, { label: "Fecha Inicio", value: empresa.fecha_inicio?.split('T')[0] || "—" }), _jsx(Detail, { label: "Fecha Fin", value: empresa.fecha_fin?.split('T')[0] || "—" }), _jsx(Detail, { label: "Usuarios Asignados", value: usuarios.length === 0 ? (_jsx("p", { className: "text-gray-300", children: "No hay usuarios asignados a esta empresa." })) : (_jsx("ul", { className: "list-disc list-inside text-gray-200", children: usuarios.map((user) => (_jsx("li", { children: user.usua_nombre }, user.usua_id))) })) })] }), _jsxs("div", { className: "flex flex-col sm:flex-row justify-end gap-3", children: [_jsx("button", { onClick: () => updatedEmpresa(empresa.emp_id), className: "bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg transition-all", children: "\uD83D\uDCDD Actualizar" }), _jsx("button", { onClick: () => navigate(-1), className: "bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition-all", children: "\uD83D\uDD19 Regresar" })] })] }));
};
export default EmpresaDetalle;
const Detail = ({ label, value }) => (_jsxs("div", { className: "bg-gray-800 p-4 rounded-xl shadow-sm break-words", children: [_jsx("p", { className: "text-sm text-gray-400", children: label }), _jsx("p", { className: "text-lg font-medium text-white", children: value || "—" })] }));
