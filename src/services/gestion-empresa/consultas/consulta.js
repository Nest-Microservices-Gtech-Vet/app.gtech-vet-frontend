import { apiFetch } from "../../api";
//inicia crear consulta
export const crearConsulta = async (consultaData) => {
    try {
        const dataConsulta = await apiFetch(`consulta`, {
            method: "POST",
            body: JSON.stringify(consultaData),
        });
        console.log("consulta creada", dataConsulta);
        return dataConsulta;
    }
    catch (error) {
        console.error("error al crear consulta:", error);
        return null;
    }
};
//fin crear consulta
//****************************************************************************** */
//iniicia editar consulta consulta
export const modifyConsulta = async (consultaId, consultaData) => {
    try {
        const data = await apiFetch(`consulta/mascota/${consultaId}/modificar`, {
            method: "PATCH",
            body: JSON.stringify(consultaData),
        });
        console.log("consulta actualizada:", data);
        return data;
    }
    catch (error) {
        console.error("Error al actualizar consulta:", error);
        return null;
    }
};
//**********************************************************************************************************************************
//iniica obtener consulta porid
export const getConsultaById = async (consultaId) => {
    try {
        const data = await apiFetch(`consulta/${consultaId}`, {
            method: "GET"
        });
        console.log("consulta obtenida", data);
        return data;
    }
    catch (error) {
        console.error("error al obtener consulta", error);
        throw error;
    }
};
//termina obtener consulta porid
// *****************************************************************************************
//  */
