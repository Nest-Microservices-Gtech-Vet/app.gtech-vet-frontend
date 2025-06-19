import { apiFetch } from "../../api";

// obtener especie
export const getEspecies = () => apiFetch("especies") 
//obteener raza
export const getRazas = () => apiFetch(`razas`) 
// obtener patologias
export const getPatologias = () => apiFetch("patologias") 
//  obtener especie raza patologia
