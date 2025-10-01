import React from "react";

type CartillaVacunasPrintProps = {
    empresa: {
        nombre: string;
        direccion: string;
        telefono: string;
        email: string;
        foto: string;
    };
    mascota: {
        nombre: string;
        fechaNacimiento: string;
        color?: string;
    };
    propietario: {
        nombre: string;
        cedula: string;
        telefono: string;
        direccion: string;
    };
    medico?: {
        nombre: string;
        cedula?: string;
    };
    vacunas: any[]; // lista de vacunas
};

const CartillaVacunasPrint: React.FC<CartillaVacunasPrintProps> = ({
    empresa,
    mascota,
    propietario,
    medico,
    vacunas,
}) => {
    return (
        <div className="w-full h-auto p-4 md:p-8 bg-white border border-gray-300 shadow-md print:shadow-none print:border-0 font-sans">
            {/* ENCABEZADO */}
            <div className="flex justify-between items-start mb-6">
                {/* Franja de color izquierda */}
                <div className="flex h-32 absolute top-0 left-0">
                    <div className="w-8 bg-[#3c6ca6] h-full"></div>
                    <div className="w-8 bg-[#2d568c] h-full relative">
                        <div className="w-0 h-0 border-t-[32px] border-l-[32px] border-t-white border-l-[#2d568c] absolute bottom-0"></div>
                    </div>
                </div>

                {/* Información del Médico y Empresa */}
                <div className="ml-16 pr-8">
                    <p className="font-bold text-lg text-gray-700 mr-2">{empresa.nombre}</p>

                    <p className="font-bold text-lg">
                        Dr(a). {medico?.nombre ?? "No registrado"}
                    </p>

                    <p className="text-gray-600">MÉDICO VETERINARIO</p>
                    <hr className="mb-4 mt-6" />

                    {/* DATOS DE MASCOTA Y PROPIETARIO */}
                    <p><strong>Propietario:</strong> {propietario.nombre}</p>
                    <p><strong>Cédula:</strong> {propietario.cedula} <strong>Teléfono:</strong> {propietario.telefono}</p>
                    <p><strong>Dirección:</strong> {propietario.direccion}</p>
                    <p><strong>Nombre (paciente):</strong> {mascota.nombre} {mascota.color ? `(${mascota.color})` : ""} </p>
                    <p><strong>Fecha Nacimiento:</strong> {mascota.fechaNacimiento ? new Date(mascota.fechaNacimiento).toLocaleDateString() : "No registrada"}</p>

                </div>

                {/* Logo de la Empresa */}
                <div className="flex flex-col items-end">
                    <div className="flex items-center">
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

            {/* CUERPO: Tabla de Vacunas */}
            <div className="min-h-[25rem] border border-gray-300 mb-6 p-4 bg-gray-50 rounded-lg">
                <h2 className="font-semibold mb-4 text-2xl text-gray-800">Registro Vacunas:</h2>

                {vacunas.length === 0 ? (
                    <p className="text-gray-500">No hay vacunas registradas</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left rounded-lg overflow-hidden shadow-md bg-white">
                            <thead className="bg-blue-100 text-gray-700 uppercase text-xs">
                                <tr>
                                    <th className="p-3">Fecha</th>
                                    <th className="p-3">Nombre Vacuna</th>
                                    <th className="p-3">Tipo</th>

                                    <th className="p-3">Próxima</th>
                                    <th className="p-3">Lote</th>
                                    <th className="p-3">Observación</th>
                                    {/* <th className="p-3">Foto</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {vacunas.map((vac) => (
                                    <tr key={vac.vac_id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="px-2 py-1">{new Date(vac.vac_fecha).toLocaleDateString("es-EC", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                            hour12: false, // para formato 24h
                                        })}</td>
                                        <td className="p-3 font-medium">{vac.vac_nombre}</td>
                                        <td className="p-3">{vac.vac_tipo}</td>

                                        <td className="p-3">
                                            {vac.vac_proxima ? (
                                                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">
                                                    {vac.vac_proxima.split("T")[0]}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="p-3">{vac.vac_lote || "-"}</td>
                                        <td className="p-3">{vac.vac_observacion || "-"}</td>
                                        {/* <td className="p-3">
                                            {vac.VacunaFoto && vac.VacunaFoto.length > 0 ? (
                                                <img
                                                    src={`http://localhost:3010${vac.VacunaFoto[0].url}`}
                                                    alt={vac.vac_nombre}
                                                    className="w-16 h-16 object-cover rounded-md border"
                                                />
                                            ) : (
                                                <span className="text-gray-400">Sin foto</span>
                                            )}
                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>


            {/* PIE DE PÁGINA */}
            <div className="flex justify-between items-center text-gray-600 mb-4">
                <div className="flex items-center gap-4">
                    <span>📞 {empresa.telefono}</span>
                    <span>📧 {empresa.email}</span>
                    <span>📍 {empresa.direccion}</span>
                </div>
            </div>
            <hr className="mb-4 mt-6" />
            <div className="items-center justify-center text-center">
                <p className="font-bold text-lg text-gray-700">
                    Generado por AmigoVet www.amigovet123.com - Sistema Clínico Veterinario
                </p>
                <p className="font-bold text-lg text-gray-700">
                    By Guardiao-Tech www.guardiaotech.com
                </p>
            </div>
        </div>
    );
};

export default CartillaVacunasPrint;