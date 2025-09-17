import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMascotas, removeMascota } from "../../../../services/gestion-empresa/mascotas/mascotas";
import Swal from "sweetalert2";

const useDebounce = (value: string, delay: number = 500): string => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
};


const MascotasList = () => {
    const [mascotas, setMascotas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchMascotas = async () => {
            setLoading(true);
            try {
                const empresaId = Number(id);
                const data = await getMascotas(empresaId, debouncedSearch);
                if (Array.isArray(data)) {
                    setMascotas(data);
                } else {
                    console.error("La respuesta no es un array:", data);
                }
            } catch (error) {
                console.error("Error al obtener mascotas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMascotas();
    }, [id, debouncedSearch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const crearCliente = () => {
        navigate(`/mis-empresas/${id}/clientes/crear-cliente`);
    }

    const crearMascota = () => {
        navigate(`/mis-empresas/${id}/mascotas/crear-mascota`);
    }

    const updatedMascota = (mascotaId: string) => {
        navigate(`/mis-empresas/${id}/mascotas/editar-mascota/${mascotaId}`)
    }

    const historiClinica = (mascotaId: string) => {
        navigate(`/mis-empresas/${id}/mascotas/${mascotaId}/historia-clinica`)
    }

    const removedMascota = async (mascotaId: string) => {
        const result = await Swal.fire({
            title: "¿Estás seguro de desactivar este registro?",
            text: "¡No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, Desactivar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            const desactMascota = await removeMascota(mascotaId);
            if (desactMascota) {
                Swal.fire("Registro Desactivado!", "El Cliente ha sido desactivado.", "success");
                setMascotas((prevMascotas) => prevMascotas.filter((mascotas) => mascotas.mas_id !== mascotaId))
            } else {
                Swal.fire("Error", "No se pudo desactivar el cliente.", "error");
            }
        }
    }

    return (
        <div className="max-w-full flex flex-col items-center bg-gray-50 text-black p-15">
            <div className="w-full bg-white rounded-lg shadow-sm px-6 py-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                {/* Título */}
                <h2 className="text-2xl font-bold text-gray-800 w-full md:w-1/3 text-left">
                    🐶 Nuestras Mascotas
                </h2>

                {/* Buscador con ícono */}
                <div className="w-full md:w-1/3 relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar mascota..."
                        value={search}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Botones */}
                <div className="w-full md:w-1/3 flex flex-col md:flex-row gap-2 md:justify-end">
                    <button
                        onClick={crearCliente}
                        className="bg-blue-400 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
                    >
                        ➕ Crear Cliente
                    </button>
                    <button
                        onClick={crearMascota}
                        className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
                    >
                        ➕ Crear Mascota
                    </button>
                </div>

            </div>


            <div className="w-full overflow-x-auto">
                <table className="w-full bg-gray-50 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                        <tr className="text-left">
                            <th className="p-2">Nombres</th>
                            <th className="p-2">Fecha Nacimiento</th>
                            <th className="p-2">Especie</th>
                            <th className="p-2">Color</th>
                            <th className="p-2">Esterilizado</th>
                            <th className="p-2">Estado</th>
                            <th className="p-2">Acciones</th>

                            <th className="p-2">Medico</th>
                            <th className="p-2">Desactivar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mascotas.map((mascota, index) => (
                            <tr key={mascota.mas_id} className="shadow-amber-50">
                                <td className="p-2 whitespace-nowrap">{mascota.mas_nombre}</td>
                                <td className="p-2 whitespace-nowrap">{mascota.mas_fechaNac?.split('T')[0] || ""}</td>
                                <td className="p-2 whitespace-nowrap"> {mascota.especie?.esp_nombre ?? 'Sin especie'}</td>
                                <td className="p-2 whitespace-nowrap">{mascota.mas_color}</td>
                                <td className="p-2 whitespace-nowrap">
                                    {mascota.mas_esterilizado ? (
                                        <span className="text-green-500">Si</span>
                                    ) : (
                                        <span className="text-red-500">No</span>
                                    )}
                                </td>
                                {/* Mostrar el estado como texto */}
                                <td className="p-2 whitespace-nowrap">
                                    {mascota.activo ? (
                                        <span className="text-green-500">Activo</span>
                                    ) : (
                                        <span className="text-red-500">Inactivo</span>
                                    )}
                                </td>

                                {/* <td className="p-2 whitespace-nowrap">
                                    <button onClick={() => handleEmpresaUsuario(empresa.emp_id)}  className="bg-green-500 px-3 py-1 rounded-md hover:bg-green-600">
                                        🔎 Asignar Usuarios
                                    </button>
                                </td> */}

                                {/* <td className="p-2 whitespace-nowrap">
                                    <button
                                        // onClick={() => handleVerEmpresa(empresa.emp_id)}
                                        className="bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600">
                                        🔎 Histoaria Clinica
                                    </button>
                                </td> */}

                                <td className="p-2 whitespace-nowrap">
                                    <button
                                        onClick={() => updatedMascota(mascota.mas_id)}
                                        className="bg-orange-500 px-3 py-1 rounded-md hover:bg-orange-600">
                                        📝 Ver
                                    </button>
                                </td>

                                <td className="p-2 whitespace-nowrap">
                                    <button
                                        onClick={() => historiClinica(mascota.mas_id)}
                                        className="bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600">
                                        🔎 Historia Clinica
                                    </button>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                    <button
                                        onClick={() => removedMascota(mascota.mas_id)}
                                        className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600"
                                    >
                                        🚫 Desactivar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default MascotasList;