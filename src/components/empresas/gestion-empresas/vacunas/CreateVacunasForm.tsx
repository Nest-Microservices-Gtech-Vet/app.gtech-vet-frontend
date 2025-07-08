import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { registrarVacuna, obtenerConsultaActiva } from "../../../../services/gestion-empresa/vacunas/vacunas";

const tiposVacuna = [
  "Vacunación",
  "Desparasitación interna",
  "Desparasitación externa",
];

const CreateVacunasForm = () => {
  const { mascotaId, id: empresaId } = useParams();

  const [consultaId, setConsultaId] = useState<number | null>(null);
  const [numeroConsulta, setNumeroConsulta] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    vac_fecha: "",
    vac_proxima: "",
    vac_tipo: "",
    vac_nombre: "",
    vac_lote: "",
    vac_observacion: "",
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchConsulta = async () => {
      try {
        const result = await obtenerConsultaActiva(empresaId!, mascotaId!);
        setConsultaId(result.con_id);
        setNumeroConsulta(result.con_numero_mascota);
      } catch (err) {
        Swal.fire("Error", "No se pudo cargar la consulta activa", "error");
        console.error(err);
      }
    };

    if (empresaId && mascotaId) {
      fetchConsulta();
    }
  }, [empresaId, mascotaId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!empresaId || !mascotaId || !numeroConsulta) {
      Swal.fire("Error", "Faltan datos obligatorios", "error");
      return;
    }

    const payload: any = {
      vac_nombre: formData.vac_nombre,
      vac_tipo: formData.vac_tipo,
      vac_fecha: formData.vac_fecha,
      vac_lote: formData.vac_lote,
      vac_observacion: formData.vac_observacion,
      empresa_id: empresaId,
      mascota_id: mascotaId,
      numeroConsulta: numeroConsulta,
    };

    // Si hay valor en vac_proxima, lo agregamos como string ISO. Si está vacío, no lo enviamos.
    if (formData.vac_proxima && formData.vac_proxima.trim() !== "") {
      payload.vac_proxima = new Date(formData.vac_proxima).toISOString();
    }

    try {
      await registrarVacuna(payload, selectedFiles);
      Swal.fire("Éxito", "Vacuna registrada correctamente", "success");

      // Limpiar formulario
      setFormData({
        vac_fecha: "",
        vac_proxima: "",
        vac_tipo: "",
        vac_nombre: "",
        vac_lote: "",
        vac_observacion: "",
      });
      setSelectedFiles([]);
    } catch (error) {
      Swal.fire("Error", "No se pudo registrar la vacuna", "error");
      console.error(error);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-sky-700">💉 Registrar Vacuna o Desparasitación</h2>

      {/* Fecha de aplicación */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">📅 Fecha de aplicación</label>
        <input
          type="date"
          value={formData.vac_fecha}
          onChange={(e) => setFormData({ ...formData, vac_fecha: e.target.value })}
          className="w-full border rounded p-2"
          required
        />
      </div>

      {/* Tipo de procedimiento */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">🧪 Tipo de procedimiento</label>
        <select
          value={formData.vac_tipo}
          onChange={(e) => setFormData({ ...formData, vac_tipo: e.target.value })}
          className="w-full border rounded p-2"
          required
        >
          <option value="">-- Selecciona tipo --</option>
          {tiposVacuna.map((tipo) => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
      </div>

      {/* Nombre del producto */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">💊 Nombre del producto aplicado</label>
        <input
          type="text"
          value={formData.vac_nombre}
          onChange={(e) => setFormData({ ...formData, vac_nombre: e.target.value })}
          className="w-full border rounded p-2"
          placeholder="Ej: Vanguard Plus 5, Drontal..."
          required
        />
      </div>

      {/* Número de lote */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">🔢 Número de lote</label>
        <input
          type="text"
          value={formData.vac_lote}
          onChange={(e) => setFormData({ ...formData, vac_lote: e.target.value })}
          className="w-full border rounded p-2"
          placeholder="Ej: Lote XYZ123"
          required
        />
      </div>

      {/* Fecha de próxima dosis */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">📆 Fecha de próxima dosis (opcional)</label>
        <input
          type="date"
          value={formData.vac_proxima}
          onChange={(e) => setFormData({ ...formData, vac_proxima: e.target.value })}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Observaciones */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">📝 Observaciones (opcional)</label>
        <textarea
          value={formData.vac_observacion}
          onChange={(e) => setFormData({ ...formData, vac_observacion: e.target.value })}
          className="w-full border rounded p-2"
          rows={3}
        />
      </div>

      {/* Subir archivos */}
      <div className="mb-6">
        <label className="block font-semibold mb-1">📎 Adjuntar archivos (opcional)</label>
        <input
          type="file"
          multiple
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Botón */}
      <div className="text-center">
        <button
          type="submit"
          className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded font-semibold"
        >
          Registrar Vacuna
        </button>
      </div>
    </form>
  );
};

export default CreateVacunasForm;
