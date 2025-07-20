import { Mascota } from "../../../types/mascotas/mascota";
import { apiFetch } from "../../api";

//empieza obtener  mascotas
export const getMascotas = async (empresaId: number): Promise<Mascota[]> => {
    try {
        const data = await apiFetch(`mascotas?empresa_id=${empresaId}`);
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
// services/mascotas/mascotas.ts
export async function updateMascota(mascotaId: number, formData: FormData) {
    const response = await apiFetch(`mascotas/${mascotaId}`, {
        method: 'PATCH',
        body: formData,
    });

    return response; // ya está parseado, no necesitas hacer `.json()`
}



//termina editar mascotas por id
//***************************************************************** */
//empieza crear  mascotas
// export const crearMascota = async (mascotaData: {
//     mas_nombre: string;
//     mas_fechaNac: string;
//     mas_peso: number;
//     mas_color: string;
//     mas_esterilizado: boolean;
//     mas_microchip: string;
//     mas_foto: string;
//     mas_notas: string;
//     especie_id: number;
//     raza_id: number;
//     cliente_id: number;
//     empresa_id: number;
//     activo: boolean;
// }) => {
//     try {
//         const data = await apiFetch(`mascotas`, {
//             method: "POST",
//             body: JSON.stringify(mascotaData),
//         });
//         console.log("Mascota creada", data);
//         return data;
//     } catch (error) {
//         console.error("error al crear Mascota:", error)
//         return null;
//     }
// };
export const crearMascota = async (formData: FormData): Promise<any> => {
    return await apiFetch("mascotas", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: formData,
    });
};



//termina crear mascotas
//***************************************************************** */
//empieza borrado logico de  mascotas
export const removeMascota = async (mascotaId: string) => {
    try {
        const data = await apiFetch(`mascotas/${mascotaId}`, {
            method: "DELETE",
        });
        console.log("Mascota desacitivada", data);
        return data;
    } catch (error) {
        console.error("Error al desactivar Mascota:", error);
        return null;
    }
};
//termina borrado logico de mascotas
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
