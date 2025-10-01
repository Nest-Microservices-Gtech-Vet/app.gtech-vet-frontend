import React from "react";

type RecetaPrintProps = {
    empresa: {
        nombre: string;
        direccion: string;
        telefono: string;
        email: string;
        foto: string;
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
                    <p className="font-bold text-lg text-gray-700 mr-2">{empresa.nombre}</p>
                    <hr className="mb-4 mt-6" />
                    {/* DATOS PACIENTE */}
                    <p><strong>Nombre (paciente):</strong> {paciente.nombre} <strong>Propietario:</strong> {propietario.nombre}</p>
                    <p><strong>Cédula:</strong> {propietario.cedula}</p>
                    <p><strong>Teléfono:</strong> {propietario.telefono}</p>
                    <p><strong>Dirección:</strong> {propietario.direccion}</p>
                    <p>
                        <strong>Fecha:</strong>{" "}
                        {consulta.created_at
                            ? new Date(consulta.created_at).toLocaleString()
                            : "Sin fecha"}
                    </p>



                </div>

                {/* Datos y Logo de la Clínica */}
                <div className="flex flex-col items-end">

                    <div className="flex items-center">



                        {/* Logo con efecto hover */}
                        <div className="flex-shrink-0 transform transition duration-300 group-hover:scale-105">
                            <img
                                src={`http://localhost:3010/uploads/logos/${empresa.foto}`}
                                alt={empresa.nombre}
                                className="w-24 h-24 object-cover rounded-lg border"
                            />
                        </div>
                    </div>

                </div>
            </div>
            {/* CUERPO DE LA RECETA - Vacío para escritura manual */}
            <div className="min-h-[25rem] border border-gray-300 mb-6 p-4">

                {/* TRATAMIENTOS */}

                <div className="mb-6">

                    <h2 className="font-semibold mb-2 text-2xl">Receta:</h2>

                    {tratamientos.length === 0 ? (

                        <p>No hay tratamientos registrados</p>

                    ) : (

                        tratamientos.map((t, i) => (

                            <div key={i} className="mb-3">
                                <ul className="list-disc list-inside text-2xl">
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
            <hr className="mb-4 mt-6" />

            <div className="items-center justify-center ">
                <p className="font-bold text-lg text-gray-700 mr-2">Generado por AmigoVet www.amigovet123.com - Sistema Clinico Veterinario</p>
                <p className="font-bold text-lg text-gray-700 mr-2">By Guardiao-Tech www.guardiaotech.com</p>

            </div>
        </div>
    );
};

export default RecetaPrint;