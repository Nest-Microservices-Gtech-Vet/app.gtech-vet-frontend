import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { deleteUser, getUsersInactives } from "../../services/users/users";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const useDebounce = (value, delay = 500) => {
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
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 500);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await getUsersInactives(1, 50, debouncedSearch); // Página 1, 2 usuarios por página
                console.log("Usuarios obtenidos:", response); // Ver la estructura
                if (response && Array.isArray(response.data)) {
                    setUsers(response.data); // Corregido: Usamos response.data
                }
                else {
                    console.error("La respuesta del backend no es un array:", response);
                }
            }
            catch (error) {
                console.error("Error al obtener usuarios:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [debouncedSearch]);
    const updatedUser = (userId) => {
        navigate(`/user-edit/${userId}`);
    };
    const handleDelete = async (userId) => {
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
            }
            else {
                Swal.fire("Error", "No se pudo desactivar el usuario.", "error");
            }
        }
    };
    return (_jsxs("div", { className: "max-w-full flex flex-col items-center bg-gray-900 text-white p-15", children: [_jsxs("div", { className: "w-full flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4", children: [_jsx("h1", { className: "text-2xl font-bold mb-4", children: "USUARIOS INACTIVOS DEL SISTEMA" }), _jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Buscar por RUC o nombre", className: "mb-1 p-2 border rounded w-80 text-white" })] }), _jsx("div", { className: "w-full overflow-x-auto", children: _jsxs("table", { className: "w-full bg-gray-800 rounded-lg overflow-hidden", children: [_jsx("thead", { className: "bg-gray-700", children: _jsxs("tr", { className: "text-left", children: [_jsx("th", { className: "p-2", children: "Ruc" }), _jsx("th", { className: "p-2", children: "Nombre" }), _jsx("th", { className: "p-2", children: "Apellido" }), _jsx("th", { className: "p-2", children: "Email" }), _jsx("th", { className: "p-2", children: "Celular" }), _jsx("th", { className: "p-2", children: "Direccion" }), _jsx("th", { className: "p-2", children: "Rol" }), _jsx("th", { className: "p-2", children: "Estado" }), _jsx("th", { className: "p-2", children: "Update" })] }) }), _jsx("tbody", { children: users.map((user) => (_jsxs("tr", { className: "border-b border-gray-700", children: [_jsx("td", { className: "p-2 whitespace-nowrap", children: user.usua_ruc }), _jsx("td", { className: "p-2 whitespace-nowrap", children: user.usua_nombre }), _jsx("td", { className: "p-2 whitespace-nowrap", children: user.usua_apellido }), _jsx("td", { className: "p-2 whitespace-nowrap", children: user.usua_email }), _jsx("td", { className: "p-2 whitespace-nowrap", children: user.usua_celular }), _jsx("td", { className: "p-2 ", children: user.usua_direccion }), _jsx("td", { className: "p-2 whitespace-nowrap", children: user.usua_rol }), _jsx("td", { className: "p-2 whitespace-nowrap", children: user.activo ? (_jsx("span", { className: "text-green-500", children: "Activo" })) : (_jsx("span", { className: "text-red-500", children: "Inactivo" })) }), _jsx("td", { className: "p-2 whitespace-nowrap", children: _jsx("button", { onClick: () => updatedUser(user.usua_id), className: "bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600", children: "\uD83D\uDCDD Modificar" }) }), _jsx("td", { className: "p-2 whitespace-nowrap" })] }, user.usua_id))) })] }) })] }));
};
export default UserListInactives;
