import { User } from "../../types/users/user";
import { apiFetch } from "../api";

//Empieza obtener Usuarios //
export const getUsers = async (page: number = 1, limit: number = 50): Promise<{ data: User[] }> => {
    try {
        const data = await apiFetch(`users?page=${page}&limit=${limit}`);
        console.log("Usuarios obtenidos:", data);
        return data;
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return { data: [] };
    }
};
//Termina obtener Usuarios //

//Empieza obtener Usuarios inactivos //
export const getUsersInactives = async (page: number = 1, limit: number = 50): Promise<{ data: User[] }> => {
    try {
        const data = await apiFetch(`users/inactivos?page=${page}&limit=${limit}`);
        console.log("Usuarios obtenidos:", data);
        return data;
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return { data: [] };
    }
};
//Termina obtener Usuarios  inactivos//


//Empieza Crear Usuarios //
export const createUser = async (userData: {
    usua_ruc: string;
    usua_nombre: string;
    usua_apellido: string;
    usua_email: string;
    usua_celular: string;
    usua_direccion: string;
    usua_contrasenia: string;
    usua_rol: string;
    activo: boolean;

}) => {
    try {
        const data = await apiFetch("users", {
            method: "POST",
            body: JSON.stringify(userData),
        });
        console.log("Usuario creado", data);
        return data;
    } catch (error) {
        console.error("error al crear ususario:", error)
        return null;

    }
};
//Fin Crear Usuarios//

//Empieza Editar Usuario por id//
export const updateUser = async (userId: string, userData: {
    usua_ruc?: string;
    usua_nombre?: string;
    usua_apellido?: string;
    usua_email?: string;
    usua_celular?: string;
    usua_direccion?: string;
    usua_contrasenia?: string;
    usua_rol?: string;
    activo?: boolean;
}) => {
    try {
        const data = await apiFetch(`users/${userId}`, {
            method: "PATCH",
            body: JSON.stringify(userData),
        });
        console.log("Usuario actualizado:", data);
        return data;
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        return null;
    }
}
//Finaliza Editar Usuario por id//

//Empieza obtener Usuario por id//
export const getUserById = async (userId: string): Promise<User> => {
    try {
        const data = await apiFetch(`users/${userId}`, {
            method: "GET",
        });
        console.log("Usuario obtenido:", data); // Verifica la estructura de la respuesta
        return data;
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        throw error; // Propaga el error para manejarlo en el componente
    }
};
//Finaliza obtener Usuario por id//

//Empieza borrrado logico por id//
export const deleteUser = async (userId: string) => {
    try {
        const data = await apiFetch(`users/${userId}`, {
            method: "DELETE",
        });
        console.log("Usuario desactivado:", data);
        return data;
    } catch (error) {
        console.error("Error al desactivar usuario:", error);
        return null;
    }
}
//Finaliza borrrado logico por id//




export const getAdmins = async (): Promise<any[]> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/admins`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) throw new Error("Error al obtener usuarios ADMIN");

    return await response.json();
};

//iniciio obtener ususarios admin
export const getUsuariosAdmin = async () => {
  return await apiFetch("users/por-rol?rol=ADMIN&rol=USUARIO"); // debe retornar directamente un array
};
//fin obtener ususarios admin
