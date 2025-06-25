import { historiaClinica } from "../../../types/historia-clinica/historia-clinica";
import { apiFetch } from "../../api";

export const getHistoriaClinicaByMascotaId = async (mascotaId: string): Promise<historiaClinica|null> => {
  try {
    const data = await apiFetch(`historia-clinica/mascota/${mascotaId}`, {
      method: "GET"
    });
    console.log("historia clinica obtenida", data);
    return data;
  } catch (error) {
    console.error("Error al obtener historia clínica", error);
    return null;
  }
};