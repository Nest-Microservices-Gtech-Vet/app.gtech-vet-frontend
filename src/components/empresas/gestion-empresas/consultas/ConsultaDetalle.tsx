import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getConsultaById } from "../../../../services/gestion-empresa/consultas/consulta";
import { getVacunasPorConsulta } from "../../../../services/gestion-empresa/vacunas/vacunas";
import TratamientoForm from "../tratamiento/TratamientoForm";
import { tratamientoByConsultaId, } from "../../../../services/gestion-empresa/tratamiento/tratamiento";
import { TratamientoResponse } from "../../../../types/tratamiento/tratamiento";
import ExamenUploadForm from "../examenes/ExamenUploadForm";
import ExamenList from "../examenes/ExamenesList";
import { Examen } from "../../../../types/examenes/examen";
import { getExamenesPorConsulta } from "../../../../services/gestion-empresa/examenes/examen";

const ConsultaDetalle = () => {
    const { empresaId, mascotaId, consultaId, id, tratamientoId } = useParams();
    const [consulta, setConsulta] = useState<any>(null);
    const [vacunas, setVacunas] = useState<any[]>([]);
    const [tratamientos, setTratamientos] = useState<TratamientoResponse[]>([]);
    const [examenes, setExamenes] = useState<Examen[]>([]);


    const [vistaActiva, setVistaActiva] = useState<"tratamiento" | "examenes">("tratamiento");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const datosConsulta = await getConsultaById(consultaId!);
                setConsulta(datosConsulta);

                // const listaVacunas = await getVacunasPorConsulta(consultaId!);
                // setVacunas(listaVacunas);
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "No se pudieron cargar los datos", "error");
            }
        };

        fetchData();
    }, [consultaId]);
    // 
    useEffect(() => {
        fetchTratamientos(); // mueve esta función afuera
    }, [consulta]);

    const fetchTratamientos = async () => {
        if (!consulta?.con_id) return;

        try {
            const data = await tratamientoByConsultaId(consulta.con_id);
            setTratamientos(data);
        } catch (error) {
            console.error("Error al obtener tratamiento:", error);
        }
    };

    useEffect(() => {
        const fetchExamenes = async () => {
            if (!consulta?.con_id) return;

            try {
                const data = await getExamenesPorConsulta(consulta.con_id);
                setExamenes(data);
            } catch (error) {
                console.error("Error al obtener exámenes:", error);
            }
        };

        fetchExamenes();
    }, [consulta]);


    if (!consulta) return <p>🔄 Cargando consulta...</p>;



    return (
        <div className="p-6 max-w-screen-2xl mx-auto bg-white shadow rounded">

            <h2 className="text-2xl font-bold mb-4 text-gray-800">🩺 Consulta N° {consulta.con_numero_mascota}</h2>

            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md transition"
                >
                    🔙 Volver
                </button>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LADO IZQUIERDO: Detalles de la Consulta */}
                <div className="lg:col-span-1 bg-gray-50 rounded-lg p-6 shadow-inner">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">📄 Detalles de la Consulta</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                        <p><strong>📅 Fecha:</strong> {new Date(consulta.con_fecha).toLocaleDateString()}</p>
                        <p><strong>📝 Motivo:</strong> {consulta.con_motivo}</p>
                        <p><strong>⚖️ Peso:</strong> {consulta.con_peso} kg</p>
                        <p><strong>🌡️ Temperatura:</strong> {consulta.con_temperaturaCorporal}°C</p>
                        <p><strong>❤️ Pulso:</strong> {consulta.con_pulso}</p>
                        <p><strong>🫁 Frecuencia Respiratoria:</strong> {consulta.con_frecuenciaRespiratoria}</p>
                        <p><strong>❤️ Frecuencia Cardiaca:</strong> {consulta.con_frecuenciaCardiaca}</p>
                        <p><strong>🩻 Diagnóstico:</strong> {consulta.con_diagnosticoPresuntivo}</p>
                        <p className="col-span-2"><strong>📝 Observaciones:</strong> {consulta.con_observaciones}</p>
                        <p className="col-span-2"><strong>✅ Recomendaciones:</strong> {consulta.con_recomendaciones}</p>

                    </div>

                    {/* Botones de navegación de vista */}
                    <div className="flex flex-wrap gap-2 mt-6">
                        {/* <button
                            onClick={() => setVistaActiva("vacunas")}
                            className={`py-2 px-4 rounded-md transition ${vistaActiva === "vacunas" ? "bg-sky-500 text-white" : "bg-gray-200 text-gray-700"}`}
                        >
                            💉 Vacunas
                        </button> */}
                        <button
                            onClick={() => setVistaActiva("tratamiento")}
                            className={`py-2 px-4 rounded-md transition ${vistaActiva === "tratamiento" ? "bg-sky-500 text-white" : "bg-gray-200 text-gray-700"}`}
                        >
                            💊 Tratamiento
                        </button>
                        <button
                            onClick={() => setVistaActiva("examenes")}
                            className={`py-2 px-4 rounded-md transition ${vistaActiva === "examenes" ? "bg-sky-500 text-white" : "bg-gray-200 text-gray-700"}`}
                        >
                            🧪 Exámenes
                        </button>
                    </div>
                </div>

                {/* LADO DERECHO: Vista dinámica según botón */}
                <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-md">
                    {/* {vistaActiva === "vacunas" && (
                        <>
                            <h3 className="text-xl font-semibold mb-4 text-gray-700">💉 Vacunas Registradas</h3>
                            <button
                                onClick={() =>
                                    navigate(
                                        `/mis-empresas/${id}/mascotas/editar-mascota/${mascotaId}/historia-clinica/consulta/${consulta.con_id}/vacuna/registrar`,
                                        { state: { numeroConsulta: consulta.con_numero_mascota } }
                                    )
                                }
                                className="bg-sky-500 hover:bg-sky-600 text-white py-1 px-4 mb-2 rounded-md transition"
                            >
                                💉 Registrar Vacuna
                            </button>
                            {vacunas.length === 0 ? (
                                <p className="text-gray-500">No hay vacunas registradas aún.</p>
                            ) : (
                                vacunas.map((v) => (
                                    <li key={v.vac_id} className="bg-gray-50 p-4 rounded border border-gray-200 mb-2 list-none">
                                        <p><strong>📆 Fecha:</strong> {new Date(v.vac_fecha).toLocaleDateString()}</p>
                                        <p><strong>💉 Nombre:</strong> {v.vac_nombre}</p>
                                        <p><strong>🧪 Tipo:</strong> {v.vac_tipo}</p>
                                        <p><strong>🔢 Lote:</strong> {v.vac_lote}</p>
                                        <p><strong>📝 Observaciones:</strong> {v.vac_observacion || 'Ninguna'}</p>
                                        <p><strong>📆 Fecha proxima vacuna:</strong> {new Date(v.vac_proxima).toLocaleDateString()}</p>

                                        {v.VacunaFoto && v.VacunaFoto.length > 0 && (
                                            <div className="flex gap-2 mt-2">
                                                {v.VacunaFoto.map((foto: any) => (
                                                    <img
                                                        key={foto.vf_id}
                                                        src={`http://localhost:3010${foto.url}`}
                                                        alt="Foto vacuna"
                                                        className="w-24 h-24 object-cover border rounded"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </li>
                                ))
                            )}
                        </>
                    )} */}

                    {vistaActiva === "tratamiento" && (
                        <>
                            <TratamientoForm
                                consultaId={consulta.con_id}
                                mascotaId={consulta.mascota_id}
                                empresaId={parseInt(id!)}
                                onSuccess={fetchTratamientos}
                            />
                            {tratamientos.length === 0 ? (
                                <p className="text-gray-500 mt-4">No hay tratamientos registrados.</p>
                            ) : (
                                tratamientos.map((tratamiento) => (
                                    <div key={tratamiento.tra_id} className="mt-6 border-t pt-4">
                                        <h4 className="text-md font-semibold mb-2 text-gray-700">🧾 Tratamiento #{tratamiento.tra_id}</h4>
                                        <p>📆 Fecha:
                                            {tratamiento.created_at
                                                ? new Date(tratamiento.created_at).toLocaleDateString()
                                                : "Sin fecha"}
                                        </p>
                                        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                                            {tratamiento.medicamentos.map((m) => (

                                                <li key={m.med_id}>
                                                    {/*esto para fecha y hora <p>
                                                        {tratamiento.created_at
                                                            ? new Date(tratamiento.created_at).toLocaleString()
                                                            : "Sin fecha"}
                                                    </p> */}



                                                    <strong>{m.med_nombre}</strong> – {m.med_dosis}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))
                            )}
                        </>

                    )}

                    <div>
                        <button
                            type="submit"
                            className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded font-semibold"
                        >
                            imprimir Receta
                        </button>
                    </div>

                    {vistaActiva === "examenes" && (
                        <>
                            <h3 className="text-xl font-semibold mb-4 text-gray-700">🧪 Exámenes Realizados</h3>
                            <p>Aquí puedes mostrar o registrar los exámenes realizados.</p>
                            <ExamenUploadForm empresaId={parseInt(id!)} consultaId={consulta.con_id} onUploadSuccess={() => {
                                // recarga exámenes al subir
                                getExamenesPorConsulta(consulta.con_id).then(setExamenes);
                            }} />
                            <div className="mt-6">
                                <ExamenList examenes={examenes} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConsultaDetalle;
