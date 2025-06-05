import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteEmpresa, getEmpresas } from "../../services/empresas/empresas";
import { Canton } from "../../types/empresa/canton";
import { getCantones, getProvincias, getTiposEmpresa } from "../../services/empresas/catalogosEmpresa";

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

const EmpresasList = () => {
    const [empresas, setempresas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 500);
    const navigate = useNavigate();




    useEffect(() => {
        const fetchEmpresas = async () => {
            setLoading(true);

            try {
                const response = await getEmpresas(1, 50, debouncedSearch); // Página 1, 2 usuarios por página

                console.log("Empresas obtenidos:", response); // Ver la estructura

                if (response && Array.isArray(response.data)) {
                    setempresas(response.data); // Corregido: Usamos response.data
                } else {
                    console.error("La respuesta del backend no es un array:", response);
                }
            } catch (error) {
                console.error("Error al obtener Empresas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmpresas();
    }, [debouncedSearch]);

    

    const updatedEmpresa = (empresaId: string) => {
        navigate(`/empresa-edit/${empresaId}`);
    }

    const handleVerEmpresa = (empresaId: string) => {
        navigate(`/empresa/detalle/${empresaId}`);
    };

    const handleEmpresaUsuario = (empresaId: string) => {
        navigate(`/empresas/${empresaId}`);
    };


    const handleDelete = async (empresaId: string) => {
        const result = await Swal.fire({
            title: "¿Estás seguro de eliminar este registro?",
            text: "¡No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, Eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            const deleteResult = await deleteEmpresa(empresaId);
            if (deleteResult) {
                Swal.fire("Registro Eliminado!", "El usuario ha sido Eliminado.", "success");
                setempresas((prevEmpresas) => prevEmpresas.filter((empresa) => empresa.emp_id !== empresaId));
            } else {
                Swal.fire("Error", "No se pudo desactivar el usuario.", "error");
            }
        }
    };

    return (
        <div className="max-w-full flex flex-col items-center bg-gray-900 text-white p-15">


            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                <h1 className="text-2xl font-bold mb-4">EMPRESAS DEL SISTEMA</h1>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por RUC o nombre"
                    className="mb-1 p-2 border rounded w-80 text-white"
                />
            </div>

            {/* Contenedor para hacer la tabla responsive */}
            <div className="w-full overflow-x-auto">
                <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
                    <thead className="bg-gray-700">
                        <tr className="text-left">
                            <th className="p-2">Nombre</th>
                            <th className="p-2">Tipo</th>
                            <th className="p-2">Correo</th>
                            <th className="p-2">Telefono</th>
                            <th className="p-2">Estado</th>
                            <th className="p-2">Acciones</th>
                            <th className="p-2">Detalle</th>
                            <th className="p-2">Modificar</th>
                            <th className="p-2">Desactivar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {empresas.map((empresa, index) => (
                            <tr key={empresa.emp_id} className="border-b border-gray-700">
                                <td className="p-2 whitespace-nowrap">{empresa.emp_nombre}</td>
                                <td className="p-2 whitespace-nowrap">{empresa.emp_tipo_empresa}</td>
                                <td className="p-2 whitespace-nowrap">{empresa.emp_correo}</td>
                                <td className="p-2 whitespace-nowrap">{empresa.emp_telefono}</td>
                                {/* Mostrar el estado como texto */}
                                <td className="p-2 whitespace-nowrap">
                                    {empresa.activo ? (
                                        <span className="text-green-500">Activo</span>
                                    ) : (
                                        <span className="text-red-500">Inactivo</span>
                                    )}
                                </td>
                                 <td className="p-2 whitespace-nowrap">
                                    <button onClick={() => handleEmpresaUsuario(empresa.emp_id)}  className="bg-green-500 px-3 py-1 rounded-md hover:bg-green-600">
                                        🔎 Asignar Usuarios
                                    </button>
                                </td>

                                <td className="p-2 whitespace-nowrap">
                                    <button onClick={() => handleVerEmpresa(empresa.emp_id)} className="bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600">
                                        🔎 Ver
                                    </button>
                                </td>

                                <td className="p-2 whitespace-nowrap">
                                    <button onClick={() => updatedEmpresa(empresa.emp_id)} className="bg-orange-500 px-3 py-1 rounded-md hover:bg-orange-600">
                                        📝 Modificar
                                    </button>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                    <button
                                        onClick={() => handleDelete(empresa.emp_id)}
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

export default EmpresasList;
