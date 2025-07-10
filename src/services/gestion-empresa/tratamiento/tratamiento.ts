import { CrearTratamientoDto, TratamientoResponse } from "../../../types/tratamiento/tratamiento";
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

export const tratamientoByConsultaId = async (consultaId: number): Promise<TratamientoResponse[]> => {
    try {
        const data = await apiFetch(`tratamiento/por-consulta/${consultaId}`, {
            method: "GET"
        });
        console.log("Tratamiento recibido:", data);
        return data;
    } catch (error) {
        console.error("Error al obtener tratamiento:", error);
        throw error;
    }
};
