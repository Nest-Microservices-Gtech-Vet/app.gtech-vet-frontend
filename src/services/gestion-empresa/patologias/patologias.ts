import { EspecieRazaPatologia, Patologia } from "../../../types/patologias/patologias";
import { apiFetch } from "../../api";

// services/patologias.ts
export const getPatologiasByEspecieRaza = async (
    especieId: number,
    razaId: number
): Promise<Patologia[]> => {
    const res: EspecieRazaPatologia[] = await apiFetch(
        `especie-raza-patologia/especie_raza?especie_id=${especieId}&raza_id=${razaId}`
    );

    const patologias: Patologia[] = res.map((item) => item.patologia);
    return patologias;
};


export const getPatologiaById = async (patId: number): Promise<Patologia> => {
    try {
        const data = await apiFetch(`patologias/${patId}`, {
            method: "GET"
        });
        console.log("patologia obtenida", data);
        return data;
    } catch (error) {
        console.error("error al obtener patologia", error);
        throw error;
    }
}