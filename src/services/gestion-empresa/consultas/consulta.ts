import { apiFetch } from "../../api";

//inicia crear consulta
export const crearConsulta = async (consultaData:{
    con_fecha: string;
    con_motivo: string;
    con_sintomas:string;
    con_diagnostico:string;
    con_tratamiento: string;
    con_recomendaciones: string;
    historiaClinica_id:number;
    empresa_id: number;

}) => {
    try {
        const dataConsulta = await apiFetch(`consulta`,{
            method: "POST",
            body: JSON.stringify(consultaData),
        });
        console.log("consulta creada", dataConsulta);
        return dataConsulta
    } catch (error) {
        console.error("error al crear consulta:", error)
        return null;
    }
};
//fin crear consulta
//****************************************************************************** */
