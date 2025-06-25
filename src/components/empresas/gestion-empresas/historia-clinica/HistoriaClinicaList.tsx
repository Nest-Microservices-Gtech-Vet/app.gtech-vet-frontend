import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getHistoriaClinicaByMascotaId } from "../../../../services/gestion-empresa/historia-clinica/historiaClinica";

const HistoriaClinicaList = () => {
  const { empresaId } = useParams();
  const { mascotaId } = useParams();
  const { id } = useParams();
  const [historiaClinica, setHistoriaClinica] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getHistoriaClinicaByMascotaId(mascotaId!);
      setHistoriaClinica(data);
    };
    fetchData();
  }, [mascotaId]);

  if (!historiaClinica) return <p>🔄 Cargando historia clínica...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">📋 Historia Clínica de la Mascota</h2>

      <div className="mb-4">
        <p><strong>Estado:</strong> {historiaClinica.hic_estado}</p>
       <p><strong>Consultas registradas:</strong> {historiaClinica.consultas?.length ?? 0}</p>
      </div>

      <div className="flex justify-between items-center my-4">
        <h3 className="text-xl font-semibold">🩺 Consultas</h3>
        <Link
          to={`/mis-empresas/${id}/mascotas/editar-mascota/${mascotaId}/historia-clinica/nueva`}
          className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded"
        >
          + Nueva Consulta
        </Link>
      </div>

      {historiaClinica.consultas?.length === 0 ? (
  <p>❗ Aún no hay consultas registradas.</p>
) : (
  <ul className="space-y-3">
    {historiaClinica.consultas?.map((consulta: any) => (
      <li key={consulta.con_id} className="border p-4 rounded shadow-sm flex justify-between">
        <div>
          <p><strong>Fecha:</strong> {new Date(consulta.con_fecha).toLocaleDateString()}</p>
          <p><strong>Motivo:</strong> {consulta.con_motivo}</p>
        </div>
        <Link
          to={`/mis-empresas/${id}/mascotas/${mascotaId}/historia-clinica/${consulta.con_id}`}
          className="text-blue-500 hover:underline"
        >
          Ver Detalle →
        </Link>
      </li>
    ))}
  </ul>
)}

    </div>
  );
};

export default HistoriaClinicaList;