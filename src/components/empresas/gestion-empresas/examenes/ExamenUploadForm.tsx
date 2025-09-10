import { useState } from "react";
import Swal from "sweetalert2";
import { subirExamen } from "../../../../services/gestion-empresa/examenes/examen";

interface Props {
  empresaId: number;
  consultaId: number;
  onUploadSuccess?: () => void;
}

type Categoria = "patologia" | "rayosx";
type TipoArchivo = "solicitud" | "resultado";

const CATEGORIAS: Categoria[] = ["patologia", "rayosx"];
const TIPOS: TipoArchivo[] = ["solicitud", "resultado"];

const ExamenUploadForm = ({ empresaId, consultaId, onUploadSuccess }: Props) => {
  const [descripcion, setDescripcion] = useState("");
  const [categoriasActivas, setCategoriasActivas] = useState<Record<Categoria, boolean>>({
    patologia: false,
    rayosx: false,
  });

  const [archivos, setArchivos] = useState<Record<Categoria, Record<TipoArchivo, File[]>>>({
    patologia: { solicitud: [], resultado: [] },
    rayosx: { solicitud: [], resultado: [] },
  });

  const handleCheckboxChange = (cat: Categoria) => {
    setCategoriasActivas((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleFileChange = (cat: Categoria, tipo: TipoArchivo, files: FileList | null) => {
    if (!files) return;
    setArchivos((prev) => ({
      ...prev,
      [cat]: {
        ...prev[cat],
        [tipo]: [...prev[cat][tipo], ...Array.from(files)],
      },
    }));
  };

  const quitarArchivo = (cat: Categoria, tipo: TipoArchivo, index: number) => {
    setArchivos((prev) => ({
      ...prev,
      [cat]: {
        ...prev[cat],
        [tipo]: prev[cat][tipo].filter((_, i) => i !== index),
      },
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validar que haya al menos un archivo seleccionado
  const hayArchivos = CATEGORIAS.some(
    (cat) =>
      categoriasActivas[cat] &&
      TIPOS.some((tipo) => archivos[cat][tipo].length > 0)
  );

  if (!hayArchivos) {
    Swal.fire({
      icon: "warning",
      title: "Ningún archivo seleccionado",
      text: "Por favor, selecciona al menos un archivo para subir.",
      confirmButtonColor: "#6366F1",
    });
    return;
  }

  try {
    for (const categoria of CATEGORIAS) {
      if (!categoriasActivas[categoria]) continue;

      for (const tipo of TIPOS) {
        const files = archivos[categoria][tipo];
        if (files.length === 0) continue;

        const formData = new FormData();
        formData.append("tipo", categoria);
        formData.append("categoria", tipo);
        formData.append("descripcion", descripcion || `${categoria} - ${tipo}`);
        formData.append("consulta_id", String(consultaId));
        formData.append("empresa_id", String(empresaId));
        files.forEach((file) => formData.append("files", file));

        await subirExamen(formData);
      }
    }

    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: "Exámenes subidos correctamente",
      confirmButtonColor: "#6366F1",
    });

    // Reset de formulario
    setDescripcion("");
    setArchivos({
      patologia: { solicitud: [], resultado: [] },
      rayosx: { solicitud: [], resultado: [] },
    });
    setCategoriasActivas({
      patologia: false,
      rayosx: false,
    });
    if (onUploadSuccess) onUploadSuccess();
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo subir uno o más exámenes",
      confirmButtonColor: "#6366F1",
    });
  }
};


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* <div>
        <label className="block font-semibold mb-1">Descripción global:</label>
        <input
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="border p-2 w-full"
          placeholder="Descripción general (opcional)"
        />
      </div> */}

      {CATEGORIAS.map((cat) => (
        <div key={cat} className=" p-4 rounded shadow-sm bg-white">
          <label className="flex items-center gap-2 font-semibold text-lg">
            <input
              type="checkbox"
              checked={categoriasActivas[cat]}
              onChange={() => handleCheckboxChange(cat)}
            />
            {cat === "patologia" ? "🧬 Patología" : "🩻 Rayos X"}
          </label>
{categoriasActivas[cat] && (
  <div className="mt-4 space-y-4">
    {TIPOS.map((tipo) => (
      <div key={tipo}>
        <label className="block font-semibold mb-1">
          {tipo === "solicitud" ? "Solicitud" : "Resultado"}
        </label>

        {/* Botón escoger archivos más compacto */}
        <label className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-md cursor-pointer text-sm font-medium">
          📁 Escoger archivos
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileChange(cat, tipo, e.target.files)}
            className="hidden"
          />
        </label>

        {/* Vista previa de imágenes con botón de quitar más demostrativo */}
        <div className="mt-2 flex flex-wrap gap-3">
          {archivos[cat][tipo]
            .filter((file) => file.type.startsWith("image/"))
            .map((file, i) => (
              <div key={i} className="relative w-20 h-20 border rounded overflow-hidden shadow-sm">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => quitarArchivo(cat, tipo, i)}
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow"
                >
                  ×
                </button>
              </div>
            ))}
        </div>
      </div>
    ))}
  </div>
)}

         
        </div>
      ))}

      <button
        type="submit"
        className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded shadow"
      >
        📤 Subir Exámenes
      </button>
    </form>
  );
};

export default ExamenUploadForm;
