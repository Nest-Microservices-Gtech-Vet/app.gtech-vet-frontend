import { Examen } from "../../../../types/examenes/examen";


interface Props {
  examenes: Examen[];
}

const ExamenList = ({ examenes }: Props) => {
  if (examenes.length === 0) {
    return <p>No hay exámenes registrados.</p>;
  }

  return (
    <div className="space-y-6">
      {examenes.map((exam) => (
        <div key={exam.exam_id} className="p-4 border rounded bg-gray-50 shadow">
          <p><strong>📌 Tipo:</strong> {exam.exam_tipo}</p>
          <p><strong>📅 Fecha:</strong> {new Date(exam.created_at).toLocaleDateString()}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {exam.archivos.map((archivo) => (
              <div key={archivo.exa_id} className="border rounded p-2 bg-white shadow-sm">
                <img
                  src={`http://localhost:3010/uploads/${archivo.exa_url}`}
                  alt={archivo.exa_descripcion}
                  className="w-full h-32 object-cover mb-2"
                />
                <p className="text-sm">
                  <strong>{archivo.exa_categoria}</strong><br />
                  {archivo.exa_descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExamenList;
