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
            Swal.fire("Éxito", "Exámenes subidos correctamente", "success");
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
            Swal.fire("Error", "No se pudo subir uno o más exámenes", "error");
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [CATEGORIAS.map((cat) => (_jsxs("div", { className: " p-4 rounded shadow-sm bg-white", children: [_jsxs("label", { className: "flex items-center gap-2 font-semibold text-lg", children: [_jsx("input", { type: "checkbox", checked: categoriasActivas[cat], onChange: () => handleCheckboxChange(cat) }), cat === "patologia" ? "🧬 Patología" : "🩻 Rayos X"] }), categoriasActivas[cat] && (_jsx("div", { className: "mt-4 space-y-4", children: TIPOS.map((tipo) => (_jsxs("div", { children: [_jsxs("label", { className: "block font-semibold", children: ["\uD83D\uDCC1 ", tipo === "solicitud" ? "Solicitud" : "Resultado"] }), _jsx("input", { type: "file", multiple: true, onChange: (e) => handleFileChange(cat, tipo, e.target.files), className: "w-full mt-1" }), archivos[cat][tipo].length > 0 && (_jsx("ul", { className: "mt-2 space-y-1 text-sm", children: archivos[cat][tipo].map((file, i) => (_jsxs("li", { className: "flex justify-between items-center bg-gray-100 px-2 py-1 rounded", children: [_jsx("span", { className: "truncate", children: file.name }), _jsx("button", { type: "button", onClick: () => quitarArchivo(cat, tipo, i), className: "text-red-600 hover:underline text-xs", children: "Quitar" })] }, i))) }))] }, tipo))) }))] }, cat))), _jsx("button", { type: "submit", className: "bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded shadow", children: "\uD83D\uDCE4 Subir Ex\u00E1menes" })] }));
};
export default ExamenUploadForm;
