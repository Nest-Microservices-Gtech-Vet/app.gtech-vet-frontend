import { Mascota } from "../../../types/mascotas/mascota";
import { apiFetch } from "../../api";

//empieza obtener  mascotas
export const getMascotas= async (): Promise<Mascota[] > => {
    try {
        const data = await apiFetch(`mascotas`);
        // console.log("Mascotas obtenidos", data)
        return data ;
    } catch (error) {
        console.error("Error al obtener Mascotas:", error);
        return  [] ;
    }
}
//termina obtener mascotas
//***************************************************************** */
//empieza obtener  mascotas
//termina obtener mascotas
//***************************************************************** */
