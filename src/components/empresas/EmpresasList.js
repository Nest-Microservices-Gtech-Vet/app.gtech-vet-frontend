import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteEmpresa, getEmpresas } from "../../services/empresas/empresas";
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
const EmpresasList = () => {
    const [empresas, setempresas] = useState([]);
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
                }
                else {
                    console.error("La respuesta del backend no es un array:", response);
                }
            }
            catch (error) {
                console.error("Error al obtener Empresas:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchEmpresas();
    }, [debouncedSearch]);
    const updatedEmpresa = (empresaId) => {
        navigate(`/empresa-edit/${empresaId}`);
    };
    const handleVerEmpresa = (empresaId) => {
        navigate(`/empresa/detalle/${empresaId}`);
    };
    const handleEmpresaUsuario = (empresaId) => {
        navigate(`/empresas/${empresaId}`);
    };
    const handleDelete = async (empresaId) => {
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
            }
            else {
                Swal.fire("Error", "No se pudo desactivar el usuario.", "error");
            }
        }
    };
    return (_jsxs("div", { className: "max-w-full flex flex-col items-center bg-gray-900 text-white p-15", children: [_jsxs("div", { className: "w-full flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4", children: [_jsx("h1", { className: "text-2xl font-bold mb-4", children: "EMPRESAS DEL SISTEMA" }), _jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Buscar por RUC o nombre", className: "mb-1 p-2 border rounded w-80 text-white" })] }), _jsx("div", { className: "w-full overflow-x-auto", children: _jsxs("table", { className: "w-full bg-gray-800 rounded-lg overflow-hidden", children: [_jsx("thead", { className: "bg-gray-700", children: _jsxs("tr", { className: "text-left", children: [_jsx("th", { className: "p-2", children: "Nombre" }), _jsx("th", { className: "p-2", children: "Tipo" }), _jsx("th", { className: "p-2", children: "Correo" }), _jsx("th", { className: "p-2", children: "Telefono" }), _jsx("th", { className: "p-2", children: "Estado" }), _jsx("th", { className: "p-2", children: "Acciones" }), _jsx("th", { className: "p-2", children: "Detalle" }), _jsx("th", { className: "p-2", children: "Modificar" }), _jsx("th", { className: "p-2", children: "Desactivar" })] }) }), _jsx("tbody", { children: empresas.map((empresa, index) => (_jsxs("tr", { className: "border-b border-gray-700", children: [_jsx("td", { className: "p-2 whitespace-nowrap", children: empresa.emp_nombre }), _jsx("td", { className: "p-2 whitespace-nowrap", children: empresa.emp_tipo_empresa }), _jsx("td", { className: "p-2 whitespace-nowrap", children: empresa.emp_correo }), _jsx("td", { className: "p-2 whitespace-nowrap", children: empresa.emp_telefono }), _jsx("td", { className: "p-2 whitespace-nowrap", children: empresa.activo ? (_jsx("span", { className: "text-green-500", children: "Activo" })) : (_jsx("span", { className: "text-red-500", children: "Inactivo" })) }), _jsx("td", { className: "p-2 whitespace-nowrap", children: _jsx("button", { onClick: () => handleEmpresaUsuario(empresa.emp_id), className: "bg-green-500 px-3 py-1 rounded-md hover:bg-green-600", children: "\uD83D\uDD0E Asignar Usuarios" }) }), _jsx("td", { className: "p-2 whitespace-nowrap", children: _jsx("button", { onClick: () => handleVerEmpresa(empresa.emp_id), className: "bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600", children: "\uD83D\uDD0E Ver" }) }), _jsx("td", { className: "p-2 whitespace-nowrap", children: _jsx("button", { onClick: () => updatedEmpresa(empresa.emp_id), className: "bg-orange-500 px-3 py-1 rounded-md hover:bg-orange-600", children: "\uD83D\uDCDD Modificar" }) }), _jsx("td", { className: "p-2 whitespace-nowrap", children: _jsx("button", { onClick: () => handleDelete(empresa.emp_id), className: "bg-red-500 px-3 py-1 rounded-md hover:bg-red-600", children: "\uD83D\uDEAB Desactivar" }) })] }, empresa.emp_id))) })] }) })] }));
};
export default EmpresasList;
