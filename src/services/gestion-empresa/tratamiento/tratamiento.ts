import { CrearTratamientoDto } from "../../../types/tratamiento/tratamiento";
import { apiFetch } from "../../api";

export const creartratamiento = async (tratamientoData: CrearTratamientoDto) => {
    try {
        const data = await apiFetch(`tratamiento/crear`, {
            method: "POST",
            body: JSON.stringify(tratamientoData),
        });
        console.log("tratamiento creado", data);
        return data;
    } catch (error) {
        console.error("error al crear tratamiento:", error)
        return null;
    }
};