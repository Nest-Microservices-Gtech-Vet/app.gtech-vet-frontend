import { useState } from "react";
import Swal from "sweetalert2";
import { TratamientoResponse, MedicamentoInput } from "../../../../types/tratamiento/tratamiento";
import { updateTratamiento } from "../../../../services/gestion-empresa/tratamiento/tratamiento";

interface EditarMedicamentosModalProps {
    tratamiento: TratamientoResponse;
    onClose: () => void;
    onUpdated: (t: TratamientoResponse) => void;
}

const EditarMedicamentosModal = ({ tratamiento, onClose, onUpdated }: EditarMedicamentosModalProps) => {
    const [listaMedicamentos, setListaMedicamentos] = useState<MedicamentoInput[]>(
        tratamiento.medicamentos.map(m => ({
            med_id: m.med_id,
            nombre: m.med_nombre,
            dosis: m.med_dosis,
            empresa_id: tratamiento.empresa_id,
        }))
    );

    const handleChange = (index: number, field: keyof MedicamentoInput, value: string) => {
        const updated = [...listaMedicamentos];
        (updated[index] as any)[field] = value;
        setListaMedicamentos(updated);
    };

    const guardarCambios = async () => {
    try {
        // Mapear para quitar med_id
        const payload = listaMedicamentos.map(({ med_id, ...rest }) => rest);

        const updated = await updateTratamiento(tratamiento.tra_id, {
            consulta_id: tratamiento.consulta_id,
            mascota_id: tratamiento.mascota_id,
            empresa_id: tratamiento.empresa_id,
            medicamentos: payload,
        });

        Swal.fire("✅ Actualizado", "El tratamiento fue modificado", "success");
        onUpdated(updated); // le avisa al padre
        onClose();
    } catch (error: any) {
        console.error(error);
        Swal.fire("❌ Error", error?.message || "No se pudo actualizar el tratamiento", "error");
    }
};


    return (
        <div className="fixed inset-0 bg-white bg-opacity-10 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-4">✏️ Editar Medicamentos</h2>

                {listaMedicamentos.map((m, idx) => (
                    <div key={m.med_id || idx} className="mb-3">
                        <input
                            type="text"
                            value={m.nombre}
                            onChange={(e) => handleChange(idx, "nombre", e.target.value)}
                            className="border p-2 rounded mr-2"
                            placeholder="Nombre"
                        />
                        <input
                            type="text"
                            value={m.dosis}
                            onChange={(e) => handleChange(idx, "dosis", e.target.value)}
                            className="border p-2 rounded"
                            placeholder="Dosis"
                        />
                    </div>
                ))}

                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300">Cancelar</button>
                    <button onClick={guardarCambios} className="px-4 py-2 rounded bg-blue-600 text-white">
                        Guardar cambios
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditarMedicamentosModal;
