import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Swal from "sweetalert2";
import { subirExamen } from "../../../../services/gestion-empresa/examenes/examen";
const CATEGORIAS = ["patologia", "rayosx"];
const TIPOS = ["solicitud", "resultado"];
const ExamenUploadForm = ({ empresaId, consultaId, onUploadSuccess }) => {
    const [descripcion, setDescripcion] = useState("");
    const [categoriasActivas, setCategoriasActivas] = useState({
        patologia: false,
        rayosx: false,
    });
    const [archivos, setArchivos] = useState({
        patologia: { solicitud: [], resultado: [] },
        rayosx: { solicitud: [], resultado: [] },
    });
    const handleCheckboxChange = (cat) => {
        setCategoriasActivas((prev) => ({ ...prev, [cat]: !prev[cat] }));
    };
    const handleFileChange = (cat, tipo, files) => {
        if (!files)
            return;
        setArchivos((prev) => ({
            ...prev,
            [cat]: {
                ...prev[cat],
                [tipo]: [...prev[cat][tipo], ...Array.from(files)],
            },
        }));
    };
    const quitarArchivo = (cat, tipo, index) => {
        setArchivos((prev) => ({
            ...prev,
            [cat]: {
                ...prev[cat],
                [tipo]: prev[cat][tipo].filter((_, i) => i !== index),
            },
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validar que haya al menos un archivo seleccionado
        const hayArchivos = CATEGORIAS.some((cat) => categoriasActivas[cat] &&
            TIPOS.some((tipo) => archivos[cat][tipo].length > 0));
        if (!hayArchivos) {
            Swal.fire({
                icon: "warning",
                title: "Ningún archivo seleccionado",
                text: "Por favor, selecciona al menos un archivo para subir.",
                confirmButtonColor: "#6366F1",
            });
            return;
        }
        try {
            for (const categoria of CATEGORIAS) {
                if (!categoriasActivas[categoria])
                    continue;
                for (const tipo of TIPOS) {
                    const files = archivos[categoria][tipo];
                    if (files.length === 0)
                        continue;
                    const formData = new FormData();
                    formData.append("tipo", categoria);
                    formData.append("categoria", tipo);
                    formData.append("descripcion", descripcion || `${categoria} - ${tipo}`);
                    formData.append("consulta_id", String(consultaId));
                    formData.append("empresa_id", String(empresaId));
                    files.forEach((file) => formData.append("files", file));
                    await subirExamen(formData);
                }
            }
            Swal.fire({
                icon: "success",
                title: "Éxito",
                text: "Exámenes subidos correctamente",
                confirmButtonColor: "#6366F1",
            });
            // Reset de formulario
            setDescripcion("");
            setArchivos({
                patologia: { solicitud: [], resultado: [] },
                rayosx: { solicitud: [], resultado: [] },
            });
            setCategoriasActivas({
                patologia: false,
                rayosx: false,
            });
            if (onUploadSuccess)
                onUploadSuccess();
        }
        catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo subir uno o más exámenes",
                confirmButtonColor: "#6366F1",
            });
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [CATEGORIAS.map((cat) => (_jsxs("div", { className: " p-4 rounded shadow-sm bg-white", children: [_jsxs("label", { className: "flex items-center gap-2 font-semibold text-lg", children: [_jsx("input", { type: "checkbox", checked: categoriasActivas[cat], onChange: () => handleCheckboxChange(cat) }), cat === "patologia" ? "🧬 Patología" : "🩻 Rayos X"] }), categoriasActivas[cat] && (_jsx("div", { className: "mt-4 space-y-4", children: TIPOS.map((tipo) => (_jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1", children: tipo === "solicitud" ? "Solicitud" : "Resultado" }), _jsxs("label", { className: "inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-md cursor-pointer text-sm font-medium", children: ["\uD83D\uDCC1 Escoger archivos", _jsx("input", { type: "file", multiple: true, accept: "image/*", onChange: (e) => handleFileChange(cat, tipo, e.target.files), className: "hidden" })] }), _jsx("div", { className: "mt-2 flex flex-wrap gap-3", children: archivos[cat][tipo]
                                        .filter((file) => file.type.startsWith("image/"))
                                        .map((file, i) => (_jsxs("div", { className: "relative w-20 h-20 border rounded overflow-hidden shadow-sm", children: [_jsx("img", { src: URL.createObjectURL(file), alt: file.name, className: "w-full h-full object-cover" }), _jsx("button", { type: "button", onClick: () => quitarArchivo(cat, tipo, i), className: "absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow", children: "\u00D7" })] }, i))) })] }, tipo))) }))] }, cat))), _jsx("button", { type: "submit", className: "bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded shadow", children: "\uD83D\uDCE4 Subir Ex\u00E1menes" })] }));
};
export default ExamenUploadForm;
