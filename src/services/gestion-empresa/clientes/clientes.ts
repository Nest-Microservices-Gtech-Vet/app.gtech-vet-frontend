import { Cliente } from "../../../types/clientes/cliente";
import { apiFetch } from "../../api";

//empieza obtener clientes
export const getClientes = async (empresaId: number): Promise<{ data: Cliente[] }> => {
    try {
        const data = await apiFetch(`clientes?empresa_id=${empresaId}`);
        console.log("clientes obtenidos", data)
        return { data };
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        return { data: [] };
    }
}
//termina obtener clientes
//***************************************************************** */
//empieza crear clientes
export const createCliente = async (clienteData: {
    cli_identificacion: string;
    cli_nombre: string;
    cli_apellido: string;
    cli_email: string;
    cli_celular: string;
    cli_direccion: string;
    cli_observaciones: string;
    activo: boolean;
    empresa_id: number;
}) => {
    try {
        const data = await apiFetch('clientes', {
            method: "POST",
            body: JSON.stringify(clienteData),
        });
        console.log("Cliente creado", data);
        return data;
    } catch (error) {
        console.error("error al crear Cliente:", error)
        return null;
    }
};
//termina crear clientes
//***************************************************************** */
// ✅ Obtener todos los clientes por empresa
// 
export const getClientesPorEmpresa = async (
    empresaId: number,
    search: string = ""
): Promise<Cliente[]> => {
    try {
        const queryParams = new URLSearchParams();
        if (search.trim()) queryParams.append("search", search);
        queryParams.append("empresa_id", empresaId.toString());

        const data = await apiFetch(`clientes/por-empresa/${empresaId}?${queryParams.toString()}`);
        return data;
    } catch (error) {
        console.error("Error al obtener clientes por empresa:", error);
        return [];
    }
};
//finObtener todos los clientes por empresa
//************************************************************************************* */
//empieza obtener clientes por id
export const getClienteById = async (clienteId: string): Promise<Cliente> => {
    try {
        const data = await apiFetch(`clientes/${clienteId}`, {
            method: "GET"
        });
        console.log("cliente obtenido", data)
        return data;
    } catch (error) {
        console.error("error al obtener usuario", error);
        throw error;
    }
}
//termina obtener clientes por id
//***************************************************************** */
//empieza editar clientes por id
export const updateCliente = async (clienteId: string, clienteData: {
    cli_identificacion: string;
    cli_nombre: string;
    cli_apellido: string;
    cli_email: string;
    cli_celular: string;
    cli_direccion: string;
    cli_observaciones: string;
    activo: boolean;
    empresa_id: number;
}) => {
    try {
        const data = await apiFetch(`clientes/${clienteId}`, {
            method: "PATCH",
            body: JSON.stringify(clienteData),
        });
        console.log("cliente actualizado:", data);
        return data;
    } catch (error) {
        console.error("Error al actualizar cliente:", error);
        return null;
    }
}
//termina editar clientes por id
//***************************************************************** */
//empieza borrado logico clientes
export const removeCliente = async (clienteId: string) => {
    try {
        const data = await apiFetch(`clientes/${clienteId}`, {
            method: "DELETE",
        });
        console.log("Cliente desactivado:", data);
        return data;
    } catch (error) {
        console.error("Error al desactivar Cliente:", error);
        return null;
    }
}
//termina borrado logico clientes
//***************************************************************** */
//validar obtener clientes
export const validarIdentificacion = async (identificacion: string): Promise<boolean> => {
  try {
    const data = await apiFetch(`clientes/validar-identificacion/${identificacion}`, {
      method: "GET",
    });
    return data.exists; // backend devuelve { exists: true/false }
  } catch (error) {
    console.error("Error validando identificación:", error);
    return false;
  }
};

//validar obtener clientes
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