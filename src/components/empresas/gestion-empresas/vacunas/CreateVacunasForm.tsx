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
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [modalArchivo, setModalArchivo] = useState<string | null>(null);



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
        const vacunaId = Number(vacunaEditando.id);
        const actualizada = await updateVacuna(vacunaId, payload, selectedFiles);

        setVacunas((prev) =>
          prev.map((v) => (v.vac_id === actualizada.vac_id ? actualizada : v))
        );
      } else {
        const nuevaVacuna = await registrarVacuna(payload, selectedFiles);
        setVacunas((prev) => [...prev, nuevaVacuna]);
      }

      // Limpiar siempre al final
      setFormData({
        vac_fecha: "",
        vac_proxima: "",
        vac_tipo: "",
        vac_nombre: "",
        vac_lote: "",
        vac_observacion: "",
      });
      setVacunaEditando(null);
      setSelectedFiles([]);   // ✅ limpiar imágenes siempre

      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // limpia el input de archivos
      }

      Swal.fire(
        "Éxito",
        vacunaEditando ? "Vacuna actualizada correctamente" : "Vacuna registrada correctamente",
        "success"
      );
    } catch (error) {
      Swal.fire("Error", "No se pudo procesar la vacuna", "error");
      console.error(error);
    }
  }


  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6 items-start">
      {/* Listado de vacunas */}
      <div >
        <h3 className="text-xl font-semibold text-sky-800 mb-4">
          📋Vacunas registradas

          <button
            onClick={() => navigate(`/mis-empresas/${empresaId}/mascotas/${mascotaId}/historia-clinica`)}
            className="bg-purple-500 hover:bg-purple-600 text-white py-1.5 px-1 rounded-md transition ml-1"
          >
            🔙 Regresar a historia clinica
          </button>
        </h3>

        {vacunas.length === 0 ? (
          <p className="text-gray-500">No hay vacunas registradas aún.</p>
        ) : (
         <ul className="space-y-3">
  {vacunas.map((vacuna, index) => (
    <li
      key={index}
      className="bg-gray-100 p-3 rounded shadow-sm flex flex-col gap-2"
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

      {/* Botón de Editar */}
      <div className="flex gap-2 items-center">
        <button
          onClick={() => handleEdit(vacuna)}
          className="text-blue-600 hover:underline text-sm"
        >
          Editar
        </button>
      </div>

      {/* Miniaturas de archivos */}
      {vacuna.archivos && vacuna.archivos.length > 0 && (
  <div className="flex gap-2 flex-wrap mt-2">
    {vacuna.archivos.map((archivo: any, i: number) => (
      <div
        key={i}
        className="relative w-16 h-16 border rounded overflow-hidden cursor-pointer"
      >
        {archivo.tipo === "imagen" ? (
          <img
            src={archivo.url}
            alt="Archivo adjunto"
            className="object-cover w-full h-full"
            onClick={() => setModalArchivo(archivo.url)}
          />
        ) : (
          <div
            className="flex items-center justify-center bg-gray-300 w-full h-full text-xs text-center"
            onClick={() => window.open(archivo.url, "_blank")}
          >
            PDF
          </div>
        )}
      </div>
    ))}
  </div>
)}

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
            <label className="block font-semibold mb-1">📎 Adjuntar archivos (opcional)</label>

            {/* Botón estilizado para escoger archivos */}
            <label className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-md cursor-pointer text-sm font-medium">
              📁 Escoger archivos
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Vista previa / lista de archivos */}
            {selectedFiles.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-3">
                {selectedFiles.map((file, i) => (
                  <div key={i} className="relative w-24 h-24 border rounded overflow-hidden shadow-sm flex flex-col items-center justify-center">
                    {/* Si es imagen, mostrar miniatura */}
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-700 text-xs px-1 text-center">
                        {file.name}
                      </div>
                    )}

                    {/* Botón de quitar */}
                    <button
                      type="button"
                      onClick={() => quitarArchivo(i)}
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
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
      {modalArchivo && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    onClick={() => setModalArchivo(null)}
  >
    <img
      src={modalArchivo}
      alt="Archivo ampliado"
      className="max-h-[80%] max-w-[80%] rounded shadow-lg"
    />
  </div>
)}

    </div>
  );
};

export default CreateVacunasForm;
