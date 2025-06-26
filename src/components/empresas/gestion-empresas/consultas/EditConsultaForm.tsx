import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getHistoriaClinicaByMascotaId } from "../../../../services/gestion-empresa/historia-clinica/historiaClinica";
import { getConsultaById, modifyConsulta } from "../../../../services/gestion-empresa/consultas/consulta";
import { useNavigate, useParams } from "react-router-dom";

const EditConsultaForm = () => {
  const { empresaId, mascotaId, consultaId, id } = useParams();
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

  // 🔄 Obtener datos de la consulta a editar
  useEffect(() => {
    const fetchConsulta = async () => {
      try {
        const data = await getConsultaById(consultaId!);
        setFormData({
          con_fecha: data.con_fecha,
          con_motivo: data.con_motivo,
          con_sintomas: data.con_sintomas,
          con_diagnostico: data.con_diagnostico,
          con_tratamiento: data.con_tratamiento,
          con_recomendaciones: data.con_recomendaciones,
          historiaClinica_id: data.historiaClinica_id,
          empresa_id: data.empresa_id,
        });
      } catch (error) {
        Swal.fire("Error", "No se pudo cargar la consulta", "error");
        navigate(-1);
      }
    };

    if (consultaId) fetchConsulta();
  }, [consultaId]);

  // 🔄 Obtener historia clínica
  useEffect(() => {
    const fetchHistoria = async () => {
      const historia = await getHistoriaClinicaByMascotaId(mascotaId!);
      if (historia) {
        setHistoriaClinicaId(historia.hic_id);
      } else {
        Swal.fire("Error", "La mascota no tiene historia clínica", "error");
        navigate(-1);
      }
    };
    fetchHistoria();
  }, [mascotaId]);

  const updateConsulta = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await modifyConsulta(consultaId!, formData);
      if (result) {
        Swal.fire({
          icon: "success",
          title: "¡Registro modificado!",
          text: "Los cambios fueron guardados correctamente.",
          timer: 2300,
          showConfirmButton: false,
          timerProgressBar: true,
          didClose: () => {
            navigate(`/mis-empresas/${id}/mascotas/${mascotaId}/historia-clinica`);
          },
        });
      } else {
        Swal.fire("Error", "No se pudo actualizar la consulta", "error");
      }
    } catch (error) {
      console.error("Error al actualizar el registro:", error);
    }
  };

  return (
    <form onSubmit={updateConsulta} className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">✏️ Modificar Consulta Médica</h2>

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
          Guardar Cambios
        </button>
      </div>
    </form>
  );
};

export default EditConsultaForm;
