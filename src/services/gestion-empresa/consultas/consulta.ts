import { Consulta } from "../../../types/consulta/consulta";
import { apiFetch } from "../../api";

//inicia crear consulta
export const crearConsulta = async (consultaData: Consulta & { patologiasIds: number[] }) => {
    try {
        const dataConsulta = await apiFetch(`consulta`, {
            method: "POST",
            body: JSON.stringify(consultaData),
        });
        console.log("consulta creada", dataConsulta);
        return dataConsulta;
    } catch (error) {
        console.error("error al crear consulta:", error);
        return null;
    }
};
//fin crear consulta
//****************************************************************************** */
//iniicia editar consulta consulta
export const modifyConsulta = async (consultaId: string, consultaData: {
    con_fecha: string;
    con_motivo: string;
    con_sintomas: string;
    con_diagnostico: string;
    con_tratamiento: string;
    con_recomendaciones: string;
    historiaClinica_id: number;
    empresa_id: number;
}) => {
    try {
        const data = await apiFetch(`consulta/mascota/${consultaId}/modificar`, {
            method: "PATCH",
            body: JSON.stringify(consultaData),
        });
        console.log("consulta actualizada:", data);
        return data;
    } catch (error) {
        console.error("Error al actualizar consulta:", error);
        return null;
    }
};
//**********************************************************************************************************************************
//iniica obtener consulta porid
export const getConsultaById = async (consultaId: string): Promise<Consulta> => {
    try {
        const data = await apiFetch(`consulta/${consultaId}`, {
            method: "GET"
        });
        console.log("consulta obtenida", data);
        return data;
    } catch (error) {
        console.error("error al obtener consulta", error);
        throw error;
    }
}
//termina obtener consulta porid
// *****************************************************************************************
//  */