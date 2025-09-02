import { apiFetch } from "../../api";
// services/patologias.ts
export const getPatologiasByEspecieRaza = async (especieId, razaId) => {
    const res = await apiFetch(`especie-raza-patologia/especie_raza?especie_id=${especieId}&raza_id=${razaId}`);
    const patologias = res.map((item) => item.patologia);
    return patologias;
};
export const getPatologiaById = async (patId) => {
    try {
        const data = await apiFetch(`patologias/${patId}`, {
            method: "GET"
        });
        console.log("patologia obtenida", data);
        return data;
    }
    catch (error) {
        console.error("error al obtener patologia", error);
        throw error;
    }
};
