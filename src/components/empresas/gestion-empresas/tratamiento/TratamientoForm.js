import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Swal from "sweetalert2";
import { creartratamiento } from "../../../../services/gestion-empresa/tratamiento/tratamiento";
const TratamientoForm = ({ consultaId, mascotaId, empresaId, onSuccess }) => {
    const [medicamento, setMedicamento] = useState({
        med_id: 0, // valor por defecto para nuevos medicamentos
        nombre: "",
        dosis: "",
        empresa_id: empresaId,
    });
    const [listaMedicamentos, setListaMedicamentos] = useState([]);
    const handleChange = (field, value) => {
        setMedicamento({ ...medicamento, [field]: value });
    };
    const agregarMedicamento = () => {
        if (!medicamento.nombre || !medicamento.dosis) {
            Swal.fire("Campos incompletos", "Nombre y dosis son obligatorios", "warning");
            return;
        }
        setListaMedicamentos([...listaMedicamentos, { ...medicamento }]);
        setMedicamento({
            med_id: 0,
            nombre: "",
            dosis: "",
            empresa_id: empresaId,
        });
    };
    const guardarTratamiento = async () => {
        if (listaMedicamentos.length === 0) {
            Swal.fire("❌ Error", "Agrega al menos un medicamento a la receta", "error");
            return;
        }
        try {
            await creartratamiento({
                consulta_id: consultaId,
                mascota_id: mascotaId,
                empresa_id: empresaId,
                medicamentos: listaMedicamentos.map(({ nombre, dosis }) => ({
                    nombre,
                    dosis,
                    empresa_id: empresaId,
                })),
            });
            Swal.fire("✅ Receta guardada", "El tratamiento fue registrado", "success");
            setListaMedicamentos([]);
            if (onSuccess) {
                onSuccess(); // ✅ Notifica al componente padre que se guardó
            }
        }
        catch (error) {
            console.error(error);
            Swal.fire("❌ Error", "No se pudo guardar la receta", "error");
        }
    };
    return (_jsxs("div", { className: "bg-white rounded p-6 shadow", children: [_jsx("h3", { className: "text-xl font-semibold mb-4 text-gray-700", children: "\uD83D\uDC8A Tratamiento Prescrito" }), _jsx("p", { className: "mb-4 text-sm text-gray-600", children: "Registra los medicamentos para esta consulta." }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4", children: [_jsx("div", { className: "bg-gray-white p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsx("input", { type: "text", id: "nombre", name: "nombre", value: medicamento.nombre, onChange: (e) => handleChange("nombre", e.target.value), placeholder: "Ejemplo: Meloxicam", required: true, className: "peer bg-transparent h-10 w-72 rounded-lg text-black-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600" }), _jsx("label", { htmlFor: "nombre", className: `
        absolute left-2 bg-gray-50 px-1 text-gray-500 transition-all
        peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:w-full
        peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:w-auto
        peer-focus:bg-gray-50
        -top-3 text-sm w-auto 
      `, children: "Nombre del medicamento" })] }) }), _jsx("div", { className: "bg-gray-white p-4 rounded-lg", children: _jsxs("div", { className: "relative bg-inherit", children: [_jsx("input", { type: "text", id: "dosis", name: "dosis", value: medicamento.dosis, onChange: (e) => handleChange("dosis", e.target.value), placeholder: "Dosis (Ej: 1 tab cada 12h por 5 d\u00EDas)", required: true, className: "peer bg-transparent h-10 w-72 rounded-lg text-black-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600" }), _jsx("label", { htmlFor: "dosis", className: `
        absolute left-2 bg-gray-50 px-1 text-gray-500 transition-all
        peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:w-full
        peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:w-auto
        peer-focus:bg-gray-50
        -top-3 text-sm w-auto 
      `, children: "Dosis" })] }) })] }), _jsx("div", { className: "flex gap-2 mb-6", children: _jsx("button", { type: "button", onClick: agregarMedicamento, className: "bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded", children: "\u2795 Agregar a receta" }) }), listaMedicamentos.length > 0 && (_jsxs("div", { className: "mb-6", children: [_jsx("h4", { className: "text-md font-semibold mb-2 text-gray-700", children: "\uD83D\uDCCB Medicamentos en receta:" }), _jsx("ul", { className: "list-disc list-inside text-sm text-gray-800 space-y-1", children: listaMedicamentos.map((m, idx) => (_jsxs("li", { children: [_jsx("strong", { children: m.nombre }), " \u2013 ", m.dosis] }, idx))) })] })), _jsx("button", { type: "button", onClick: guardarTratamiento, className: "bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded", children: "\uD83D\uDCBE Guardar receta" })] }));
};
export default TratamientoForm;
