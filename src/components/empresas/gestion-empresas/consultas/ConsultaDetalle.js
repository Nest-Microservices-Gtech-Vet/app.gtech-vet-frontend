import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getConsultaById } from "../../../../services/gestion-empresa/consultas/consulta";
import TratamientoForm from "../tratamiento/TratamientoForm";
import { tratamientoByConsultaId, } from "../../../../services/gestion-empresa/tratamiento/tratamiento";
import ExamenUploadForm from "../examenes/ExamenUploadForm";
import ExamenList from "../examenes/ExamenesList";
import { getExamenesPorConsulta } from "../../../../services/gestion-empresa/examenes/examen";
import EditarMedicamentosModal from "../tratamiento/EditarMedicamentoModal";
const ConsultaDetalle = () => {
    const { empresaId, mascotaId, consultaId, id, tratamientoId } = useParams();
    const [consulta, setConsulta] = useState(null);
    const [vacunas, setVacunas] = useState([]);
    const [tratamientos, setTratamientos] = useState([]);
    const [tratamientoSeleccionado, setTratamientoSeleccionado] = useState(null);
    const [examenes, setExamenes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [vistaActiva, setVistaActiva] = useState("tratamiento");
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const datosConsulta = await getConsultaById(consultaId);
                setConsulta(datosConsulta);
                // const listaVacunas = await getVacunasPorConsulta(consultaId!);
                // setVacunas(listaVacunas);
            }
            catch (err) {
                console.error(err);
                Swal.fire("Error", "No se pudieron cargar los datos", "error");
            }
        };
        fetchData();
    }, [consultaId]);
    // 
    useEffect(() => {
        fetchTratamientos(); // mueve esta función afuera
    }, [consulta]);
    const fetchTratamientos = async () => {
        if (!consulta?.con_id)
            return;
        try {
            const data = await tratamientoByConsultaId(consulta.con_id);
            setTratamientos(data);
        }
        catch (error) {
            console.error("Error al obtener tratamiento:", error);
        }
    };
    useEffect(() => {
        const fetchExamenes = async () => {
            if (!consulta?.con_id)
                return;
            try {
                const data = await getExamenesPorConsulta(consulta.con_id);
                setExamenes(data);
            }
            catch (error) {
                console.error("Error al obtener exámenes:", error);
            }
        };
        fetchExamenes();
    }, [consulta]);
    if (!consulta)
        return _jsx("p", { children: "\uD83D\uDD04 Cargando consulta..." });
    return (_jsxs("div", { className: "p-6 max-w-screen-2xl mx-auto bg-white shadow rounded", children: [_jsxs("h2", { className: "text-2xl font-bold mb-4 text-gray-800", children: ["\uD83E\uDE7A Consulta N\u00B0 ", consulta.con_numero_mascota] }), _jsx("div", { className: "flex gap-4 mb-6", children: _jsx("button", { onClick: () => navigate(-1), className: "bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md transition", children: "\uD83D\uDD19 Volver" }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-1 bg-gray-50 rounded-lg p-6 shadow-inner", children: [_jsx("h3", { className: "text-xl font-semibold mb-4 text-gray-700", children: "\uD83D\uDCC4 Detalles de la Consulta" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2", children: [_jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDCC5 Fecha:" }), " ", new Date(consulta.con_fecha).toLocaleDateString()] }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDCDD Motivo:" }), " ", consulta.con_motivo] }), _jsxs("p", { children: [_jsx("strong", { children: "\u2696\uFE0F Peso:" }), " ", consulta.con_peso, " kg"] }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83C\uDF21\uFE0F Temperatura:" }), " ", consulta.con_temperaturaCorporal, "\u00B0C"] }), _jsxs("p", { children: [_jsx("strong", { children: "\u2764\uFE0F Pulso:" }), " ", consulta.con_pulso] }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83E\uDEC1 Frecuencia Respiratoria:" }), " ", consulta.con_frecuenciaRespiratoria] }), _jsxs("p", { children: [_jsx("strong", { children: "\u2764\uFE0F Frecuencia Cardiaca:" }), " ", consulta.con_frecuenciaCardiaca] }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83E\uDE7B Diagn\u00F3stico:" }), " ", consulta.con_diagnosticoPresuntivo] }), _jsxs("p", { className: "col-span-2", children: [_jsx("strong", { children: "\uD83D\uDCDD Observaciones:" }), " ", consulta.con_observaciones] }), _jsxs("p", { className: "col-span-2", children: [_jsx("strong", { children: "\u2705 Recomendaciones:" }), " ", consulta.con_recomendaciones] })] }), _jsxs("div", { className: "flex flex-wrap gap-2 mt-6", children: [_jsx("button", { onClick: () => setVistaActiva("tratamiento"), className: `py-2 px-4 rounded-md transition ${vistaActiva === "tratamiento" ? "bg-sky-500 text-white" : "bg-gray-200 text-gray-700"}`, children: "\uD83D\uDC8A Tratamiento" }), _jsx("button", { onClick: () => setVistaActiva("examenes"), className: `py-2 px-4 rounded-md transition ${vistaActiva === "examenes" ? "bg-sky-500 text-white" : "bg-gray-200 text-gray-700"}`, children: "\uD83E\uDDEA Ex\u00E1menes" })] })] }), _jsxs("div", { className: "lg:col-span-2 bg-white rounded-lg p-6 shadow-md", children: [vistaActiva === "tratamiento" && (_jsxs(_Fragment, { children: [_jsx(TratamientoForm, { consultaId: consulta.con_id, mascotaId: consulta.mascota_id, empresaId: parseInt(id), onSuccess: fetchTratamientos }), tratamientos.length === 0 ? (_jsx("p", { className: "text-gray-500 mt-4", children: "No hay tratamientos registrados." })) : (tratamientos.map((tratamiento) => (_jsxs("div", { className: "mt-6 border-t pt-4", children: [_jsxs("h4", { className: "text-md font-semibold mb-2 text-gray-700", children: ["\uD83E\uDDFE Tratamiento #", tratamiento.tra_id] }), _jsxs("p", { children: ["\uD83D\uDCC6 Fecha: \u00A0", tratamiento.created_at
                                                        ? new Date(tratamiento.created_at).toLocaleDateString()
                                                        : "Sin fecha"] }), _jsx("ul", { className: "list-disc list-inside text-sm text-gray-800 space-y-1", children: tratamiento.medicamentos.map((m) => (_jsxs("li", { children: [_jsx("strong", { children: m.med_nombre }), " \u2013 ", m.med_dosis] }, m.med_id))) }), _jsx("button", { onClick: () => setTratamientoSeleccionado(tratamiento), className: "mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded", children: "\u270F\uFE0F Editar medicamentos" }), tratamientoSeleccionado && (_jsx(EditarMedicamentosModal, { tratamiento: tratamientoSeleccionado, onClose: () => setTratamientoSeleccionado(null), onUpdated: () => {
                                                    fetchTratamientos(); // recarga lista
                                                    setTratamientoSeleccionado(null);
                                                } }))] }, tratamiento.tra_id)))), _jsx("div", { children: _jsx("button", { type: "submit", className: "bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded font-semibold", children: "imprimir Receta" }) })] })), vistaActiva === "examenes" && (_jsxs(_Fragment, { children: [_jsx("h3", { className: "text-xl font-semibold mb-4 text-gray-700", children: "\uD83E\uDDEA Ex\u00E1menes Realizados" }), _jsx("p", { children: "Aqu\u00ED puedes mostrar o registrar los ex\u00E1menes realizados." }), _jsx(ExamenUploadForm, { empresaId: parseInt(id), consultaId: consulta.con_id, onUploadSuccess: () => {
                                            // recarga exámenes al subir
                                            getExamenesPorConsulta(consulta.con_id).then(setExamenes);
                                        } }), _jsx("div", { className: "mt-6", children: _jsx(ExamenList, { examenes: examenes }) })] }))] })] })] }));
};
export default ConsultaDetalle;
