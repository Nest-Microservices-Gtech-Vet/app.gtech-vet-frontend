import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getConsultaById } from "../../../../services/gestion-empresa/consultas/consulta";
import TratamientoForm from "../tratamiento/TratamientoForm";
import { tratamientoByConsultaId } from "../../../../services/gestion-empresa/tratamiento/tratamiento";
import { TratamientoResponse } from "../../../../types/tratamiento/tratamiento";
import ExamenUploadForm from "../examenes/ExamenUploadForm";
import ExamenList from "../examenes/ExamenesList";
import { Examen } from "../../../../types/examenes/examen";
import { getExamenesPorConsulta } from "../../../../services/gestion-empresa/examenes/examen";
import EditarMedicamentosModal from "../tratamiento/EditarMedicamentoModal";
import { useReactToPrint } from "react-to-print";
import RecetaPrint from "./imprimir-receta/RecetaPrint";

const ConsultaDetalle = () => {
    const { empresaId, mascotaId, consultaId, id } = useParams();
    const navigate = useNavigate();

    const [consulta, setConsulta] = useState<any>(null);
    const [tratamientos, setTratamientos] = useState<TratamientoResponse[]>([]);
    const [tratamientoSeleccionado, setTratamientoSeleccionado] = useState<TratamientoResponse | null>(null);
    const [examenes, setExamenes] = useState<Examen[]>([]);
    const [vistaActiva, setVistaActiva] = useState<"tratamiento" | "examenes">("tratamiento");

    const recetaRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: recetaRef, // 👈 ya no se usa content()
        documentTitle: `Receta_${consulta?.mascota.mas_nombre  ?? "consulta"} - ${consulta?.created_at}`,

    });





    // === FETCH CONSULTA ===
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!consultaId) return;
                const datosConsulta = await getConsultaById(consultaId);
                setConsulta(datosConsulta);
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "No se pudieron cargar los datos", "error");
            }
        };
        fetchData();
    }, [consultaId]);

    // === FETCH TRATAMIENTOS ===
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
        fetchTratamientos();
    }, [consulta]);

    // === FETCH EXÁMENES ===
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
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                🩺 Consulta N° {consulta.con_numero_mascota}
            </h2>

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

                    <div className="flex flex-wrap gap-2 mt-6">
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

                {/* LADO DERECHO: Vista dinámica */}
                <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-md">
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
                                        <p>📆 Fecha: {tratamiento.created_at ? new Date(tratamiento.created_at).toLocaleDateString() : "Sin fecha"}</p>

                                        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                                            {tratamiento.medicamentos.map((m) => (
                                                <li key={m.med_id}>
                                                    <strong>{m.med_nombre}</strong> – {m.med_dosis}
                                                </li>
                                            ))}
                                        </ul>

                                        <button
                                            onClick={() => setTratamientoSeleccionado(tratamiento)}
                                            className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                                        >
                                            ✏️ Editar medicamentos
                                        </button>

                                        {tratamientoSeleccionado && (
                                            <EditarMedicamentosModal
                                                tratamiento={tratamientoSeleccionado}
                                                onClose={() => setTratamientoSeleccionado(null)}
                                                onUpdated={() => {
                                                    fetchTratamientos();
                                                    setTratamientoSeleccionado(null);
                                                }}
                                            />
                                        )}
                                    </div>
                                ))
                            )}

                            {consulta && (
                                <div style={{ display: "none" }}>
                                    <div ref={recetaRef}>
                                        <RecetaPrint
                                            empresa={{
                                                nombre: consulta.empresa?.emp_nombre ?? "Sin empresa",
                                                direccion: consulta.empresa?.emp_direccion ?? "No registrada",
                                                telefono: consulta.empresa?.emp_telefono ?? "No registrado",
                                                email: consulta.empresa?.emp_correo ?? "No registrado",
                                                foto: consulta.empresa?.emp_foto ?? "No registrado",
                                            }}
                                            paciente={{
                                                nombre: consulta.mascota?.mas_nombre ?? "Sin nombre",
                                            }}
                                            propietario={{
                                                nombre: `${consulta.mascota?.propietario?.cli_nombre ?? ""} ${consulta.mascota?.propietario?.cli_apellido ?? ""}`.trim() || "No registrado",
                                                cedula: consulta.mascota?.propietario?.cli_identificacion ?? "No registrada",
                                                telefono: consulta.mascota?.propietario?.cli_celular ?? "No registrado",
                                                direccion: consulta.mascota?.propietario?.cli_direccion ?? "No registrada",
                                            }}
                                            medico={{
                                                nombre: `${consulta.medico?.usua_nombre ?? ""} ${consulta.medico?.usua_apellido ?? ""}`, // porque tu API no manda el usuario aún
                                                cedula: consulta.medico?.usua_ruc,             // idem
                                            }}
                                            consulta={{ ...consulta, created_at: consulta?.created_at }}
                                            tratamientos={tratamientos}
                                        />
                                    </div>
                                </div>
                            )}


                            <button
                                type="button"
                                onClick={handlePrint}
                                className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded font-semibold mt-4"
                            >
                                Imprimir Receta
                            </button>
                        </>
                    )}

                    {vistaActiva === "examenes" && (
                        <>
                            <h3 className="text-xl font-semibold mb-4 text-gray-700">🧪 Exámenes Realizados</h3>
                            <ExamenUploadForm
                                empresaId={parseInt(id!)}
                                consultaId={consulta.con_id}
                                onUploadSuccess={() => getExamenesPorConsulta(consulta.con_id).then(setExamenes)}
                            />
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
