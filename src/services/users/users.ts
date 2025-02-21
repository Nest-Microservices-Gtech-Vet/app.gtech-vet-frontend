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
