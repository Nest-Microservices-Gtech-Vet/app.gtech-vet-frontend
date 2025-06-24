export interface Consulta {
    con_id:number;
    con_fecha: string;
    con_motivo: string;
    con_sintomas:string;
    con_diagnostico:string;
    con_tratamiento: string;
    con_recomendaciones: string;
    historiaClinica_id:number;
    empresa_id: number;

    createdBy?: string; // Opcional, si existe
    updatedBy?: string; // Opcional, si existe
    created_at?: string; // Opcional, si existe
    updated_at?: string; // Opcional, si existe

}