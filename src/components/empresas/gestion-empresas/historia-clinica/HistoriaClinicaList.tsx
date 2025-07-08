import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getHistoriaClinicaByMascotaId } from "../../../../services/gestion-empresa/historia-clinica/historiaClinica";

const HistoriaClinicaList = () => {
  const { empresaId } = useParams();
  const { mascotaId } = useParams();
  const { id } = useParams();
  const [historiaClinica, setHistoriaClinica] = useState<any>(null);
  const [expanded, setExpanded] = useState<number | null>(null); // ID de consulta abierta
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getHistoriaClinicaByMascotaId(mascotaId!);
      setHistoriaClinica(data);
    };
    fetchData();
  }, [mascotaId]);

  const toggleExpand = (con_id: number) => {
    setExpanded(prev => (prev === con_id ? null : con_id));
  };

  if (!historiaClinica) return <p>🔄 Cargando historia clínica...</p>;

  return (
    <div className="p-6 max-w-screen-xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">📋 Historia Clínica n°: {historiaClinica.hic_numero_local}</h2>

      <div className="flex justify-items-start gap-4 mb-6">
        <button
          onClick={() => navigate(`/mis-empresas/${id}/mascotas/editar-mascota/${mascotaId}`)}
          className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md transition"
        >
          🔙 Volver a Mascota
        </button>
        <button
          onClick={() => navigate(`/mis-empresas/${id}/mascotas/editar-mascota/${mascotaId}/historia-clinica/nueva`)}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition"
        >
          ➕ Nueva Consulta
        </button>
        {/* <button
          onClick={() => navigate(`/mis-empresas/${id}/mascotas/editar-mascota/${mascotaId}/historia-clinica/vacunas`)}
          className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-md transition"
        >
          💉 Vacunas
        </button> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">🐾 Datos de la Mascota</h3>
          <div className="space-y-2 text-gray-800">
            <div className="mb-4">
              <p><strong>Consultas registradas:</strong> {historiaClinica.consultas?.length ?? 0}</p>
            </div>

            <p><strong>Estado HC:</strong> {historiaClinica.hic_estado}</p>
            <p><strong>Nombre Mascota:</strong> {historiaClinica.mascota?.mas_nombre || 'No disponible'}</p>
            <p><strong>Propietario:</strong> {historiaClinica.mascota?.propietario?.cli_nombre || 'No disponible'}</p>
            <p><strong>Activo:</strong> {historiaClinica.activo ? 'Sí' : 'No'}</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">🩺 Consultas</h3>

          {historiaClinica.consultas?.length === 0 ? (
            <p className="text-gray-600">❗ Aún no hay consultas registradas.</p>
          ) : (
            <ul className="space-y-4">
              {historiaClinica.consultas.map((consulta: any) => (
                <li
                  key={consulta.con_id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition p-4"
                >
                  <div className="flex justify-between items-center">
                    <div className="text-gray-800 text-sm">
                      {/* <p><strong>📅 Fecha:</strong> {new Date(consulta.con_fecha).toLocaleDateString()}</p>
                      <p><strong>📝 Motivo:</strong> {consulta.con_motivo}</p>
                      <p><strong>📝 firmante- doc.dantiago david:</strong> </p>
                      <p><strong>📝 examenes:</strong> si  </p> */}
                      <p>
                        <strong>📝 Numero de consulta:</strong> {consulta.con_numero_mascota} 
                        {/* muestra el id original global de la consulta */}
                        {/* <strong>📝 id consulta:</strong>{consulta.con_id} */}
                        <strong>📅 Fecha:</strong> {new Date(consulta.con_fecha).toLocaleDateString()}
                        <strong>📝 Motivo:</strong> {consulta.con_motivo}</p>
                      <p><strong>📝 firmante- doc.dantiago david:</strong>
                        <strong>📝 examenes:</strong> si  </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => toggleExpand(consulta.con_id)}
                        className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium px-3 py-1 rounded-md transition"
                      >
                        {expanded === consulta.con_id ? '▲ Ocultar Detalle' : '▼ Ver Detalle'}
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/mis-empresas/${id}/mascotas/editar-mascota/${mascotaId}/historia-clinica/consulta/${consulta.con_id}/ver`)
                        }
                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium px-3 py-1 rounded-md transition"
                      >
                        ✏️ Ver
                      </button>
                      {/* desactivar ver despues de 48 horas */}
                    </div>


                  </div>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${expanded === consulta.con_id ? 'max-h-96 mt-4 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                  >
                    {expanded === consulta.con_id && (
                      <div className="pt-4 mt-2 border-t border-gray-200 bg-gray-50 rounded-md px-4 py-3 text-sm text-gray-700 space-y-2">
                        <p><strong>🗒️ Diagnostico Presuntivo:</strong> {consulta.con_diagnosticoPresuntivo || 'No especificado'}</p>
                        <p><strong>🩻 Observaciones:</strong> {consulta.con_observaciones || 'No especificado'}</p>
                        <p><strong>💊 Recomendadiones:</strong> {consulta.con_recomendaciones || 'No especificado'}</p>
                        
                      </div>
                    )}
                  </div>
                  <button
  onClick={() => navigate(
    `/mis-empresas/${id}/mascotas/editar-mascota/${mascotaId}/historia-clinica/consulta/${consulta.con_id}/vacuna/registrar`, {
      state: {
        numeroConsulta: consulta.con_numero_mascota,
      }
    }
  )}
  className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-md transition"
>
  💉 Registrar Vacuna
</button>
                </li>
              ))}
              

            </ul>
          )}
          
        </div>
        
      </div>
      
    </div>
  );
};

export default HistoriaClinicaList;
