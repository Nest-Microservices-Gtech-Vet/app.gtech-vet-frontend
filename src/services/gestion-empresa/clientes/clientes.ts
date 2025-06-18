import { Cliente } from "../../../types/clientes/cliente";
import { apiFetch } from "../../api";

//empieza obtener clientes
export const getClientes = async (): Promise<{ data: Cliente[] }> => {
    try {
        const data = await apiFetch(`clientes`);
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
//empieza obtener clientes
//termina obtener clientes
//***************************************************************** */
//empieza obtener clientes
//termina obtener clientes
//***************************************************************** */