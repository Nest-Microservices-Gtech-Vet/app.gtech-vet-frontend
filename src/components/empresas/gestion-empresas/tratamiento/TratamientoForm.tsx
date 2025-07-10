import { useState } from "react";
import Swal from "sweetalert2";
import { MedicamentoInput } from "../../../../types/tratamiento/tratamiento";
import { creartratamiento } from "../../../../services/gestion-empresa/tratamiento/tratamiento";



interface TratamientoFormProps {
    consultaId: number;
    mascotaId: number;
    empresaId: number;
}

const TratamientoForm = ({ consultaId, mascotaId, empresaId }: TratamientoFormProps) => {
    const [medicamento, setMedicamento] = useState<MedicamentoInput>({
        nombre: "",
        dosis: "",
        empresa_id: empresaId,

    });

    const [listaMedicamentos, setListaMedicamentos] = useState<MedicamentoInput[]>([]);

    const handleChange = (field: keyof MedicamentoInput, value: string) => {
        setMedicamento({ ...medicamento, [field]: value });
    };

    const agregarMedicamento = () => {
        if (!medicamento.nombre || !medicamento.dosis) {
            Swal.fire("Campos incompletos", "Nombre y dosis son obligatorios", "warning");
            return;
        }

        setListaMedicamentos([...listaMedicamentos, medicamento]);
        setMedicamento({ nombre: "", dosis: "" ,empresa_id: empresaId });
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
                medicamentos: listaMedicamentos.map(({ nombre, dosis }) => ({ nombre, dosis,empresa_id: empresaId,  })),
            });

            Swal.fire("✅ Receta guardada", "El tratamiento fue registrado", "success");
            setListaMedicamentos([]);
        } catch (error) {
            console.error(error);
            Swal.fire("❌ Error", "No se pudo guardar la receta", "error");
        }
    };

    return (
        <div className="bg-white rounded p-6 shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">💊 Tratamiento Prescrito</h3>
            <p className="mb-4 text-sm text-gray-600">Registra los medicamentos para esta consulta.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                    type="text"
                    value={medicamento.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                    placeholder="Nombre del medicamento"
                    className="border rounded px-3 py-2 w-full"
                />
                <input
                    type="text"
                    value={medicamento.dosis}
                    onChange={(e) => handleChange("dosis", e.target.value)}
                    placeholder="Dosis (Ej: 1 tab cada 12h por 5 días)"
                    className="border rounded px-3 py-2 w-full"
                />
                
            </div>

            <div className="flex gap-2 mb-6">
                <button
                    type="button"
                    onClick={agregarMedicamento}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                >
                    ➕ Agregar a receta
                </button>
            </div>

            {listaMedicamentos.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-md font-semibold mb-2 text-gray-700">📋 Medicamentos en receta:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                        {listaMedicamentos.map((m, idx) => (
                            <li key={idx}>
                                <strong>{m.nombre}</strong> – {m.dosis}
                                
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button
                type="button"
                onClick={guardarTratamiento}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
                💾 Guardar receta
            </button>
        </div>

        
    );
};

export default TratamientoForm;
