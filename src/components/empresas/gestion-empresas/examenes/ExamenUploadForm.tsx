import { useState } from "react";
import { subirExamen } from "../../../../services/gestion-empresa/examenes/examen";
import Swal from "sweetalert2";

interface Props {
    empresaId: number;
    consultaId: number;
    onUploadSuccess?: () => void;
}

const ExamenUploadForm = ({ empresaId, consultaId, onUploadSuccess }: Props) => {
    const [tipo, setTipo] = useState("patologia");
    const [categoria, setCategoria] = useState("solicitud");
    const [descripcion, setDescripcion] = useState("");
    const [archivos, setArchivos] = useState<File[]>([]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!archivos || archivos.length === 0) {
            return Swal.fire("Error", "Debe seleccionar al menos un archivo", "error");
        }

        const formData = new FormData();
        formData.append("tipo", tipo);
        formData.append("categoria", categoria);
        formData.append("descripcion", descripcion);
        formData.append("consulta_id", String(consultaId));
        formData.append("empresa_id", String(empresaId));

        Array.from(archivos).forEach((file) => {
            formData.append("files", file);
        });

        try {
            const res = await subirExamen(formData);
            Swal.fire("Éxito", res.mensaje || "Examen subido", "success");
            setDescripcion("");
            setArchivos([]);
            if (onUploadSuccess) onUploadSuccess();
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo subir el examen", "error");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label>Tipo:</label>
                <input value={tipo} onChange={(e) => setTipo(e.target.value)} className="border p-2 w-full" />
            </div>

            <div>
                <label>Categoría:</label>
                <input value={categoria} onChange={(e) => setCategoria(e.target.value)} className="border p-2 w-full" />
            </div>

            <div>
                <label>Descripción:</label>
                <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="border p-2 w-full" />
            </div>

            <div>
                <label>Archivos:</label>
                <input
                    type="file"
                    multiple
                    onChange={(e) => {
                        const nuevosArchivos = Array.from(e.target.files || []);
                        setArchivos((prev) => [...prev, ...nuevosArchivos]);
                    }}
                    className="w-full"
                />

            </div>

            {/* Aquí va la lista de archivos seleccionados */}
      {archivos.length > 0 && (
        <ul className="space-y-1">
          {archivos.map((file, index) => (
            <li key={index} className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded">
              <span className="text-sm truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => setArchivos((prev) => prev.filter((_, i) => i !== index))}
                className="text-red-600 hover:underline text-xs"
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}

            <button type="submit" className="bg-sky-500 text-white px-4 py-2 rounded">📤 Subir Examen</button>
        </form>
    );
};

export default ExamenUploadForm;
