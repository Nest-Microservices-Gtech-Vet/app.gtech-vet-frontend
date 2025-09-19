import React from "react";

type RecetaPrintProps = {
    empresa: {
        nombre: string;
        direccion: string;
        telefono: string;
        email:string;
    };
    paciente: {
        nombre: string;
    };
    propietario: {
        nombre: string;
        cedula: string;
        telefono: string;
        direccion: string;
    };
    medico: {
        nombre: string;
        cedula: string;
    };
    consulta: any;
    tratamientos: any[];
};

const RecetaPrint: React.FC<RecetaPrintProps> = ({
    empresa,
    paciente,
    propietario,
    medico,
    consulta,
    tratamientos,
}) => {
    return (
        <div className="w-full h-auto p-4 md:p-8 bg-white border border-gray-300 shadow-md print:shadow-none print:border-0 font-sans">
            {/* Contenedor principal para simular la hoja */}

            {/* ENCABEZADO */}
            <div className="flex justify-between items-start mb-6">
                {/* Franja de color izquierda - Adaptada con un div y clases de color */}
                <div className="flex h-32 absolute top-0 left-0">
                    <div className="w-8 bg-[#3c6ca6] h-full"></div>
                    <div className="w-8 bg-[#2d568c] h-full relative">
                        <div className="w-0 h-0 border-t-[32px] border-l-[32px] border-t-white border-l-[#2d568c] absolute bottom-0"></div>
                    </div>
                </div>

                {/* Información del Médico */}
                <div className="ml-16 pr-8">
                    <p className="font-bold text-lg">Dr(a). {medico.nombre}</p>
                    <p className="text-gray-600">MÉDICO VETERINARIO</p>
                    <p className="text-sm">Cédula Profesional: {medico.cedula}</p>
                    <hr className="mb-4 mt-6" />
{/* DATOS PACIENTE */}
                    <p><strong>Nombre (paciente):</strong> {paciente.nombre}</p>
                    <p><strong>Propietario:</strong> {propietario.nombre}</p>
                    <p><strong>Cédula:</strong> {propietario.cedula}</p>
                    <p><strong>Teléfono:</strong> {propietario.telefono}</p>
                    <p><strong>Dirección:</strong> {propietario.direccion}</p>

                </div>

                {/* Datos y Logo de la Clínica */}
                <div className="flex flex-col items-end">
                    <div className="text-right mb-4">
                        <p className="text-sm">D.C.P 436678</p>
                        <p className="text-sm">S.S.A. 34728</p>
                        <p className="text-sm">Medicina Interna, 676520</p>
                        <p className="text-sm">Universidad Nacional Autónoma</p>
                    </div>
                    <div className="flex items-center">
                       
                        <p className="font-bold text-lg text-gray-700 mr-2">{empresa.nombre}</p>

                        {/* Aquí puedes usar una imagen real del logo o un SVG */}
                        <div className="w-16 h-16 text-[#3c6ca6] rounded-full flex items-center justify-center">
                            {/* Ejemplo de un logo SVG */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.5 5.5 0 017.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3A5.5 5.5 0 0122 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-right mt-2">
                        <p className="text-sm">FECHA: {consulta.created_at ? new Date(consulta.created_at).toLocaleDateString() : "Sin fecha"}</p>
                        
                    </div>
                </div>
            </div>

            <hr className="mb-4 mt-6" />

            {/* CUERPO DE LA RECETA - Vacío para escritura manual */}
            <div className="min-h-[25rem] border border-gray-300 mb-6 p-4">

                {/* TRATAMIENTOS */}

                <div className="mb-6">

                    <h2 className="font-semibold mb-2">Receta:</h2>

                    {tratamientos.length === 0 ? (

                        <p>No hay tratamientos registrados</p>

                    ) : (

                        tratamientos.map((t, i) => (

                            <div key={i} className="mb-3">
                                <ul className="list-disc list-inside">
                                    {t.medicamentos.map((m: any) => (
                                        <li key={m.med_id}>
                                            {m.med_nombre} – {m.med_dosis}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {/* PIE DE PÁGINA */}
            <div className="flex justify-between items-center  text-gray-600">
                <div className="flex items-center">
                    <span className="mr-4">📞 {empresa.telefono}</span>
                    <span className="mr-4">📧 {empresa.email}</span>
                    <span>📍 {empresa.direccion}</span>
                </div>
            </div>
        </div>
    );
};

export default RecetaPrint;