import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getHistoriaClinicaByMascotaId } from "../../../../services/gestion-empresa/historia-clinica/historiaClinica";
import { getUserById } from "../../../../services/users/users";
const HistoriaClinicaList = () => {
    const { empresaId } = useParams();
    const { mascotaId } = useParams();
    const { id } = useParams();
    const [historiaClinica, setHistoriaClinica] = useState(null);
    const [expanded, setExpanded] = useState(null); // ID de consulta abierta
    const [creadores, setCreadores] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getHistoriaClinicaByMascotaId(mascotaId);
                if (!data) {
                    console.warn("⚠️ No se obtuvo historia clínica");
                    return;
                }
                setHistoriaClinica(data);
                const consultas = Array.isArray(data.consultas) ? data.consultas : [];
                const creadorIds = [...new Set(consultas.map((c) => c.createdBy).filter(Boolean))];
                const creadoresData = {};
                await Promise.all(creadorIds.map(async (id) => {
                    try {
                        const user = await getUserById(id.toString());
                        creadoresData[id] = user;
                    }
                    catch (e) {
                        console.error("❌ No se pudo obtener usuario con ID", id);
                    }
                }));
                setCreadores(creadoresData);
            }
            catch (error) {
                console.error("Error al cargar historia clínica:", error);
            }
        };
        fetchData();
    }, [mascotaId]);
    const toggleExpand = (con_id) => {
        setExpanded(prev => (prev === con_id ? null : con_id));
    };
    if (!historiaClinica)
        return _jsx("p", { children: "\uD83D\uDD04 Cargando historia cl\u00EDnica..." });
    return (_jsxs("div", { className: "p-6 max-w-screen-xl mx-auto bg-white shadow rounded", children: [_jsxs("h2", { className: "text-2xl font-bold mb-4 text-gray-800", children: ["\uD83D\uDCCB Historia Cl\u00EDnica n\u00B0: ", historiaClinica.hic_numero_local] }), _jsxs("div", { className: "flex flex-wrap gap-4 mb-6", children: [_jsx("button", { onClick: () => navigate(`/mis-empresas/${id}/mascotas/editar-mascota/${mascotaId}`), className: "bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md transition", children: "\uD83D\uDD19 Volver a Mascota" }), _jsx("button", { onClick: () => navigate(`/mis-empresas/${id}/mascotas/editar-mascota/${mascotaId}/historia-clinica/nueva`), className: "bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition", children: "\u2795 Nueva Consulta" }), _jsx("button", { onClick: () => navigate(`/mis-empresas/${id}/mascotas/${mascotaId}/registrar-vacuna`), className: "bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition", children: "\u2795 Vacunas" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "bg-white rounded-lg p-6 shadow-md", children: [_jsx("h3", { className: "text-xl font-semibold mb-4 text-gray-700", children: "\uD83D\uDC3E Datos de la Mascota" }), _jsxs("div", { className: "space-y-2 text-gray-800", children: [_jsxs("div", { className: "mb-4", children: [_jsx("img", { src: `https://app.amigovet123.com:8443/uploads/perfil/${historiaClinica.mascota.mas_foto}`, alt: "Foto mascota", className: "w-32 h-32 object-cover rounded " }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDCCA Consultas registradas:" }), " ", historiaClinica.consultas?.length ?? 0] })] }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDCCC Estado HC:" }), " ", historiaClinica.hic_estado] }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDC36 Nombre:" }), " ", historiaClinica.mascota?.mas_nombre || 'No disponible'] }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDC64 Propietario:" }), " ", historiaClinica.mascota?.propietario?.cli_nombre || 'No disponible'] }), _jsxs("p", { children: [_jsx("strong", { children: "\u2705 Activo:" }), " ", historiaClinica.activo ? 'Sí' : 'No'] })] })] }), _jsxs("div", { className: "lg:col-span-2", children: [_jsx("h3", { className: "text-xl font-semibold mb-4 text-gray-700", children: "\uD83E\uDE7A Consultas" }), historiaClinica.consultas?.length === 0 ? (_jsx("p", { className: "text-gray-600", children: "\u2757 A\u00FAn no hay consultas registradas." })) : (_jsx("ul", { className: "space-y-4", children: historiaClinica.consultas.map((consulta) => (_jsxs("li", { className: "bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition p-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "text-gray-800 text-sm", children: [_jsxs("p", { children: [_jsx("strong", { children: "\uD83C\uDD94 N\u00B0 Consulta:" }), " ", consulta.con_numero_mascota] }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDCC5 Fecha:" }), " ", new Date(consulta.con_fecha).toLocaleDateString()] }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDCDD Motivo:" }), " ", consulta.con_motivo] }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDCDD Firmante:" }), " ", creadores[consulta.createdBy]?.usua_nombre
                                                                    ? `Dr. ${creadores[consulta.createdBy].usua_nombre} ${creadores[consulta.createdBy].usua_apellido}`
                                                                    : `ID: ${consulta.createdBy}`] }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83E\uDDEA Ex\u00E1menes:" }), " ", consulta.Examen && consulta.Examen.length > 0 ? "✅ Sí" : "❌ No"] })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx("button", { onClick: () => toggleExpand(consulta.con_id), className: "bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium px-3 py-1 rounded-md transition", children: expanded === consulta.con_id ? '▲ Ocultar Detalle' : '▼ Ver Detalle' }), _jsx("button", { onClick: () => navigate(`/mis-empresas/${id}/mascotas/editar-mascota/${mascotaId}/historia-clinica/consulta/${consulta.con_id}/ver`), className: "bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium px-3 py-1 rounded-md transition", children: "\u270F\uFE0F Ver" })] })] }), _jsx("div", { className: `transition-all duration-300 ease-in-out overflow-hidden ${expanded === consulta.con_id ? 'max-h-96 mt-4 opacity-100' : 'max-h-0 opacity-0'}`, children: expanded === consulta.con_id && (_jsxs("div", { className: "pt-4 mt-2 border-t border-gray-200 bg-gray-50 rounded-md px-4 py-3 text-sm text-gray-700 space-y-2", children: [_jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDDD2\uFE0F Diagn\u00F3stico Presuntivo:" }), " ", consulta.con_diagnosticoPresuntivo || 'No especificado'] }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83E\uDDFE Observaciones:" }), " ", consulta.con_observaciones || 'No especificado'] }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDCCB Recomendaciones:" }), " ", consulta.con_recomendaciones || 'No especificado'] })] })) })] }, consulta.con_id))) }))] })] })] }));
};
export default HistoriaClinicaList;
