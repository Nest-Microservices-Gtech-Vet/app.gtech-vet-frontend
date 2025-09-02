import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClientesPorEmpresa, removeCliente } from "../../../../services/gestion-empresa/clientes/clientes";
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
const ClientesList = () => {
    const [clientes, setClientes] = useState([]);
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
        }
        catch (error) {
            console.error("Error al obtener clientes:", error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchClientes();
    }, [id, debouncedSearch]);
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };
    const handleSearch = () => {
        fetchClientes();
    };
    const crearCliente = () => {
        navigate(`/mis-empresas/${id}/clientes/crear-cliente`);
    };
    const updatedCliente = (clienteId) => {
        navigate(`/mis-empresas/${id}/clientes/editar-cliente/${clienteId}`);
    };
    const handleDelete = async (clienteId) => {
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
            }
            else {
                Swal.fire("Error", "No se pudo desactivar el cliente.", "error");
            }
        }
    };
    return (_jsxs("div", { className: "max-w-full flex flex-col items-center bg-gray-50 text-black p-15", children: [_jsxs("div", { className: "w-full bg-white rounded-lg shadow-sm px-6 py-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [_jsx("h2", { className: "text-2xl font-semibold text-gray-800", children: "\uD83D\uDC65 Nuestros Clientes" }), _jsxs("div", { className: "flex items-center w-full md:w-1/2 bg-gray-100 rounded-lg px-3 py-1 border border-gray-300 focus-within:ring-2 ring-blue-400", children: [_jsx("svg", { className: "w-5 h-5 text-gray-500", fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 21l-4.35-4.35m0 0A7.5 7.5 0 103 10.5a7.5 7.5 0 0013.15 6.15z" }) }), _jsx("input", { type: "text", placeholder: "Buscar cliente...", value: search, onChange: handleSearchChange, className: "bg-transparent w-full px-3 py-2 focus:outline-none text-gray-700" })] }), _jsx("button", { onClick: crearCliente, className: "bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300", children: "\u2795 Crear Cliente" })] }), _jsx("div", { className: "w-full overflow-x-auto", children: _jsxs("table", { className: "w-full bg-gray-50 rounded-lg overflow-hidden", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { className: "text-left", children: [_jsx("th", { className: "p-2", children: "Nombres" }), _jsx("th", { className: "p-2", children: "Correo" }), _jsx("th", { className: "p-2", children: "Telefono" }), _jsx("th", { className: "p-2", children: "Estado" }), _jsx("th", { className: "p-2", children: "Acciones" }), _jsx("th", { className: "p-2", children: "Modificar" }), _jsx("th", { className: "p-2", children: "Desactivar" })] }) }), _jsx("tbody", { children: clientes.map((cliente, index) => (_jsxs("tr", { className: "shadow-amber-50", children: [_jsxs("td", { className: "p-2 whitespace-nowrap", children: [cliente.cli_nombre, " ", cliente.cli_apellido] }), _jsx("td", { className: "p-2 whitespace-nowrap", children: cliente.cli_email }), _jsx("td", { className: "p-2 whitespace-nowrap", children: cliente.cli_celular }), _jsx("td", { className: "p-2 whitespace-nowrap", children: cliente.activo ? (_jsx("span", { className: "text-green-500", children: "Activo" })) : (_jsx("span", { className: "text-red-500", children: "Inactivo" })) }), _jsx("td", { className: "p-2 whitespace-nowrap", children: _jsx("button", { 
                                            // onClick={() => handleVerEmpresa(empresa.emp_id)}
                                            className: "bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600", children: "\uD83D\uDD0E Ver" }) }), _jsx("td", { className: "p-2 whitespace-nowrap", children: _jsx("button", { onClick: () => updatedCliente(cliente.cli_id), className: "bg-orange-500 px-3 py-1 rounded-md hover:bg-orange-600", children: "\uD83D\uDCDD Modificar" }) }), _jsx("td", { className: "p-2 whitespace-nowrap", children: _jsx("button", { onClick: () => handleDelete(cliente.cli_id), className: "bg-red-500 px-3 py-1 rounded-md hover:bg-red-600", children: "\uD83D\uDEAB Desactivar" }) })] }, cliente.cli_id))) })] }) })] }));
};
export default ClientesList;
