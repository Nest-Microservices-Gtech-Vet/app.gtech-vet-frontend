import { Empresa } from "../../types/empresa/empresa";
import { apiFetch } from "../api";

//Empieza obtener empresas //
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
//Termina obtener empresas //
//Empieza Crear empresas //
export const createEmpresa = async(empresaData:{
    emp_nombre: string;
    emp_correo: string;
    emp_direccion: string;
    emp_telefono: string;
    emp_ruc: string;
    usua_admin_id:number;
    activo:boolean;
    
}) => {
    try {
        const data = await apiFetch("empresas",{
            method: "POST",
            body: JSON.stringify(empresaData),
        });
        console.log("empresa creado",data);
        return data;
    } catch (error) {
        console.error("error al crear empresa:", error)
        return null;
        
    }
};
//Fin Crear empresas//