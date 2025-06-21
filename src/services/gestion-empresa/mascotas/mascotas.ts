import { Mascota } from "../../../types/mascotas/mascota";
import { apiFetch } from "../../api";

//empieza obtener  mascotas
export const getMascotas = async (): Promise<Mascota[]> => {
    try {
        const data = await apiFetch(`mascotas`);
        // console.log("Mascotas obtenidos", data)
        return data;
    } catch (error) {
        console.error("Error al obtener Mascotas:", error);
        return [];
    }
}
//termina obtener mascotas
//***************************************************************** */
//empieza obtener  mascotas por id
export const getMascotaById = async (mascotaId: string): Promise<Mascota> => {
    try {
        const data = await apiFetch(`mascotas/${mascotaId}`, {
            method: "GET"
        });
        console.log("mascota obtenida", data);
        return data;
    } catch (error) {
        console.error("error al obtener mascota", error);
        throw error;
    }
}
//termina obtener mascotas por id
//***************************************************************** */
//empieza editar  mascotas por id
export const updateMascota = async (mascotaId: string, mascotaData: {
    mas_nombre: string;
    mas_fechaNac: string;
    mas_peso: number;
    mas_color: string;
    mas_esterilizado: boolean;
    mas_microchip: string;
    mas_foto: string;
    mas_notas: string;
    especie_id: number;
    raza_id: number;
    cliente_id: number;
    empresa_id: number;
    activo: boolean;
}) => { 
    try {
        const data = await apiFetch(`mascotas/${mascotaId}`, {
            method: "PATCH",
            body: JSON.stringify(mascotaData),
        });
        console.log("mascota actualizado:", data);
        return data;
    } catch (error) {
        console.error("Error al actualizar mascota:", error);
        return null;
    }
};
//termina editar mascotas por id
//***************************************************************** */
//empieza crear  mascotas
export const crearMascota = async (mascotaData: {
    mas_nombre: string;
    mas_fechaNac: string;
    mas_peso: number;
    mas_color: string;
    mas_esterilizado: boolean;
    mas_microchip: string;
    mas_foto: string;
    mas_notas: string;
    especie_id: number;
    raza_id: number;
    cliente_id: number;
    empresa_id: number;
    activo: boolean;
}) => {
    try {
        const data = await apiFetch(`mascotas`, {
            method: "POST",
            body: JSON.stringify(mascotaData),
        });
        console.log("Mascota creada", data);
        return data;
    } catch (error) {
        console.error("error al crear Mascota:", error)
        return null;
    }
};
//termina crear mascotas
//***************************************************************** */
//empieza obtener  mascotas
//termina obtener mascotas
//***************************************************************** */
//empieza obtener  mascotas
//termina obtener mascotas
//***************************************************************** */
//empieza obtener  mascotas
//termina obtener mascotas
//***************************************************************** */
//empieza obtener  mascotas
//termina obtener mascotas
//***************************************************************** */
