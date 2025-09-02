import { apiFetch } from "../../api";
export const getHistoriaClinicaByMascotaId = async (mascotaId) => {
    try {
        const data = await apiFetch(`historia-clinica/mascota/${mascotaId}`, {
            method: "GET"
        });
        console.log("historia clinica obtenida", data);
        return data;
    }
    catch (error) {
        console.error("Error al obtener historia clínica", error);
        return null;
    }
};
