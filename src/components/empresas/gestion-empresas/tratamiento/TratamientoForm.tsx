import { useState } from "react";
import Swal from "sweetalert2";
import { MedicamentoInput } from "../../../../types/tratamiento/tratamiento";
import { creartratamiento } from "../../../../services/gestion-empresa/tratamiento/tratamiento";

interface TratamientoFormProps {
    consultaId: number;
    mascotaId: number;
    empresaId: number;
    onSuccess?: () => void;
}

const TratamientoForm = ({ consultaId, mascotaId, empresaId, onSuccess }: TratamientoFormProps) => {
    const [medicamento, setMedicamento] = useState<MedicamentoInput>({
        med_id: 0, // valor por defecto para nuevos medicamentos
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
        } catch (error) {
            console.error(error);
            Swal.fire("❌ Error", "No se pudo guardar la receta", "error");
        }
    };

    return (
        <div className="bg-white rounded p-6 shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">💊 Tratamiento Prescrito</h3>
            <p className="mb-4 text-sm text-gray-600">Registra los medicamentos para esta consulta.</p>
            {/* Inputs de Medicamento y Dosis */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre del medicamento */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <input
                                type="text"
                                id="medicamento_nombre"
                                name="medicamento_nombre"
                                value={medicamento.nombre}
                                onChange={(e) =>
                                    setMedicamento({ ...medicamento, nombre: e.target.value })
                                }
                                className="block w-80 rounded-lg border-2 border-gray-400 bg-transparent px-3 py-3 text-base text-gray-800 focus:border-sky-600 focus:ring-1 focus:ring-sky-600 outline-none"
                                placeholder="Ejemplo: Meloxiam "
                            />
                            <label
                                htmlFor="medicamento_nombre"
                                className="absolute left-3 -top-3 text-gray-600 bg-gray-50 px-1 transition-all 
                 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:bg-gray-50"
                            >
                                Nombre del medicamento
                            </label>
                        </div>
                    </div>


                    {/* Dosis */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="relative bg-inherit">
                            <label
                                htmlFor="dosis"
                                className="absolute left-3 -top-3 text-gray-700 bg-gray-50 px-1 text-sm font-medium"
                            >
                                Dosis
                            </label>
                            <input
                                type="text"
                                id="dosis"
                                name="dosis"
                                value={medicamento.dosis}
                                onChange={(e) => setMedicamento({ ...medicamento, dosis: e.target.value })}
                                className="block w-80 rounded-lg border-2 border-gray-400 bg-transparent px-3 py-3 text-base text-gray-800 focus:border-sky-600 focus:ring-1 focus:ring-sky-600 outline-none"
                                placeholder="Dosis (Ej: 1 tab cada 12h por 5 días)"
                            />
                        </div>
                    </div>

                </div>
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
