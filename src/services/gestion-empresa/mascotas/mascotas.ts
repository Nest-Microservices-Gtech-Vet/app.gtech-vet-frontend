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
