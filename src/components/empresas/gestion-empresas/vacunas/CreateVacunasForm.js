import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { registrarVacuna, obtenerConsultaActiva, getVacunaPorMascota } from "../../../../services/gestion-empresa/vacunas/vacunas";
const tiposVacuna = [
    "Vacunación",
    "Desparasitación interna",
    "Desparasitación externa",
];
const CreateVacunasForm = () => {
    const { mascotaId, id: empresaId } = useParams();
    const [historiaClinicaId, setHistoriaClinicaId] = useState(null);
    const [vacunas, setVacunas] = useState([]);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        vac_fecha: "",
        vac_proxima: "",
        vac_tipo: "",
        vac_nombre: "",
        vac_lote: "",
        vac_observacion: "",
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    useEffect(() => {
        const fetchConsulta = async () => {
            try {
                const result = await obtenerConsultaActiva(empresaId, mascotaId);
                //setNumeroConsulta(result.con_numero_mascota);
                setHistoriaClinicaId(result.historiaClinica_id);
            }
            catch (err) {
                // Swal.fire("Error", "No se pudo cargar la consulta activa", "error");
                // console.error(err);
            }
        };
        if (empresaId && mascotaId) {
            fetchConsulta();
        }
    }, [empresaId, mascotaId]);
    useEffect(() => {
        const cargarVacunas = async () => {
            try {
                const data = await getVacunaPorMascota(mascotaId);
                setVacunas(data);
            }
            catch (error) {
                console.error("Error al obtener vacunas:", error);
            }
        };
        if (mascotaId) {
            cargarVacunas();
        }
    }, [mascotaId]);
    const handleFileChange = (e) => {
        if (!e.target.files)
            return;
        const nuevos = Array.from(e.target.files);
        const nombresExistentes = new Set(selectedFiles.map(f => f.name));
        const noDuplicados = nuevos.filter(f => !nombresExistentes.has(f.name));
        if (noDuplicados.length === 0) {
            Swal.fire("Archivo duplicado", "Ya seleccionaste estos archivos", "info");
            return;
        }
        setSelectedFiles(prev => [...prev, ...noDuplicados]);
    };
    const quitarArchivo = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!empresaId || !mascotaId || !historiaClinicaId) {
            Swal.fire("Error", "Faltan datos obligatorios", "error");
            return;
        }
        const payload = {
            vac_nombre: formData.vac_nombre,
            vac_tipo: formData.vac_tipo,
            vac_fecha: formData.vac_fecha,
            vac_lote: formData.vac_lote,
            vac_observacion: formData.vac_observacion,
            empresa_id: empresaId,
            mascota_id: mascotaId,
            historiaClinica_id: historiaClinicaId.toString(),
        };
        if (formData.vac_proxima && formData.vac_proxima.trim() !== "") {
            payload.vac_proxima = new Date(formData.vac_proxima).toISOString();
        }
        try {
            await registrarVacuna(payload, selectedFiles);
            Swal.fire("Éxito", "Vacuna registrada correctamente", "success").then(() => {
                navigate(`/mis-empresas/${empresaId}/mascotas/${mascotaId}/registrar-vacuna`);
            });
            setFormData({
                vac_fecha: "",
                vac_proxima: "",
                vac_tipo: "",
                vac_nombre: "",
                vac_lote: "",
                vac_observacion: "",
            });
            setSelectedFiles([]);
        }
        catch (error) {
            Swal.fire("Error", "No se pudo registrar la vacuna", "error");
            console.error(error);
        }
    };
    return (_jsxs("div", { className: "max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6 items-start", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold text-sky-800 mb-4", children: "\uD83D\uDCCB Vacunas registradas" }), vacunas.length === 0 ? (_jsx("p", { className: "text-gray-500", children: "No hay vacunas registradas a\u00FAn." })) : (_jsx("ul", { className: "space-y-3", children: vacunas.map((vacuna, index) => (_jsxs("li", { className: "bg-gray-100 p-3 rounded shadow-sm", children: [_jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDC89 Nombre producto:" }), " ", vacuna.vac_nombre] }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDCC5 Fecha:" }), " ", new Date(vacuna.vac_fecha).toLocaleDateString()] }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDD22 Lote:" }), " ", vacuna.vac_lote] }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83E\uDDEA Tipo:" }), " ", vacuna.vac_tipo] }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDCC6 Fecha proxima vacuna:" }), " ", new Date(vacuna.vac_proxima).toLocaleDateString()] })] }, index))) })), _jsx("button", { type: "submit", className: "bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded font-semibold", children: "imprimir Vacuna" })] }), _jsx("div", { children: _jsxs("form", { onSubmit: handleSubmit, className: "max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold text-sky-700", children: "\uD83D\uDC89 Registrar Vacuna o Desparasitaci\u00F3n" }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "\uD83D\uDCC5 Fecha de aplicaci\u00F3n" }), _jsx("input", { type: "date", value: formData.vac_fecha, onChange: (e) => setFormData({ ...formData, vac_fecha: e.target.value }), className: "w-full shadow-sm rounded p-2", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "\uD83E\uDDEA Tipo de procedimiento" }), _jsxs("select", { value: formData.vac_tipo, onChange: (e) => setFormData({ ...formData, vac_tipo: e.target.value }), className: "w-full shadow-sm rounded p-2", required: true, children: [_jsx("option", { value: "", children: "-- Selecciona tipo --" }), tiposVacuna.map((tipo) => (_jsx("option", { value: tipo, children: tipo }, tipo)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "\uD83D\uDC8A Nombre del producto aplicado" }), _jsx("input", { type: "text", value: formData.vac_nombre, onChange: (e) => setFormData({ ...formData, vac_nombre: e.target.value }), className: "w-full shadow-sm rounded p-2", placeholder: "Ej: Vanguard Plus 5, Drontal...", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "\uD83D\uDD22 N\u00FAmero de lote" }), _jsx("input", { type: "text", value: formData.vac_lote, onChange: (e) => setFormData({ ...formData, vac_lote: e.target.value }), className: "w-full shadow-sm rounded p-2", placeholder: "Ej: Lote XYZ123", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "\uD83D\uDCC6 Fecha de pr\u00F3xima dosis (opcional)" }), _jsx("input", { type: "date", value: formData.vac_proxima, onChange: (e) => setFormData({ ...formData, vac_proxima: e.target.value }), className: "w-full shadow-sm rounded p-2" })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "\uD83D\uDCDD Observaciones (opcional)" }), _jsx("textarea", { value: formData.vac_observacion, onChange: (e) => setFormData({ ...formData, vac_observacion: e.target.value }), className: "w-full shadow-sm rounded p-2", placeholder: "Ej: Pendiente alas siguiente vacunas", rows: 3 })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "\uD83D\uDCCE Adjuntar archivos (opcional)" }), _jsx("input", { type: "file", multiple: true, accept: "image/*,application/pdf", onChange: handleFileChange, className: "w-full shadow-sm rounded p-2" }), selectedFiles.length > 0 && (_jsx("ul", { className: "mt-2 space-y-1 text-sm", children: selectedFiles.map((file, i) => (_jsxs("li", { className: "flex justify-between items-center bg-gray-100 px-2 py-1 rounded", children: [_jsx("span", { className: "truncate", children: file.name }), _jsx("button", { type: "button", onClick: () => quitarArchivo(i), className: "text-red-600 hover:underline text-xs", children: "Quitar" })] }, i))) }))] }), _jsx("div", { className: "text-center pt-4", children: _jsx("button", { type: "submit", className: "bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded font-semibold", children: "Registrar Vacuna" }) })] }) })] }));
};
export default CreateVacunasForm;
