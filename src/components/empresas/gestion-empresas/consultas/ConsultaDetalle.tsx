import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getConsultaById } from "../../../../services/gestion-empresa/consultas/consulta";
import { getVacunasPorConsulta } from "../../../../services/gestion-empresa/vacunas/vacunas";

const ConsultaDetalle = () => {
    const { empresaId, mascotaId, consultaId, id } = useParams();
    const [consulta, setConsulta] = useState<any>(null);
    const [vacunas, setVacunas] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const datosConsulta = await getConsultaById(consultaId!);
                setConsulta(datosConsulta);

                const listaVacunas = await getVacunasPorConsulta(consultaId!);
                setVacunas(listaVacunas);
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "No se pudieron cargar los datos", "error");
            }
        };

        fetchData();
    }, [consultaId]);

    if (!consulta) return <p>🔄 Cargando consulta...</p>;

    return (
        <div className="p-6 max-w-screen-xl mx-auto bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">🩺 Consulta N° {consulta.con_numero_mascota}</h2>

            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md transition"
                >
                    🔙 Volver
                </button>
                <button
                    onClick={() =>
                        navigate(
                            `/mis-empresas/${id}/mascotas/editar-mascota/${mascotaId}/historia-clinica/consulta/${consulta.con_id}/vacuna/registrar`,
                            { state: { numeroConsulta: consulta.con_numero_mascota } }
                        )
                    }
                    className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-md transition"
                >
                    💉 Registrar Vacuna
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Datos de consulta */}
                <div className="bg-gray-50 rounded-lg p-6 shadow-inner">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">📄 Detalles de la Consulta</h3>
                    <p><strong>📅 Fecha:</strong> {new Date(consulta.con_fecha).toLocaleDateString()}</p>
                    <p><strong>📝 Motivo:</strong> {consulta.con_motivo}</p>
                    <p><strong>⚖️ Peso:</strong> {consulta.con_peso} kg</p>
                    <p><strong>🌡️ Temperatura:</strong> {consulta.con_temperaturaCorporal}°C</p>
                    <p><strong>❤️ Pulso:</strong> {consulta.con_pulso}</p>
                    <p><strong>🫁 Frecuencia Respiratoria:</strong> {consulta.con_frecuenciaRespiratoria}</p>
                    <p><strong>❤️ Frecuencia Cardiaca:</strong> {consulta.con_frecuenciaCardiaca}</p>
                    <p><strong>🩻 Diagnóstico:</strong> {consulta.con_diagnosticoPresuntivo}</p>
                    <p><strong>📝 Observaciones:</strong> {consulta.con_observaciones}</p>
                    <p><strong>✅ Recomendaciones:</strong> {consulta.con_recomendaciones}</p>
                </div>

                {/* Listado de vacunas */}
                <div className="bg-white rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">💉 Vacunas Registradas</h3>
                    {vacunas.map((v) => (
                        <li key={v.vac_id} className="bg-gray-50 p-4 rounded border border-gray-200">
                            <p><strong>📆 Fecha:</strong> {new Date(v.vac_fecha).toLocaleDateString()}</p>
                            <p><strong>💉 Nombre:</strong> {v.vac_nombre}</p>
                            <p><strong>🧪 Tipo:</strong> {v.vac_tipo}</p>
                            <p><strong>🔢 Lote:</strong> {v.vac_lote}</p>
                            <p><strong>📝 Observaciones:</strong> {v.vac_observacion || 'Ninguna'}</p>

                            {/* Mostrar fotos si existen */}
                            {v.VacunaFoto && v.VacunaFoto.length > 0 && (
                                <div className="flex gap-2 mt-2">
                                    {v.VacunaFoto.map((foto: any) => (
                                        <img
                                            key={foto.vf_id}
                                            src={`http://localhost:3010${foto.url}`} // asegúrate de que el campo `url` empiece con `/uploads/...`
                                            alt="Foto vacuna"
                                            className="w-24 h-24 object-cover border rounded"
                                        />
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default ConsultaDetalle;
