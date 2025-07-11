import { apiFetch } from "../../api"

export const getExamenesPorConsulta = async (consultaId:number) => {
    try {
        const data = await apiFetch(`examenes/por-consulta/${consultaId}`,{
            method:"GET"
        })
        console.log("examenes recibidos", data);
        return data;
    } catch (error) {
        console.error("error al obtener tratamiento", error);
        throw error;
    }
}

export const subirExamen = async (formData: FormData) => {
    return await apiFetch("examenes/subir", {
    method: "POST",
    body: formData,
  });
};
