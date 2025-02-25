import { apiFetch } from "../api";

export const getUsers = async (page: number = 1, limit: number = 50) => {
    try {
        const data = await apiFetch(`users?page=${page}&limit=${limit}`);
        console.log("Usuarios obtenidos:", data);
        return data;
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return null;
    }
};
//Empieza Crear Usuarios */
export const createUser = async(userData:{
    usua_ruc: string;
    usua_nombre: string;
    usua_apellido: string;
    usua_email: string;
    usua_celular: string;
    usua_direccion: string;
    usua_contrasenia:string;
    usua_rol: string;
    activo:boolean;
    
}) => {
    try {
        const data = await apiFetch("users",{
            method: "POST",
            body: JSON.stringify(userData),
        });
        console.log("Usuario creado",data);
        return data;
    } catch (error) {
        console.error("error al crear ususario:", error)
        return null;
        
    }
};