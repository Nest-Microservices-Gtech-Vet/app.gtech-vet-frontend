import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getHistoriaClinicaByMascotaId } from "../../../../services/gestion-empresa/historia-clinica/historiaClinica";
import { crearConsulta } from "../../../../services/gestion-empresa/consultas/consulta";

import { Consulta } from "../../../../types/consulta/consulta";

const CreateConsultaForm = () => {
  const { empresaId, mascotaId, id } = useParams();
  const navigate = useNavigate();

  const [historiaClinicaId, setHistoriaClinicaId] = useState<number | null>(null);



  const [formData, setFormData] = useState<Consulta>({
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
    const fetchData = async () => {
      try {
        const historia = await getHistoriaClinicaByMascotaId(mascotaId!);
        if (!historia) {
          Swal.fire("Error", "La mascota no tiene historia clínica", "error");
          return navigate(-1);
        }
        setHistoriaClinicaId(historia.hic_id);
        setFormData((prev) => ({
          ...prev,
          historiaClinica_id: historia.hic_id,
          mascota_id: Number(mascotaId), // 👈 REAFIRMAMOS
        }));

        
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo cargar la información necesaria", "error");
      }
    };

    fetchData();
  }, [mascotaId]);

  const handleNumberChange = (key: keyof Consulta, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value === "" ? 0 : parseFloat(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
       
      };

      await crearConsulta(payload);
      Swal.fire("Consulta registrada", "Se agregó la consulta correctamente", "success").then(() => {
        navigate(`/mis-empresas/${id}/mascotas/${mascotaId}/historia-clinica`);
      });
    } catch (error) {
      Swal.fire("Error", "No se pudo registrar la consulta", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl bg-gray-50 p-5 rounded-lg shadow-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">➕ Nueva Consulta Médica</h2>
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

export default CreateConsultaForm;
