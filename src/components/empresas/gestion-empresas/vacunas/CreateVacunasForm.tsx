import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { registrarVacuna, obtenerConsultaActiva, getVacunaPorMascota } from "../../../../services/gestion-empresa/vacunas/vacunas";

const tiposVacuna = [
  "Vacunación",
  "Desparasitación interna",
  "Desparasitación externa",
];

const CreateVacunasForm = () => {
  const { mascotaId, id: empresaId } = useParams();
  const [historiaClinicaId, setHistoriaClinicaId] = useState<string | null>(null);
  const [vacunas, setVacunas] = useState<any[]>([]);
  const navigate = useNavigate();


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

        //setNumeroConsulta(result.con_numero_mascota);
        setHistoriaClinicaId(result.historiaClinica_id);
      } catch (err) {
        // Swal.fire("Error", "No se pudo cargar la consulta activa", "error");
        // console.error(err);
      }
    };

    if (empresaId && mascotaId) {
      fetchConsulta();
    }
  }, [empresaId, mascotaId]);

  useEffect(() => {
    const cargarVacunas = async () => {
      try {
        const data = await getVacunaPorMascota(mascotaId!);
        setVacunas(data);
      } catch (error) {
        console.error("Error al obtener vacunas:", error);
      }
    };

    if (mascotaId) {
      cargarVacunas();
    }
  }, [mascotaId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const nuevos = Array.from(e.target.files);
    const nombresExistentes = new Set(selectedFiles.map(f => f.name));
    const noDuplicados = nuevos.filter(f => !nombresExistentes.has(f.name));

    if (noDuplicados.length === 0) {
      Swal.fire("Archivo duplicado", "Ya seleccionaste estos archivos", "info");
      return;
    }

    setSelectedFiles(prev => [...prev, ...noDuplicados]);
  };

  const quitarArchivo = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!empresaId || !mascotaId || !historiaClinicaId) {
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
      historiaClinica_id: historiaClinicaId.toString(),

    };

    if (formData.vac_proxima && formData.vac_proxima.trim() !== "") {
      payload.vac_proxima = new Date(formData.vac_proxima).toISOString();
    }

    try {
      await registrarVacuna(payload, selectedFiles);
      Swal.fire("Éxito", "Vacuna registrada correctamente", "success").then(() => {
        navigate(
          `/mis-empresas/${empresaId}/mascotas/${mascotaId}/registrar-vacuna`
        );
      });

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
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6 items-start">
      <div >
        <h3 className="text-xl font-semibold text-sky-800 mb-4">📋 Vacunas registradas</h3>
        {vacunas.length === 0 ? (
          <p className="text-gray-500">No hay vacunas registradas aún.</p>
        ) : (
          <ul className="space-y-3">
            {vacunas.map((vacuna, index) => (
              <li key={index} className="bg-gray-100 p-3 rounded shadow-sm">
                <p><strong>💉 Nombre producto:</strong> {vacuna.vac_nombre}</p>
                <p><strong>📅 Fecha:</strong> {new Date(vacuna.vac_fecha).toLocaleDateString()}</p>
                <p><strong>🔢 Lote:</strong> {vacuna.vac_lote}</p>
                <p><strong>🧪 Tipo:</strong> {vacuna.vac_tipo}</p>
                <p><strong>📆 Fecha proxima vacuna:</strong> {new Date(vacuna.vac_proxima).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
        <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded font-semibold"
            >
              imprimir Vacuna
            </button>
      </div>

      <div>
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-sky-700">💉 Registrar Vacuna o Desparasitación</h2>

          <div>
            <label className="block font-semibold mb-1">📅 Fecha de aplicación</label>
            <input
              type="date"
              value={formData.vac_fecha}
              onChange={(e) => setFormData({ ...formData, vac_fecha: e.target.value })}
              className="w-full shadow-sm rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">🧪 Tipo de procedimiento</label>
            <select
              value={formData.vac_tipo}
              onChange={(e) => setFormData({ ...formData, vac_tipo: e.target.value })}
              className="w-full shadow-sm rounded p-2"
              required
            >
              <option value="">-- Selecciona tipo --</option>
              {tiposVacuna.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">💊 Nombre del producto aplicado</label>
            <input
              type="text"
              value={formData.vac_nombre}
              onChange={(e) => setFormData({ ...formData, vac_nombre: e.target.value })}
              className="w-full shadow-sm rounded p-2"
              placeholder="Ej: Vanguard Plus 5, Drontal..."
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">🔢 Número de lote</label>
            <input
              type="text"
              value={formData.vac_lote}
              onChange={(e) => setFormData({ ...formData, vac_lote: e.target.value })}
              className="w-full shadow-sm rounded p-2"
              placeholder="Ej: Lote XYZ123"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">📆 Fecha de próxima dosis (opcional)</label>
            <input
              type="date"
              value={formData.vac_proxima}
              onChange={(e) => setFormData({ ...formData, vac_proxima: e.target.value })}
              className="w-full shadow-sm rounded p-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">📝 Observaciones (opcional)</label>
            <textarea
              value={formData.vac_observacion}
              onChange={(e) => setFormData({ ...formData, vac_observacion: e.target.value })}
              className="w-full shadow-sm rounded p-2"
              placeholder="Ej: Pendiente alas siguiente vacunas"
              rows={3}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">📎 Adjuntar archivos (opcional)</label>
            <input
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="w-full shadow-sm rounded p-2"
            />

            {selectedFiles.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm">
                {selectedFiles.map((file, i) => (
                  <li key={i} className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded">
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => quitarArchivo(i)}
                      className="text-red-600 hover:underline text-xs"
                    >
                      Quitar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded font-semibold"
            >
              Registrar Vacuna
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVacunasForm;
