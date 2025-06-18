import { Cliente } from "../../../types/clientes/cliente";
import { apiFetch } from "../../api";

//empieza obtener clientes
export const getClientes = async(): Promise<{ data: Cliente[]}> =>{
    try {
        const data = await apiFetch(`clientes`);
        console.log("clientes obtenidos", data)
        return {data};
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        return { data: [] };
    }
}
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
//empieza obtener clientes
//termina obtener clientes
//***************************************************************** */
//empieza obtener clientes
//termina obtener clientes
//***************************************************************** */