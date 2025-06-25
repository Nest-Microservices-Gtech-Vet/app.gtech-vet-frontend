import { Consulta } from "../consulta/consulta";

export interface historiaClinica {
    hic_id: number;
    mascota_id: number;
    empresa_id: number;
    hic_estado: string;
    consultas: Consulta[];

}