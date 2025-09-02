import { apiFetch } from "../../api";
//empieza obtener clientes
export const getClientes = async (empresaId) => {
    try {
        const data = await apiFetch(`clientes?empresa_id=${empresaId}`);
        console.log("clientes obtenidos", data);
        return { data };
    }
    catch (error) {
        console.error("Error al obtener clientes:", error);
        return { data: [] };
    }
};
//termina obtener clientes
//***************************************************************** */
//empieza crear clientes
export const createCliente = async (clienteData) => {
    try {
        const data = await apiFetch('clientes', {
            method: "POST",
            body: JSON.stringify(clienteData),
        });
        console.log("Cliente creado", data);
        return data;
    }
    catch (error) {
        console.error("error al crear Cliente:", error);
        return null;
    }
};
//termina crear clientes
//***************************************************************** */
// ✅ Obtener todos los clientes por empresa
// 
export const getClientesPorEmpresa = async (empresaId, search = "") => {
    try {
        const queryParams = new URLSearchParams();
        if (search.trim())
            queryParams.append("search", search);
        queryParams.append("empresa_id", empresaId.toString());
        const data = await apiFetch(`clientes/por-empresa/${empresaId}?${queryParams.toString()}`);
        return data;
    }
    catch (error) {
        console.error("Error al obtener clientes por empresa:", error);
        return [];
    }
};
//finObtener todos los clientes por empresa
//************************************************************************************* */
//empieza obtener clientes por id
export const getClienteById = async (clienteId) => {
    try {
        const data = await apiFetch(`clientes/${clienteId}`, {
            method: "GET"
        });
        console.log("cliente obtenido", data);
        return data;
    }
    catch (error) {
        console.error("error al obtener usuario", error);
        throw error;
    }
};
//termina obtener clientes por id
//***************************************************************** */
//empieza editar clientes por id
export const updateCliente = async (clienteId, clienteData) => {
    try {
        const data = await apiFetch(`clientes/${clienteId}`, {
            method: "PATCH",
            body: JSON.stringify(clienteData),
        });
        console.log("cliente actualizado:", data);
        return data;
    }
    catch (error) {
        console.error("Error al actualizar cliente:", error);
        return null;
    }
};
//termina editar clientes por id
//***************************************************************** */
//empieza borrado logico clientes
export const removeCliente = async (clienteId) => {
    try {
        const data = await apiFetch(`clientes/${clienteId}`, {
            method: "DELETE",
        });
        console.log("Cliente desactivado:", data);
        return data;
    }
    catch (error) {
        console.error("Error al desactivar Cliente:", error);
        return null;
    }
};
//termina borrado logico clientes
//***************************************************************** */
//empieza obtener clientes
//termina obtener clientes
//***************************************************************** */
//empieza obtener clientes
//termina obtener clientes
//***************************************************************** */
//empieza obtener clientes
//termina obtener clientes
//***************************************************************** */
//empieza obtener clientes
//termina obtener clientes
//***************************************************************** */
