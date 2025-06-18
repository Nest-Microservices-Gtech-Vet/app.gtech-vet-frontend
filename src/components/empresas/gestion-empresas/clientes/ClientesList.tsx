import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { getClientes, getClientesPorEmpresa, removeCliente } from "../../../../services/gestion-empresa/clientes/clientes";
import { div } from "framer-motion/client";
import Swal from "sweetalert2";

const ClientesList = () => {
    const [clientes, setClientes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    // 
    useEffect(() => {
        const fetchClientes = async () => {
            setLoading(true);
            try {
                const empresaId = Number(id);
                const data = await getClientesPorEmpresa(empresaId);
                if (Array.isArray(data)) {
                    setClientes(data);
                } else {
                    console.error("La respuesta no es un array:", data);
                }
            } catch (error) {
                console.error("Error al obtener clientes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClientes();
    }, [id]);

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
            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                <h2 className="text-black text-2xl font-bold mb-4">NUESTROS CLIENTES</h2>
                <button className="bg-green-500 px-3 py-1 rounded-md hover:bg-green-600"
                    onClick={crearCliente}>
                    ➕ Crear Clientes
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