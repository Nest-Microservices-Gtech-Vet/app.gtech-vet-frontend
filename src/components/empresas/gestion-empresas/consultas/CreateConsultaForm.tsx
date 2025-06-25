import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Swal from "sweetalert2";
import { getHistoriaClinicaByMascotaId } from "../../../../services/gestion-empresa/historia-clinica/historiaClinica";
import { crearConsulta } from "../../../../services/gestion-empresa/consultas/consulta";

const CreateConsultaForm = () => {
    const { empresaId } = useParams();
    const { mascotaId } = useParams();
    const { id } = useParams();
    const navigate = useNavigate();
    const [historiaClinicaId, setHistoriaClinicaId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        con_fecha: new Date().toISOString(),
        con_motivo: "",
        con_sintomas: "",
        con_diagnostico: "",
        con_tratamiento: "",
        con_recomendaciones: "",
        historiaClinica_id: 0,
        empresa_id: Number(id),
    });

    useEffect(() => {
        const fetchHistoria = async () => {
            const historia = await getHistoriaClinicaByMascotaId(mascotaId!);
            if (historia) {
                setHistoriaClinicaId(historia.hic_id);
                setFormData((prev) => ({
                    ...prev,
                    historiaClinica_id: historia.hic_id,
                }));
            } else {
                Swal.fire("Error", "La mascota no tiene historia clínica", "error");
                navigate(-1);
            }
        };
        fetchHistoria();
    }, [mascotaId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const resultado = await crearConsulta(formData);
        if (resultado) {
            Swal.fire("Consulta registrada", "Se agregó la consulta correctamente", "success").then(() => {
                navigate(`/mis-empresas/${id}/mascotas/${mascotaId}/historia-clinica`);
            });
        } else {
            Swal.fire("Error", "No se pudo registrar la consulta", "error");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">➕ Nueva Consulta Médica</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                    type="text"
                    placeholder="Motivo de consulta"
                    value={formData.con_motivo}
                    onChange={(e) => setFormData({ ...formData, con_motivo: e.target.value })}
                    required
                    className="border rounded p-2 w-full"
                />

                <input
                    type="text"
                    placeholder="Síntomas"
                    value={formData.con_sintomas}
                    onChange={(e) => setFormData({ ...formData, con_sintomas: e.target.value })}
                    className="border rounded p-2 w-full"
                />

                <input
                    type="text"
                    placeholder="Diagnóstico"
                    value={formData.con_diagnostico}
                    onChange={(e) => setFormData({ ...formData, con_diagnostico: e.target.value })}
                    className="border rounded p-2 w-full"
                />

                <input
                    type="text"
                    placeholder="Tratamiento"
                    value={formData.con_tratamiento}
                    onChange={(e) => setFormData({ ...formData, con_tratamiento: e.target.value })}
                    className="border rounded p-2 w-full"
                />

                <input
                    type="text"
                    placeholder="Recomendaciones"
                    value={formData.con_recomendaciones}
                    onChange={(e) => setFormData({ ...formData, con_recomendaciones: e.target.value })}
                    className="border rounded p-2 w-full"
                />
            </div>

            <div className="mt-6 text-center">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
                >
                    Guardar Consulta
                </button>
            </div>
        </form>
    );
};

export default CreateConsultaForm;
