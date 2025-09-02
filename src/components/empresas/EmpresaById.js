import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { asignarUsuarios, getEmpresaById } from "../../services/empresas/empresas";
import UsuariosSelectorModal from "../users/UsuariosSelectorModal";
const EmpresaDetail = ({ empresaId }) => {
    const [empresa, setEmpresa] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showUsuariosModal, setShowUsuariosModal] = useState(false);
    const navigate = useNavigate();
    // 📦 Cargar empresa al iniciar
    useEffect(() => {
        const fetchEmpresa = async () => {
            try {
                setLoading(true);
                const data = await getEmpresaById(String(empresaId));
                setEmpresa(data);
                if (Array.isArray(data.admins)) {
                    setUsuarios(data.admins);
                }
            }
            catch (err) {
                console.error('Error al cargar la empresa', err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchEmpresa();
    }, [empresaId]);
    // 🚀 Manejar asignación de usuarios
    const handleAsignarUsuarios = async (usuarioIds) => {
        if (!empresa)
            return;
        try {
            await asignarUsuarios(Number(empresa.emp_id), usuarioIds);
            // 🔄 Recargar empresa para reflejar usuarios actualizados
            const data = await getEmpresaById(empresa.emp_id);
            setEmpresa(data);
            if (Array.isArray(data.admins)) {
                setUsuarios(data.admins);
            }
        }
        catch (err) {
            console.error('Error al asignar los usuarios', err);
            alert('Hubo un error al asignar los usuarios');
        }
    };
    const updatedEmpresa = (empresaId) => {
        navigate(`/empresa-edit/${empresaId}`);
    };
    return (_jsxs("div", { className: "bg-gray-700 shadow-lg rounded-2xl p-6 max-w-7xl mx-auto text-gray-100 overflow-auto", children: [loading && _jsx("p", { children: "Cargando empresa..." }), !loading && empresa && (_jsxs(_Fragment, { children: [_jsxs("h2", { className: "text-2xl font-semibold text-white mb-6 border-b border-gray-500 pb-2", children: ["Empresa: ", empresa.emp_nombre, " | RUC: ", empresa.emp_ruc] }), _jsx("div", { className: "mt-4 rid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6", children: usuarios.length > 0 && (_jsxs("div", { className: "mt-6", children: [_jsx("h3", { className: "text-2xl font-semibold text-white mb-2", children: "Usuarios Asignados" }), _jsx("ul", { className: "bg-gray-800 rounded-xl p-4 space-y-2 text-xl", children: usuarios.map((user) => (_jsxs("li", { className: "text-white", children: ["\uD83D\uDFE2 ", user.usua_nombre, " \u2014 ", user.usua_rol] }, user.usua_id))) })] })) }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6", children: _jsx(Detail, { label: "Fecha Inicio", value: empresa.fecha_inicio?.split('T')[0] || "—" }) }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6", children: _jsx(Detail, { label: "Fecha Fin", value: empresa.fecha_fin?.split('T')[0] || "—" }) }), _jsxs("div", { className: "flex flex-col sm:flex-row justify-end gap-3", children: [_jsx("button", { onClick: () => setShowUsuariosModal(true), className: "bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg transition-all", children: "\uD83D\uDD0E Asignar Usuarios" }), _jsx("button", { onClick: () => updatedEmpresa(empresa.emp_id), className: "bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg transition-all", children: "\uD83D\uDCDD Actualizar" }), _jsx("button", { onClick: () => navigate(-1), className: "bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition-all", children: "\uD83D\uDD19 Regresar" })] }), _jsx(UsuariosSelectorModal, { isOpen: showUsuariosModal, onClose: () => setShowUsuariosModal(false), onSave: handleAsignarUsuarios, selectedUserIds: usuarios.map(u => Number(u.usua_id)) })] }))] }));
};
const Detail = ({ label, value }) => (_jsxs("div", { className: "bg-gray-800 p-4 rounded-xl shadow-sm break-words", children: [_jsx("p", { className: "text-sm text-gray-400", children: label }), _jsx("p", { className: "text-lg font-medium text-white", children: value || "—" })] }));
export default EmpresaDetail;
