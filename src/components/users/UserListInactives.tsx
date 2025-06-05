import React, { useEffect, useState } from "react";
import { deleteUser, getUsers, getUsersInactives, updateUser } from "../../services/users/users";
import { useNavigate } from "react-router-dom";
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


const UserListInactives = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 500);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await getUsersInactives(1, 50,debouncedSearch); // Página 1, 2 usuarios por página

                console.log("Usuarios obtenidos:", response); // Ver la estructura

                if (response && Array.isArray(response.data)) {
                    setUsers(response.data); // Corregido: Usamos response.data
                } else {
                    console.error("La respuesta del backend no es un array:", response);
                }
            } catch (error) {
                console.error("Error al obtener usuarios:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [debouncedSearch]);

    const updatedUser = (userId: string) => {
        navigate(`/user-edit/${userId}`);
    }

    const handleDelete = async (userId: string) => {
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
            const deleteResult = await deleteUser(userId);
            if (deleteResult) {
                Swal.fire("Registro Eliminado!", "El usuario ha sido Eliminado.", "success");
                setUsers((prevUsers) => prevUsers.filter((user) => user.usua_id !== userId));
            } else {
                Swal.fire("Error", "No se pudo desactivar el usuario.", "error");
            }
        }
    };

    return (
        <div className="max-w-full flex flex-col items-center bg-gray-900 text-white p-15">


            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                <h1 className="text-2xl font-bold mb-4">USUARIOS INACTIVOS DEL SISTEMA</h1>
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

                            <th className="p-2">Ruc</th>
                            <th className="p-2">Nombre</th>
                            <th className="p-2">Apellido</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Celular</th>
                            <th className="p-2">Direccion</th>
                            <th className="p-2">Rol</th>
                            <th className="p-2">Estado</th>
                            <th className="p-2">Update</th>

                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.usua_id} className="border-b border-gray-700">

                                <td className="p-2 whitespace-nowrap">{user.usua_ruc}</td>
                                <td className="p-2 whitespace-nowrap">{user.usua_nombre}</td>
                                <td className="p-2 whitespace-nowrap">{user.usua_apellido}</td>
                                <td className="p-2 whitespace-nowrap">{user.usua_email}</td>
                                <td className="p-2 whitespace-nowrap">{user.usua_celular}</td>
                                <td className="p-2 ">{user.usua_direccion}</td>
                                <td className="p-2 whitespace-nowrap">{user.usua_rol}</td>
                                {/* Mostrar el estado como texto */}
                                <td className="p-2 whitespace-nowrap">
                                    {user.activo ? (
                                        <span className="text-green-500">Activo</span>
                                    ) : (
                                        <span className="text-red-500">Inactivo</span>
                                    )}
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                    <button onClick={() => updatedUser(user.usua_id)} className="bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600">
                                        📝 Modificar
                                    </button>
                                </td>
                                <td className="p-2 whitespace-nowrap">

                                </td>

                                {/* Botones de Update y Delete */}
                                {/* <td className="p-2 whitespace-nowrap">
              <button className="bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600">
                Update
              </button>
            </td>
            <td className="p-2 whitespace-nowrap">
              <button
                onClick={() => handleDelete(user.id)}
                className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserListInactives;
