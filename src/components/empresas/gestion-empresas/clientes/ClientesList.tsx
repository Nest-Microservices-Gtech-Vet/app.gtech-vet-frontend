import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { getClientes, getClientesPorEmpresa, removeCliente } from "../../../../services/gestion-empresa/clientes/clientes";
import { div } from "framer-motion/client";
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

const ClientesList = () => {
    const [clientes, setClientes] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
     const debouncedSearch = useDebounce(search, 500);
    const navigate = useNavigate();
    const { id } = useParams();

    // 
    const fetchClientes = async () => {
        setLoading(true);
        try {
            const empresaId = Number(id);
            const data = await getClientesPorEmpresa(empresaId, debouncedSearch);
            setClientes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al obtener clientes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, [id,debouncedSearch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleSearch = () => {
        fetchClientes();
    };

    const crearCliente = () => {
        navigate(`/mis-empresas/${id}/clientes/crear-cliente`);
    }

    const updatedCliente = (clienteId: string,) => {
        navigate(`/mis-empresas/${id}/clientes/editar-cliente/${clienteId}`);
    }

    const handleDelete = async (clienteId: string) => {
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
            const deleteResult = await removeCliente(clienteId);
            if (deleteResult) {
                Swal.fire("Registro Desactivado!", "El Cliente ha sido desactivado.", "success");
                setClientes((prevClientes) => prevClientes.filter((cliente) => cliente.cli_id !== clienteId));
            } else {
                Swal.fire("Error", "No se pudo desactivar el cliente.", "error");
            }
        }
    };

    return (
        <div className="max-w-full flex flex-col items-center bg-gray-50 text-black p-15">
            <div className="w-full bg-white rounded-lg shadow-sm px-6 py-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    {/* Título */}
    <h2 className="text-2xl font-semibold text-gray-800">👥 Nuestros Clientes</h2>

    {/* Buscador */}
    <div className="flex items-center w-full md:w-1/2 bg-gray-100 rounded-lg px-3 py-1 border border-gray-300 focus-within:ring-2 ring-blue-400">
        <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103 10.5a7.5 7.5 0 0013.15 6.15z" />
        </svg>
        <input
            type="text"
            placeholder="Buscar cliente..."
            value={search}
            onChange={handleSearchChange}
            className="bg-transparent w-full px-3 py-2 focus:outline-none text-gray-700"
        />
    </div>

    {/* Botón crear */}
    <button
        onClick={crearCliente}
        className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
    >
        ➕ Crear Cliente
    </button>
</div>


            <div className="w-full overflow-x-auto">
                <table className="w-full bg-gray-50 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                        <tr className="text-left">
                            <th className="p-2">Nombres</th>
                            <th className="p-2">Correo</th>
                            <th className="p-2">Telefono</th>
                            <th className="p-2">Estado</th>
                            <th className="p-2">Acciones</th>
                            {/* <th className="p-2">Detalle</th> */}
                            <th className="p-2">Modificar</th>
                            <th className="p-2">Desactivar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map((cliente, index) => (
                            <tr key={cliente.cli_id} className="shadow-amber-50">
                                <td className="p-2 whitespace-nowrap">{cliente.cli_nombre} {cliente.cli_apellido}</td>
                                <td className="p-2 whitespace-nowrap">{cliente.cli_email}</td>
                                {/* <td className="p-2 whitespace-nowrap">{cliente.cli_identificacion}</td> */}
                                <td className="p-2 whitespace-nowrap">{cliente.cli_celular}</td>
                                {/* Mostrar el estado como texto */}
                                <td className="p-2 whitespace-nowrap">
                                    {cliente.activo ? (
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

                                <td className="p-2 whitespace-nowrap">
                                    <button
                                        // onClick={() => handleVerEmpresa(empresa.emp_id)}
                                        className="bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600">
                                        🔎 Ver
                                    </button>
                                </td>

                                <td className="p-2 whitespace-nowrap">
                                    <button
                                        onClick={() => updatedCliente(cliente.cli_id)}
                                        className="bg-orange-500 px-3 py-1 rounded-md hover:bg-orange-600">
                                        📝 Modificar
                                    </button>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                    <button
                                        onClick={() => handleDelete(cliente.cli_id)}
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

export default ClientesList;