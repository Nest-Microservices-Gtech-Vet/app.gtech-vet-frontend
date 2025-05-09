import { Empresa } from "../../types/empresa/empresa";
import { apiFetch } from "../api";

//Empieza obtener Usuarios //
export const getEmpresas = async (page: number = 1, limit: number = 50) : Promise<{ data: Empresa[] }> => {
    try {
        const data = await apiFetch(`empresas`);
        console.log("empresas obtenidos:", data);
        return data;
    } catch (error) {
        console.error("Error al obtener empresas:", error);
        return { data: [] }; 
    }
};
//Termina obtener Usuarios //