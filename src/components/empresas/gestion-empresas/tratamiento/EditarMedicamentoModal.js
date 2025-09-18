import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Swal from "sweetalert2";
import { updateTratamiento } from "../../../../services/gestion-empresa/tratamiento/tratamiento";
const EditarMedicamentosModal = ({ tratamiento, onClose, onUpdated }) => {
    const [listaMedicamentos, setListaMedicamentos] = useState(tratamiento.medicamentos.map((m) => ({
        nombre: m.med_nombre,
        dosis: m.med_dosis,
        empresa_id: tratamiento.empresa_id,
    })));
    const handleChange = (index, field, value) => {
        const updated = [...listaMedicamentos];
        updated[index] = { ...updated[index], [field]: value };
        setListaMedicamentos(updated);
    };
    const guardarCambios = async () => {
        try {
            const updated = await updateTratamiento(tratamiento.tra_id, {
                consulta_id: tratamiento.consulta_id,
                mascota_id: tratamiento.mascota_id,
                empresa_id: tratamiento.empresa_id,
                medicamentos: listaMedicamentos,
            });
            Swal.fire("✅ Actualizado", "El tratamiento fue modificado", "success");
            onUpdated(updated);
            onClose();
        }
        catch (error) {
            console.error(error);
            Swal.fire("❌ Error", "No se pudo actualizar el tratamiento", "error");
        }
    };
    return (_jsxs("div", { className: "fixed inset-0 flex items-center justify-center z-50 pointer-events-none", children: [_jsx("div", { className: "absolute inset-0 backdrop-blur-xs" }), _jsxs("div", { className: "relative pointer-events-auto bg-white backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-lg p-6 z-10 transform transition duration-300 scale-95 animate-fadeIn", children: [_jsx("h2", { className: "text-2xl font-semibold mb-5 flex items-center gap-2", children: "\u270F\uFE0F Editar Medicamentos" }), listaMedicamentos.map((m, idx) => (_jsxs("div", { className: "mb-4 flex gap-3", children: [_jsx("input", { type: "text", value: m.nombre, onChange: (e) => handleChange(idx, "nombre", e.target.value), className: "flex-1 border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder-gray-400 bg-white/50", placeholder: "Nombre" }), _jsx("input", { type: "text", value: m.dosis, onChange: (e) => handleChange(idx, "dosis", e.target.value), className: "flex-1 border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder-gray-400 bg-white/50", placeholder: "Dosis" })] }, idx))), _jsxs("div", { className: "flex justify-end gap-3 mt-6", children: [_jsx("button", { onClick: onClose, className: "px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition font-medium", children: "Cancelar" }), _jsx("button", { onClick: guardarCambios, className: "px-5 py-2 rounded-xl bg-sky-600 text-white hover:bg-sky-700 transition font-medium", children: "Guardar cambios" })] })] })] }));
};
export default EditarMedicamentosModal;
