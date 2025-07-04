import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getHistoriaClinicaByMascotaId } from "../../../../services/gestion-empresa/historia-clinica/historiaClinica";
import { getConsultaById, modifyConsulta } from "../../../../services/gestion-empresa/consultas/consulta";
import { useNavigate, useParams } from "react-router-dom";
import { Patologia } from "../../../../types/patologias/patologias";
import { Consulta } from "../../../../types/consulta/consulta";
import { getPatologiasByEspecieRaza } from "../../../../services/gestion-empresa/patologias/patologias";
import { getMascotaById } from "../../../../services/gestion-empresa/mascotas/mascotas";

const EditConsultaForm = () => {
  const { empresaId, mascotaId, consultaId, id } = useParams();
  const navigate = useNavigate();
  const [historiaClinicaId, setHistoriaClinicaId] = useState<number | null>(null);
  const [patologias, setPatologias] = useState<Patologia[]>([]);
  const [selectedPatologias, setSelectedPatologias] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    con_fecha: new Date().toISOString(),
    con_motivo: "",
    con_peso: 0,
    con_temperaturaCorporal: 0,
    con_icc: "",
    con_pulso: 0,
    con_frecuenciaRespiratoria: 0,
    con_frecuenciaCardiaca: 0,
    con_hidratacion: "",
    con_mucosas: "",
    con_campoPulmonar: "",
    con_palpacionAbdominal: "",
    con_diagnosticoPresuntivo: "",
    con_observaciones: "",
    con_recomendaciones: "",
    historiaClinica_id: 0,
    empresa_id: Number(id),
    mascota_id: Number(mascotaId)
  });




  useEffect(() => {
    const fetchDatos = async () => {
      try {
        // 1. Historia clínica
        const historia = await getHistoriaClinicaByMascotaId(mascotaId!);
        if (!historia) {
          Swal.fire("Error", "La mascota no tiene historia clínica", "error");
          navigate(-1);
          return;
        }
        setHistoriaClinicaId(historia.hic_id);

        // 2. Mascota
        const mascota = await getMascotaById(mascotaId!);

        // 3. Patologías por especie y raza
        const lista = await getPatologiasByEspecieRaza(mascota.especie_id, mascota.raza_id);
        setPatologias(lista);

        // 4. Consulta
        const consulta = await getConsultaById(consultaId!);
        setFormData({
          con_fecha: consulta.con_fecha,
          con_motivo: consulta.con_motivo,
          con_peso: consulta.con_peso,
          con_temperaturaCorporal: consulta.con_temperaturaCorporal,
          con_icc: consulta.con_icc,
          con_pulso: consulta.con_pulso,
          con_frecuenciaRespiratoria: consulta.con_frecuenciaRespiratoria,
          con_frecuenciaCardiaca: consulta.con_frecuenciaCardiaca,
          con_hidratacion: consulta.con_hidratacion,
          con_mucosas: consulta.con_mucosas,
          con_campoPulmonar: consulta.con_campoPulmonar,
          con_palpacionAbdominal: consulta.con_palpacionAbdominal,
          con_diagnosticoPresuntivo: consulta.con_diagnosticoPresuntivo,
          con_observaciones: consulta.con_observaciones,
          con_recomendaciones: consulta.con_recomendaciones,
          historiaClinica_id: consulta.historiaClinica_id,
          empresa_id: consulta.empresa_id,
          mascota_id: consulta.mascota_id,
        });

        // 5. Patologías seleccionadas
        if (consulta.patologiasIds && Array.isArray(consulta.patologiasIds)) {
          const idsPatologias = consulta.patologiasIds.map((p: any) => p.pat_id);
          setSelectedPatologias(idsPatologias);
        }

      } catch (error) {
        Swal.fire("Error", "No se pudo cargar la información necesaria", "error");
        console.error(error);
        navigate(-1);
      }
    };

    fetchDatos();
  }, [mascotaId, consultaId]);




  const handleNumberChange = (key: keyof Consulta, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value === "" ? 0 : parseFloat(value),
    }));
  };

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
    <form onSubmit={updateConsulta} className="w-full max-w-5xl bg-gray-50 p-5 rounded-lg shadow-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">✏️ Modificar Consulta Médica</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 p-4 rounded-lg">

        {/* Motivo de consulta */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="relative bg-inherit">
            <input
              type="text"
              id="con_motivo"
              name="con_motivo"
              value={formData.con_motivo}
              onChange={(e) => setFormData({ ...formData, con_motivo: e.target.value })}
              placeholder="Ejemplo: Tos y fiebre"
              required
              className="peer bg-transparent h-10 w-72 rounded-lg text-black-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
            />
            <label
              htmlFor="con_motivo"
              className={`
        absolute left-2 bg-gray-50 px-1 text-gray-500 transition-all
        peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:w-full
        peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:w-auto
        peer-focus:bg-gray-50
        -top-3 text-sm w-auto 
      `}
            >
              Motivo de consulta
            </label>
          </div>
        </div>

        {/* Peso */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="relative bg-inherit">
            <input
              type="number"
              id="con_peso"
              name="con_peso"
              value={formData.con_peso || ""}
              onChange={(e) => handleNumberChange("con_peso", e.target.value)}
              placeholder="Ejemplo: 5.2"
              className="peer bg-transparent h-10 w-72 rounded-lg text-black-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
            />
            <label
              htmlFor="con_peso"
              className="
                absolute left-2 bg-gray-50 px-1 text-gray-500 transition-all
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:w-full
                peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:w-auto
                peer-focus:bg-gray-50
                -top-3 text-sm w-auto
              "
            >
              Peso (kg)
            </label>
          </div>
        </div>

        {/* Temperatura Corporal */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="relative bg-inherit">
            <input
              type="number"
              id="con_temperaturaCorporal"
              name="con_temperaturaCorporal"
              value={formData.con_temperaturaCorporal || ""}
              onChange={(e) => handleNumberChange("con_temperaturaCorporal", e.target.value)}
              placeholder="Ejemplo: 38.5"
              className="peer bg-transparent h-10 w-72 rounded-lg text-black-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
            />
            <label
              htmlFor="con_temperaturaCorporal"
              className="
                absolute left-2 bg-gray-50 px-1 text-gray-500 transition-all
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:w-full
                peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:w-auto
                peer-focus:bg-gray-50
                -top-3 text-sm w-auto
              "
            >
              Temperatura Corporal (°C)
            </label>
          </div>
        </div>

        {/* ICC */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="relative bg-inherit">
            <input
              type="text"
              id="con_icc"
              name="con_icc"
              value={formData.con_icc}
              onChange={(e) => setFormData({ ...formData, con_icc: e.target.value })}
              placeholder="Ejemplo: Normal"
              className="peer bg-transparent h-10 w-72 rounded-lg text-black-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
            />
            <label
              htmlFor="con_icc"
              className="
                absolute left-2 bg-gray-50 px-1 text-gray-500 transition-all
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:w-full
                peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:w-auto
                peer-focus:bg-gray-50
                -top-3 text-sm w-auto
              "
            >
              ICC
            </label>
          </div>
        </div>

        {/* Pulso */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="relative bg-inherit">
            <input
              type="number"
              id="con_pulso"
              name="con_pulso"
              value={formData.con_pulso || ""}
              onChange={(e) => handleNumberChange("con_pulso", e.target.value)}
              placeholder="Ejemplo: 90"
              className="peer bg-transparent h-10 w-72 rounded-lg text-black-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
            />
            <label
              htmlFor="con_pulso"
              className="
                absolute left-2 bg-gray-50 px-1 text-gray-500 transition-all
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:w-full
                peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:w-auto
                peer-focus:bg-gray-50
                -top-3 text-sm w-auto
              "
            >
              Pulso
            </label>
          </div>
        </div>

        {/* Frecuencia Respiratoria */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="relative bg-inherit">
            <input
              type="number"
              id="con_frecuenciaRespiratoria"
              name="con_frecuenciaRespiratoria"
              value={formData.con_frecuenciaRespiratoria || ""}
              onChange={(e) => handleNumberChange("con_frecuenciaRespiratoria", e.target.value)}
              placeholder="Ejemplo: 20"
              className="peer bg-transparent h-10 w-72 rounded-lg text-black-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
            />
            <label
              htmlFor="con_frecuenciaRespiratoria"
              className="
                absolute left-2 bg-gray-50 px-1 text-gray-500 transition-all
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:w-full
                peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:w-auto
                peer-focus:bg-gray-50
                -top-3 text-sm w-auto
              "
            >
              Frecuencia Respiratoria
            </label>
          </div>
        </div>

        {/* Frecuencia Cardiaca */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="relative bg-inherit">
            <input
              type="number"
              id="con_frecuenciaCardiaca"
              name="con_frecuenciaCardiaca"
              value={formData.con_frecuenciaCardiaca || ""}
              onChange={(e) => handleNumberChange("con_frecuenciaCardiaca", e.target.value)}
              placeholder="Ejemplo: 70"
              className="peer bg-transparent h-10 w-72 rounded-lg text-black-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
            />
            <label
              htmlFor="con_frecuenciaCardiaca"
              className="
                absolute left-2 bg-gray-50 px-1 text-gray-500 transition-all
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:w-full
                peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:w-auto
                peer-focus:bg-gray-50
                -top-3 text-sm w-auto
              "
            >
              Frecuencia Cardiaca
            </label>
          </div>
        </div>

        {/* Hidratación */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="relative bg-inherit">
            <input
              type="text"
              id="con_hidratacion"
              name="con_hidratacion"
              value={formData.con_hidratacion}
              onChange={(e) => setFormData({ ...formData, con_hidratacion: e.target.value })}
              placeholder="Ejemplo: Normal"
              className="peer bg-transparent h-10 w-72 rounded-lg text-black-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
            />
            <label
              htmlFor="con_hidratacion"
              className="
                absolute left-2 bg-gray-50 px-1 text-gray-500 transition-all
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:w-full
                peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:w-auto
                peer-focus:bg-gray-50
                -top-3 text-sm w-auto
              "
            >
              Hidratación
            </label>
          </div>
        </div>

        {/* Mucosas */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="relative bg-inherit">
            <input
              type="text"
              id="con_mucosas"
              name="con_mucosas"
              value={formData.con_mucosas}
              onChange={(e) => setFormData({ ...formData, con_mucosas: e.target.value })}
              placeholder="Ejemplo: Normales"
              className="peer bg-transparent h-10 w-72 rounded-lg text-black-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
            />
            <label
              htmlFor="con_mucosas"
              className="
                absolute left-2 bg-gray-50 px-1 text-gray-500 transition-all
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:w-full
                peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:w-auto
                peer-focus:bg-gray-50
                -top-3 text-sm w-auto
              "
            >
              Mucosas
            </label>
          </div>
        </div>

        {/* Campo Pulmonar */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="relative bg-inherit">
            <input
              type="text"
              id="con_campoPulmonar"
              name="con_campoPulmonar"
              value={formData.con_campoPulmonar}
              onChange={(e) => setFormData({ ...formData, con_campoPulmonar: e.target.value })}
              placeholder="Ejemplo: Claro"
              className="peer bg-transparent h-10 w-72 rounded-lg text-black-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
            />
            <label
              htmlFor="con_campoPulmonar"
              className="
                absolute left-2 bg-gray-50 px-1 text-gray-500 transition-all
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:w-full
                peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:w-auto
                peer-focus:bg-gray-50
                -top-3 text-sm w-auto
              "
            >
              Campo Pulmonar
            </label>
          </div>
        </div>

        {/* Palpación Abdominal */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="relative bg-inherit">
            <input
              type="text"
              id="con_palpacionAbdominal"
              name="con_palpacionAbdominal"
              value={formData.con_palpacionAbdominal}
              onChange={(e) => setFormData({ ...formData, con_palpacionAbdominal: e.target.value })}
              placeholder="Ejemplo: Sin alteraciones"
              className="peer bg-transparent h-10 w-72 rounded-lg text-black-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
            />
            <label
              htmlFor="con_palpacionAbdominal"
              className="
                absolute left-2 bg-gray-50 px-1 text-gray-500 transition-all
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:w-full
                peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:w-auto
                peer-focus:bg-gray-50
                -top-3 text-sm w-auto
              "
            >
              Palpación Abdominal
            </label>
          </div>
        </div>

        {/* Diagnóstico Presuntivo */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="relative bg-inherit">
            <input
              type="text"
              id="con_diagnosticoPresuntivo"
              name="con_diagnosticoPresuntivo"
              value={formData.con_diagnosticoPresuntivo}
              onChange={(e) => setFormData({ ...formData, con_diagnosticoPresuntivo: e.target.value })}
              placeholder="Ejemplo: Bronquitis"
              className="peer bg-transparent h-10 w-72 rounded-lg text-black-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
            />
            <label
              htmlFor="con_diagnosticoPresuntivo"
              className="
                absolute left-2 bg-gray-50 px-1 text-gray-500 transition-all
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:w-full
                peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:w-auto
                peer-focus:bg-gray-50
                -top-3 text-sm w-auto
              "
            >
              Diagnóstico Presuntivo
            </label>
          </div>
        </div>

        {/* Observaciones */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="relative bg-inherit">
            <input
              type="text"
              id="con_observaciones"
              name="con_observaciones"
              value={formData.con_observaciones}
              onChange={(e) => setFormData({ ...formData, con_observaciones: e.target.value })}
              placeholder="Ejemplo: Sin novedades"
              className="peer bg-transparent h-10 w-72 rounded-lg text-black-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
            />
            <label
              htmlFor="con_observaciones"
              className="
                absolute left-2 bg-gray-50 px-1 text-gray-500 transition-all
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:w-full
                peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:w-auto
                peer-focus:bg-gray-50
                -top-3 text-sm w-auto
              "
            >
              Observaciones
            </label>
          </div>
        </div>

        {/* Recomendaciones */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="relative bg-inherit">
            <input
              type="text"
              id="con_recomendaciones"
              name="con_recomendaciones"
              value={formData.con_recomendaciones}
              onChange={(e) => setFormData({ ...formData, con_recomendaciones: e.target.value })}
              placeholder="Ejemplo: Reposo absoluto"
              className="peer bg-transparent h-10 w-72 rounded-lg text-black-200 ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
            />
            <label
              htmlFor="con_recomendaciones"
              className="
                absolute left-2 bg-gray-50 px-1 text-gray-500 transition-all
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:w-full
                peer-focus:-top-3 peer-focus:text-sm peer-focus:text-sky-600 peer-focus:w-auto
                peer-focus:bg-gray-50
                -top-3 text-sm w-
              "
            >
              Recomendaciones
            </label>
          </div>
        </div>

        {/* Selector de Patologías - ocupa todo el ancho */}
        <div className="col-span-2 md:col-span-3 bg-gray-50 p-4 rounded-lg">
          <label className="block mb-2 font-semibold text-gray-700">Patologías relacionadas</label>
          <div className="max-h-48 overflow-y-auto  rounded p-3 bg-white">
            {patologias.length === 0 ? (
              <p className="italic text-gray-500">No hay patologías disponibles para esta especie y raza.</p>
            ) : (
              patologias.map((pat) => (
                <label key={pat.pat_id} className="flex items-center space-x-3 mb-1 cursor-pointer">
                  <input
                    type="checkbox"
                    value={pat.pat_id}
                    checked={selectedPatologias.includes(pat.pat_id)}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (e.target.checked) {
                        setSelectedPatologias((prev) => [...prev, value]);
                      } else {
                        setSelectedPatologias((prev) => prev.filter((id) => id !== value));
                      }
                    }}
                    className="h-5 w-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-gray-800">{pat.pat_nombre}</span>
                </label>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          type="submit"
          className="bg-sky-600 hover:bg-sky-700 text-white py-3 px-10 rounded-lg font-semibold"
        >
          Guardar Consulta
        </button>
      </div>
    </form>
  );
};

export default EditConsultaForm;
