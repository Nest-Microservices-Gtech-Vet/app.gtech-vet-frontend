import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import {
  registrarVacuna,
  // 🔹 asegúrate de tener este servicio
  obtenerConsultaActiva,
  getVacunaPorMascota,
  updateVacuna,
  UpdateVacunaDto,
} from "../../../../services/gestion-empresa/vacunas/vacunas";

const tiposVacuna = [
  "Vacunación",
  "Desparasitación interna",
  "Desparasitación externa",
];

const CreateVacunasForm = () => {
  const { mascotaId, id: empresaId } = useParams();
  const [historiaClinicaId, setHistoriaClinicaId] = useState<string | null>(
    null
  );
  const [vacunas, setVacunas] = useState<any[]>([]);
  const [vacunaEditando, setVacunaEditando] = useState<any | null>(null); // 🔹 vacuna seleccionada para editar
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

  // Obtener consulta activa
  useEffect(() => {
    const fetchConsulta = async () => {
      try {
        const result = await obtenerConsultaActiva(empresaId!, mascotaId!);
        setHistoriaClinicaId(result.historiaClinica_id);
      } catch (err) {
        console.error("Error al cargar consulta activa:", err);
      }
    };

    if (empresaId && mascotaId) {
      fetchConsulta();
    }
  }, [empresaId, mascotaId]);

  // Obtener vacunas de la mascota
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

  // Manejo de archivos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const nuevos = Array.from(e.target.files);
    const nombresExistentes = new Set(selectedFiles.map((f) => f.name));
    const noDuplicados = nuevos.filter((f) => !nombresExistentes.has(f.name));

    if (noDuplicados.length === 0) {
      Swal.fire("Archivo duplicado", "Ya seleccionaste estos archivos", "info");
      return;
    }

    setSelectedFiles((prev) => [...prev, ...noDuplicados]);
  };

  const quitarArchivo = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Pasar vacuna al formulario para edición
  const handleEdit = (vacuna: any) => {
    setVacunaEditando({
    ...vacuna,
    id: vacuna.vac_id, // ✅ asegúrate de tener id numérico
  });
    setFormData({
      vac_fecha: vacuna.vac_fecha
        ? vacuna.vac_fecha.split("T")[0]
        : "",
      vac_proxima: vacuna.vac_proxima
        ? vacuna.vac_proxima.split("T")[0]
        : "",
      vac_tipo: vacuna.vac_tipo || "",
      vac_nombre: vacuna.vac_nombre || "",
      vac_lote: vacuna.vac_lote || "",
      vac_observacion: vacuna.vac_observacion || "",
    });
    setSelectedFiles([]);
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setVacunaEditando(null);
    setFormData({
      vac_fecha: "",
      vac_proxima: "",
      vac_tipo: "",
      vac_nombre: "",
      vac_lote: "",
      vac_observacion: "",
    });
    setSelectedFiles([]);
  };

  // Guardar (crear o editar)
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!empresaId || !mascotaId || !historiaClinicaId) {
    Swal.fire("Error", "Faltan datos obligatorios", "error");
    return;
  }

  // Construir payload
  const payload: any = {
  vac_nombre: formData.vac_nombre || undefined,
  vac_tipo: formData.vac_tipo || undefined,
  vac_fecha: formData.vac_fecha || undefined,
  vac_lote: formData.vac_lote || undefined,
  vac_observacion: formData.vac_observacion || undefined,
  empresa_id: empresaId ? String(empresaId) : undefined,
  mascota_id: mascotaId ? String(mascotaId) : undefined,
  historiaClinica_id: historiaClinicaId ? String(historiaClinicaId) : undefined,
};

if (formData.vac_proxima) {
  payload.vac_proxima = formData.vac_proxima;
}


  try {
    if (vacunaEditando) {
      // ✅ Asegurarse de pasar un número como ID
      const vacunaId = Number(vacunaEditando.id);
      const actualizada = await updateVacuna(vacunaId, payload, selectedFiles);

      setVacunas((prev) =>
        prev.map((v) => (v.id === actualizada.id ? actualizada : v))
      );

      Swal.fire("Éxito", "Vacuna actualizada correctamente", "success");
    } else {
      const nuevaVacuna = await registrarVacuna(payload, selectedFiles);
      setVacunas((prev) => [...prev, nuevaVacuna]);
      Swal.fire("Éxito", "Vacuna registrada correctamente", "success");
    }

    cancelarEdicion();
  } catch (error) {
    Swal.fire("Error", "No se pudo procesar la vacuna", "error");
    console.error(error);
  }
};


  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6 items-start">
      {/* Listado de vacunas */}
      <div>
        <h3 className="text-xl font-semibold text-sky-800 mb-4">
          📋 Vacunas registradas
        </h3>
        {vacunas.length === 0 ? (
          <p className="text-gray-500">No hay vacunas registradas aún.</p>
        ) : (
          <ul className="space-y-3">
            {vacunas.map((vacuna, index) => (
              <li
                key={index}
                className="bg-gray-100 p-3 rounded shadow-sm flex justify-between items-start"
              >
                <div>
                  <p>
                    <strong>💉 Nombre producto:</strong> {vacuna.vac_nombre}
                  </p>
                  <p>
                    <strong>📅 Fecha:</strong>{" "}
                    {new Date(vacuna.vac_fecha).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>🔢 Lote:</strong> {vacuna.vac_lote}
                  </p>
                  <p>
                    <strong>🧪 Tipo:</strong> {vacuna.vac_tipo}
                  </p>
                  {vacuna.vac_proxima && (
                    <p>
                      <strong>📆 Próxima dosis:</strong>{" "}
                      {new Date(vacuna.vac_proxima).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleEdit(vacuna)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Editar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Formulario */}
      <div>
        <form
          onSubmit={handleSubmit}
          className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-4"
        >
          <h2 className="text-2xl font-semibold text-sky-700">
            {vacunaEditando ? "✏️ Editar Vacuna" : "💉 Registrar Vacuna o Desparasitación"}
          </h2>

          {/* Campos */}
          <div>
            <label className="block font-semibold mb-1">
              📅 Fecha de aplicación
            </label>
            <input
              type="date"
              value={formData.vac_fecha}
              onChange={(e) =>
                setFormData({ ...formData, vac_fecha: e.target.value })
              }
              className="w-full shadow-sm rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">
              🧪 Tipo de procedimiento
            </label>
            <select
              value={formData.vac_tipo}
              onChange={(e) =>
                setFormData({ ...formData, vac_tipo: e.target.value })
              }
              className="w-full shadow-sm rounded p-2"
              required
            >
              <option value="">-- Selecciona tipo --</option>
              {tiposVacuna.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">
              💊 Nombre del producto aplicado
            </label>
            <input
              type="text"
              value={formData.vac_nombre}
              onChange={(e) =>
                setFormData({ ...formData, vac_nombre: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, vac_lote: e.target.value })
              }
              className="w-full shadow-sm rounded p-2"
              placeholder="Ej: Lote XYZ123"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">
              📆 Fecha de próxima dosis (opcional)
            </label>
            <input
              type="date"
              value={formData.vac_proxima}
              onChange={(e) =>
                setFormData({ ...formData, vac_proxima: e.target.value })
              }
              className="w-full shadow-sm rounded p-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">
              📝 Observaciones (opcional)
            </label>
            <textarea
              value={formData.vac_observacion}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  vac_observacion: e.target.value,
                })
              }
              className="w-full shadow-sm rounded p-2"
              placeholder="Ej: Pendiente a las siguientes vacunas"
              rows={3}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">
              📎 Adjuntar archivos (opcional)
            </label>
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
                  <li
                    key={i}
                    className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded"
                  >
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

          {/* Botones */}
          <div className="text-center pt-4 flex gap-4 justify-center">
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded font-semibold"
            >
              {vacunaEditando ? "Actualizar Vacuna" : "Registrar Vacuna"}
            </button>

            {vacunaEditando && (
              <button
                type="button"
                onClick={cancelarEdicion}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded font-semibold"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVacunasForm;
