import React, { useEffect, useState } from "react";
import { getUsers } from "../../services/users/users";

const UserList = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await getUsers(1, 50); // Página 1, 2 usuarios por página
                
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
    }, []);

    return (
        <div>
            <h2>Lista de Usuarios</h2>

            {loading ? (
                <p>Cargando usuarios...</p>
            ) : users.length > 0 ? (
                <ul>
                    {users.map((user) => (
                        <li key={user.usua_id}>
                            <strong>{user.usua_nombre}</strong> - {user.usua_ruc}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay usuarios disponibles.</p>
            )}
        </div>
    );
};

export default UserList;
