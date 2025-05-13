import { apiFetch } from "../api";


// Obtener todas las provincias
export const getProvincias = () => apiFetch("provincias");

// Obtener todas las Cantones
export const getCantones = () => apiFetch("cantones");

// Obtener cantones por provincia
//export const getCantonesPorProvincia = (provinciaId: number) => apiFetch(`provincias/${provinciaId}/cantones`);

// Obtener todos los tipos de empresa
export const getTiposEmpresa = () => apiFetch("tipos-empresas");
