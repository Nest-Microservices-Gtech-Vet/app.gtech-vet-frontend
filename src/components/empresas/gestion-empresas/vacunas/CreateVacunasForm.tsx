import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import {
  registrarVacuna,
  obtenerConsultaActiva,
  getVacunaPorMascota,
  updateVacuna,
} from "../../../../services/gestion-empresa/vacunas/vacunas";
import { useReactToPrint } from "react-to-print";
import CartillaVacunasPrint from "./imprimirVacuna/VacunaPrint";

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
  const [vacunaEditando, setVacunaEditando] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    vac_fecha: "",
    vac_proxima: "",
    vac_tipo: "",
    vac_nombre: "",
    vac_lote: "",
    vac_observacion: "",
  });

  const navigate = useNavigate();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [modalArchivo, setModalArchivo] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Cartilla_Vacunas",
  });

  const API_URL = "http://localhost:3010";

  // nuevos archivos seleccionados
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // IDs de archivos que se deben eliminar al actualizar
  const [archivosAEliminar, setArchivosAEliminar] = useState<number[]>([]);
  const [mascota, setMascota] = useState<any | null>(null);
  const [propietario, setPropietario] = useState<any | null>(null);
  const [empresa, setEmpresa] = useState<any | null>(null);


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

  const cargarVacunas = async () => {
    try {
      const data = await getVacunaPorMascota(mascotaId!);

      // validar que vacunas exista y sea un array
      const vacunasArray = Array.isArray(data.vacunas) ? data.vacunas : [];

      const vacunasConArchivos = vacunasArray.map((v: any) => ({
        ...v,
        archivos: v.VacunaFoto
          ? v.VacunaFoto.map((f: any) => ({
            url: `${API_URL}${f.url}`,
            tipo: f.url.endsWith(".pdf") ? "pdf" : "imagen",
            id: f.vf_id,
          }))
          : [],
      }));

      setVacunas(vacunasConArchivos);

      // si quieres guardar info de la mascota, propietario y empresa
      // en estados separados:
      setMascota(data.mascota);
      setPropietario(data.propietario);
      setEmpresa(data.empresa);

    } catch (error) {
      console.error("Error al obtener vacunas:", error);
    }
  };


  // Obtener vacunas de la mascota
  useEffect(() => {

    cargarVacunas();

  }, [mascotaId]);

  // Manejo de archivos nuevos
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

  const quitarArchivoNuevo = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Quitar archivo guardado (lo pasamos a lista de eliminados)
  const quitarArchivoGuardado = (archivoId: number) => {
    if (!vacunaEditando) return;

    setVacunaEditando((prev: any) => ({
      ...prev,
      archivos: prev.archivos.filter((a: any) => a.id !== archivoId),
    }));

    setArchivosAEliminar((prev) => [...prev, archivoId]);
  };

  // Pasar vacuna al formulario para edición
  const handleEdit = (vacuna: any) => {
    setVacunaEditando({
      ...vacuna,
      id: vacuna.vac_id,
    });
    setFormData({
      vac_fecha: vacuna.vac_fecha ? vacuna.vac_fecha.split("T")[0] : "",
      vac_proxima: vacuna.vac_proxima
        ? vacuna.vac_proxima.split("T")[0]
        : "",
      vac_tipo: vacuna.vac_tipo || "",
      vac_nombre: vacuna.vac_nombre || "",
      vac_lote: vacuna.vac_lote || "",
      vac_observacion: vacuna.vac_observacion || "",
    });
    setSelectedFiles([]);
    setArchivosAEliminar([]);
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
    setArchivosAEliminar([]);
  };

  // Guardar (crear o editar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!empresaId || !mascotaId || !historiaClinicaId) {
      Swal.fire("Error", "Faltan datos obligatorios", "error");
      return;
    }

    const payload: any = {
      vac_nombre: formData.vac_nombre || undefined,
      vac_tipo: formData.vac_tipo || undefined,
      vac_fecha: formData.vac_fecha || undefined,
      vac_lote: formData.vac_lote || undefined,
      vac_observacion: formData.vac_observacion || undefined,
      empresa_id: String(empresaId),
      mascota_id: String(mascotaId),
      historiaClinica_id: String(historiaClinicaId),
      vac_proxima: formData.vac_proxima || undefined,

    };
    if (vacunaEditando) {
      payload.archivosAEliminar = archivosAEliminar;
    }

    try {
      if (vacunaEditando) {
        const vacunaId = Number(vacunaEditando.id);
        const actualizada = await updateVacuna(
          vacunaId,
          payload,
          selectedFiles
        );

        setVacunas((prev) =>
          prev.map((v) => (v.vac_id === actualizada.vac_id ? actualizada : v))
        );
      } else {
        const nuevaVacuna = await registrarVacuna(payload, selectedFiles);
        setVacunas((prev) => [...prev, nuevaVacuna]);
      }
      await cargarVacunas();

      // Resetear
      setFormData({
        vac_fecha: "",
        vac_proxima: "",
        vac_tipo: "",
        vac_nombre: "",
        vac_lote: "",
        vac_observacion: "",
      });
      setVacunaEditando(null);
      setSelectedFiles([]);
      setArchivosAEliminar([]);

      if (fileInputRef.current) fileInputRef.current.value = "";

      Swal.fire(
        "Éxito",
        vacunaEditando
          ? "Vacuna actualizada correctamente"
          : "Vacuna registrada correctamente",
        "success"
      );
    } catch (error) {
      Swal.fire("Error", "No se pudo procesar la vacuna", "error");
      console.error(error);
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-6 grid grid-cols-1 md:grid-cols-[2fr_2fr] gap-6 items-start">
      {/* Listado de vacunas */}
      <div>
        <h3 className="text-xl font-semibold text-sky-800 mb-4">
          📋Vacunas registradas
          <button
            onClick={() =>
              navigate(
                `/mis-empresas/${empresaId}/mascotas/${mascotaId}/historia-clinica`
              )
            }
            className="bg-purple-500 hover:bg-purple-600 text-white py-1.5 px-1 rounded-md transition ml-1"
          >
            🔙 Regresar a historia clinica
          </button>

          <button
            onClick={handlePrint}
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow m-4"
          >
            🖨️ Imprimir Cartilla
          </button>
          {mascota && propietario && empresa && (
            <div style={{ display: "none" }}>
              <div ref={printRef}>
                <CartillaVacunasPrint
                  empresa={{
                    nombre: empresa.emp_nombre,
                    direccion: empresa.emp_direccion,
                    telefono: empresa.emp_telefono,
                    email: empresa.emp_correo,
                    foto: empresa.emp_foto,
                  }}
                  mascota={{
                    nombre: mascota.mas_nombre,
                    fechaNacimiento: mascota.mas_fechaNac,
                    color: mascota.mas_color,
                  }}
                  propietario={{
                    nombre: `${propietario.cli_nombre} ${propietario.cli_apellido}`,
                    cedula: propietario.cli_identificacion,
                    telefono: propietario.cli_celular,
                    direccion: propietario.cli_direccion,
                  }}
                  medico={{
                    nombre: `${vacunas[0].medico?.usua_nombre ?? ""} ${vacunas[0].medico?.usua_apellido ?? ""}`, // porque tu API no manda el usuario aún
                    cedula: vacunas[0].medico?.usua_ruc,             // idem
                  }}
                  vacunas={vacunas}
                />
              </div>
            </div>
          )}


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
          className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-4"
        >
          <h2 className="text-2xl font-semibold text-sky-700">
            {vacunaEditando
              ? "✏️ Editar Vacuna"
              : "💉 Registrar Vacuna o Desparasitación"}
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

            {/* Archivos guardados con botón eliminar */}
            {vacunaEditando && vacunaEditando.archivos?.length > 0 && (
              <div className="mt-3">
                <p className="font-semibold mb-1">📂 Archivos guardados:</p>
                <div className="flex flex-wrap gap-2">
                  {vacunaEditando.archivos.map((archivo: any, i: number) => (
                    <div
                      key={i}
                      className="relative w-20 h-20 border rounded overflow-hidden"
                    >
                      {archivo.tipo === "imagen" ? (
                        <img
                          src={archivo.url}
                          alt="Archivo"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div
                          className="flex items-center justify-center w-full h-full bg-gray-200 text-xs"
                          onClick={() => window.open(archivo.url, "_blank")}
                        >
                          PDF
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => quitarArchivoGuardado(archivo.id)}
                        className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vista previa archivos nuevos */}
            {selectedFiles.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-3">
                {selectedFiles.map((file, i) => (
                  <div
                    key={i}
                    className="relative w-24 h-24 border rounded overflow-hidden shadow-sm flex flex-col items-center justify-center"
                  >
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
                    <button
                      type="button"
                      onClick={() => quitarArchivoNuevo(i)}
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

      {/* Modal */}
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
