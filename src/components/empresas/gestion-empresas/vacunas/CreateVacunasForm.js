import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { registrarVacuna, 
// 🔹 asegúrate de tener este servicio
obtenerConsultaActiva, getVacunaPorMascota, updateVacuna, } from "../../../../services/gestion-empresa/vacunas/vacunas";
const tiposVacuna = [
    "Vacunación",
    "Desparasitación interna",
    "Desparasitación externa",
];
const CreateVacunasForm = () => {
    const { mascotaId, id: empresaId } = useParams();
    const [historiaClinicaId, setHistoriaClinicaId] = useState(null);
    const [vacunas, setVacunas] = useState([]);
    const [vacunaEditando, setVacunaEditando] = useState(null); // 🔹 vacuna seleccionada para editar
    const navigate = useNavigate();
    const fileInputRef = React.useRef(null);
    const [modalArchivo, setModalArchivo] = useState(null);
    const [formData, setFormData] = useState({
        vac_fecha: "",
        vac_proxima: "",
        vac_tipo: "",
        vac_nombre: "",
        vac_lote: "",
        vac_observacion: "",
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    // Obtener consulta activa
    useEffect(() => {
        const fetchConsulta = async () => {
            try {
                const result = await obtenerConsultaActiva(empresaId, mascotaId);
                setHistoriaClinicaId(result.historiaClinica_id);
            }
            catch (err) {
                console.error("Error al cargar consulta activa:", err);
            }
        };
        if (empresaId && mascotaId) {
            fetchConsulta();
        }
    }, [empresaId, mascotaId]);
    // Obtener vacunas de la mascota
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
    // Manejo de archivos
    const handleFileChange = (e) => {
        if (!e.target.files)
            return;
        const nuevos = Array.from(e.target.files);
        const nombresExistentes = new Set(selectedFiles.map((f) => f.name));
        const noDuplicados = nuevos.filter((f) => !nombresExistentes.has(f.name));
        if (noDuplicados.length === 0) {
            Swal.fire("Archivo duplicado", "Ya seleccionaste estos archivos", "info");
            return;
        }
        setSelectedFiles((prev) => [...prev, ...noDuplicados]);
    };
    const quitarArchivo = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };
    // Pasar vacuna al formulario para edición
    const handleEdit = (vacuna) => {
        setVacunaEditando({
            ...vacuna,
            id: vacuna.vac_id, // ✅ asegúrate de tener id numérico
        });
        setFormData({
            vac_fecha: vacuna.vac_fecha
                ? vacuna.vac_fecha.split("T")[0]
                : "",
            vac_proxima: vacuna.vac_proxima
                ? vacuna.vac_proxima.split("T")[0]
                : "",
            vac_tipo: vacuna.vac_tipo || "",
            vac_nombre: vacuna.vac_nombre || "",
            vac_lote: vacuna.vac_lote || "",
            vac_observacion: vacuna.vac_observacion || "",
        });
        setSelectedFiles([]);
    };
    // Cancelar edición
    const cancelarEdicion = () => {
        setVacunaEditando(null);
        setFormData({
            vac_fecha: "",
            vac_proxima: "",
            vac_tipo: "",
            vac_nombre: "",
            vac_lote: "",
            vac_observacion: "",
        });
        setSelectedFiles([]);
    };
    // Guardar (crear o editar)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!empresaId || !mascotaId || !historiaClinicaId) {
            Swal.fire("Error", "Faltan datos obligatorios", "error");
            return;
        }
        // Construir payload
        const payload = {
            vac_nombre: formData.vac_nombre || undefined,
            vac_tipo: formData.vac_tipo || undefined,
            vac_fecha: formData.vac_fecha || undefined,
            vac_lote: formData.vac_lote || undefined,
            vac_observacion: formData.vac_observacion || undefined,
            empresa_id: empresaId ? String(empresaId) : undefined,
            mascota_id: mascotaId ? String(mascotaId) : undefined,
            historiaClinica_id: historiaClinicaId ? String(historiaClinicaId) : undefined,
        };
        if (formData.vac_proxima) {
            payload.vac_proxima = formData.vac_proxima;
        }
        try {
            if (vacunaEditando) {
                const vacunaId = Number(vacunaEditando.id);
                const actualizada = await updateVacuna(vacunaId, payload, selectedFiles);
                setVacunas((prev) => prev.map((v) => (v.vac_id === actualizada.vac_id ? actualizada : v)));
            }
            else {
                const nuevaVacuna = await registrarVacuna(payload, selectedFiles);
                setVacunas((prev) => [...prev, nuevaVacuna]);
            }
            // Limpiar siempre al final
            setFormData({
                vac_fecha: "",
                vac_proxima: "",
                vac_tipo: "",
                vac_nombre: "",
                vac_lote: "",
                vac_observacion: "",
            });
            setVacunaEditando(null);
            setSelectedFiles([]); // ✅ limpiar imágenes siempre
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // limpia el input de archivos
            }
            Swal.fire("Éxito", vacunaEditando ? "Vacuna actualizada correctamente" : "Vacuna registrada correctamente", "success");
        }
        catch (error) {
            Swal.fire("Error", "No se pudo procesar la vacuna", "error");
            console.error(error);
        }
    };
    return (_jsxs("div", { className: "max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6 items-start", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-xl font-semibold text-sky-800 mb-4", children: ["\uD83D\uDCCBVacunas registradas", _jsx("button", { onClick: () => navigate(`/mis-empresas/${empresaId}/mascotas/${mascotaId}/historia-clinica`), className: "bg-purple-500 hover:bg-purple-600 text-white py-1.5 px-1 rounded-md transition ml-1", children: "\uD83D\uDD19 Regresar a historia clinica" })] }), vacunas.length === 0 ? (_jsx("p", { className: "text-gray-500", children: "No hay vacunas registradas a\u00FAn." })) : (_jsx("ul", { className: "space-y-3", children: vacunas.map((vacuna, index) => (_jsxs("li", { className: "bg-gray-100 p-3 rounded shadow-sm flex flex-col gap-2", children: [_jsxs("div", { children: [_jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDC89 Nombre producto:" }), " ", vacuna.vac_nombre] }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDCC5 Fecha:" }), " ", new Date(vacuna.vac_fecha).toLocaleDateString()] }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDD22 Lote:" }), " ", vacuna.vac_lote] }), _jsxs("p", { children: [_jsx("strong", { children: "\uD83E\uDDEA Tipo:" }), " ", vacuna.vac_tipo] }), vacuna.vac_proxima && (_jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDCC6 Pr\u00F3xima dosis:" }), " ", new Date(vacuna.vac_proxima).toLocaleDateString()] }))] }), _jsx("div", { className: "flex gap-2 items-center", children: _jsx("button", { onClick: () => handleEdit(vacuna), className: "text-blue-600 hover:underline text-sm", children: "Editar" }) }), vacuna.archivos && vacuna.archivos.length > 0 && (_jsx("div", { className: "flex gap-2 flex-wrap mt-2", children: vacuna.archivos.map((archivo, i) => (_jsx("div", { className: "relative w-16 h-16 border rounded overflow-hidden cursor-pointer", children: archivo.tipo === "imagen" ? (_jsx("img", { src: archivo.url, alt: "Archivo adjunto", className: "object-cover w-full h-full", onClick: () => setModalArchivo(archivo.url) })) : (_jsx("div", { className: "flex items-center justify-center bg-gray-300 w-full h-full text-xs text-center", onClick: () => window.open(archivo.url, "_blank"), children: "PDF" })) }, i))) }))] }, index))) }))] }), _jsx("div", { children: _jsxs("form", { onSubmit: handleSubmit, className: "max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-4", children: [_jsx("h2", { className: "text-2xl font-semibold text-sky-700", children: vacunaEditando ? "✏️ Editar Vacuna" : "💉 Registrar Vacuna o Desparasitación" }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "\uD83D\uDCC5 Fecha de aplicaci\u00F3n" }), _jsx("input", { type: "date", value: formData.vac_fecha, onChange: (e) => setFormData({ ...formData, vac_fecha: e.target.value }), className: "w-full shadow-sm rounded p-2", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "\uD83E\uDDEA Tipo de procedimiento" }), _jsxs("select", { value: formData.vac_tipo, onChange: (e) => setFormData({ ...formData, vac_tipo: e.target.value }), className: "w-full shadow-sm rounded p-2", required: true, children: [_jsx("option", { value: "", children: "-- Selecciona tipo --" }), tiposVacuna.map((tipo) => (_jsx("option", { value: tipo, children: tipo }, tipo)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "\uD83D\uDC8A Nombre del producto aplicado" }), _jsx("input", { type: "text", value: formData.vac_nombre, onChange: (e) => setFormData({ ...formData, vac_nombre: e.target.value }), className: "w-full shadow-sm rounded p-2", placeholder: "Ej: Vanguard Plus 5, Drontal...", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "\uD83D\uDD22 N\u00FAmero de lote" }), _jsx("input", { type: "text", value: formData.vac_lote, onChange: (e) => setFormData({ ...formData, vac_lote: e.target.value }), className: "w-full shadow-sm rounded p-2", placeholder: "Ej: Lote XYZ123", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "\uD83D\uDCC6 Fecha de pr\u00F3xima dosis (opcional)" }), _jsx("input", { type: "date", value: formData.vac_proxima, onChange: (e) => setFormData({ ...formData, vac_proxima: e.target.value }), className: "w-full shadow-sm rounded p-2" })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "\uD83D\uDCDD Observaciones (opcional)" }), _jsx("textarea", { value: formData.vac_observacion, onChange: (e) => setFormData({
                                        ...formData,
                                        vac_observacion: e.target.value,
                                    }), className: "w-full shadow-sm rounded p-2", placeholder: "Ej: Pendiente a las siguientes vacunas", rows: 3 })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: "\uD83D\uDCCE Adjuntar archivos (opcional)" }), _jsxs("label", { className: "inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-md cursor-pointer text-sm font-medium", children: ["\uD83D\uDCC1 Escoger archivos", _jsx("input", { ref: fileInputRef, type: "file", multiple: true, accept: "image/*,application/pdf", onChange: handleFileChange, className: "hidden" })] }), selectedFiles.length > 0 && (_jsx("div", { className: "mt-2 flex flex-wrap gap-3", children: selectedFiles.map((file, i) => (_jsxs("div", { className: "relative w-24 h-24 border rounded overflow-hidden shadow-sm flex flex-col items-center justify-center", children: [file.type.startsWith("image/") ? (_jsx("img", { src: URL.createObjectURL(file), alt: file.name, className: "w-full h-full object-cover" })) : (_jsx("div", { className: "flex items-center justify-center w-full h-full bg-gray-100 text-gray-700 text-xs px-1 text-center", children: file.name })), _jsx("button", { type: "button", onClick: () => quitarArchivo(i), className: "absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow", children: "\u00D7" })] }, i))) }))] }), _jsxs("div", { className: "text-center pt-4 flex gap-4 justify-center", children: [_jsx("button", { type: "submit", className: "bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded font-semibold", children: vacunaEditando ? "Actualizar Vacuna" : "Registrar Vacuna" }), vacunaEditando && (_jsx("button", { type: "button", onClick: cancelarEdicion, className: "bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded font-semibold", children: "Cancelar" }))] })] }) }), modalArchivo && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50", onClick: () => setModalArchivo(null), children: _jsx("img", { src: modalArchivo, alt: "Archivo ampliado", className: "max-h-[80%] max-w-[80%] rounded shadow-lg" }) }))] }));
};
export default CreateVacunasForm;
