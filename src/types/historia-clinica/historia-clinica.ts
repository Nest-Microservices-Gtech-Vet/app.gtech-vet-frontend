import { Consulta } from "../consulta/consulta";

export interface historiaClinica {
    hic_id: number;
    mascota_id: number;
    hic_numero_local?: number;
    empresa_id: number;
    hic_estado: string;
    consultas: Consulta[];

}