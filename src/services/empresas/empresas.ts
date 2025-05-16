import { Empresa } from "../../types/empresa/empresa";
import { apiFetch } from "../api";

//Empieza obtener empresas //
export const getEmpresas = async (page: number = 1, limit: number = 50): Promise<{ data: Empresa[] }> => {
    try {
        const data = await apiFetch(`empresas`);
        console.log("empresas obtenidos:", data);
        return data;
    } catch (error) {
        console.error("Error al obtener empresas:", error);
        return { data: [] };
    }
};
//Termina obtener empresas //
//Empieza Crear empresas //
export const createEmpresa = async (empresaData: {
    emp_nombre: string;
    emp_correo: string;
    emp_direccion: string;
    emp_telefono: string;
    emp_ruc: string;
    usua_admin_id: number;
    provincia_id: number
    canton_id: number
    tipo_empresa_id: number;
    activo: boolean;

}) => {
    try {
        const data = await apiFetch("empresas", {
            method: "POST",
            body: JSON.stringify(empresaData),
        });
        console.log("empresa creado", data);
        return data;
    } catch (error) {
        console.error("error al crear empresa:", error)
        return null;

    }
};
//Fin Crear empresas//
//************************************************************************ */
//inicio empresa de ususario

export const getEmpresasPorUsuario = async (id: number) => {
    return await apiFetch(`empresas/mis-empresas/${id}`);
};
//

//Empieza obtener empresas por id//
export const getEmpresaById = async (empresaId: string): Promise<Empresa> => {
    try {
        const data = await apiFetch(`empresas/${empresaId}`, {
            method: "GET",
        });
        console.log("Usuario obtenido:", data); // Verifica la estructura de la respuesta
        return data;
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        throw error; // Propaga el error para manejarlo en el componente
    }
};
//Finaliza obtener empresas por id//

//Empieza Editar Usuario por id//
export const updateEmpresa = async (empresaId: string, empresaData: {
    emp_nombre: string;
    emp_correo: string;
    emp_direccion: string;
    emp_telefono: string;
    emp_ruc: string;
    usua_admin_id: number;
    provincia_id: number
    canton_id: number
    tipo_empresa_id: number;
    activo: boolean;
}) => {
    try {
        const data = await apiFetch(`empresas/${empresaId}`, {
            method: "PATCH",
            body: JSON.stringify(empresaData),
        });
        console.log("empresa actualizado:", data);
        return data;
    } catch (error) {
        console.error("Error al actualizar empresa:", error);
        return null;
    }
}
//Finaliza Editar Usuario por id//