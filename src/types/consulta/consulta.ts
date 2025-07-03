export interface Consulta {
    con_fecha: string;
    con_motivo: string;
    con_numero_mascota?: number; 

    con_peso: number;
    con_temperaturaCorporal: number;
    con_icc: string;
    con_pulso: number;
    con_frecuenciaRespiratoria: number; //respiraciones por minutos F.R.
    con_frecuenciaCardiaca: number; //latidos por minutoF.C.
    con_hidratacion: string;
    con_mucosas: string;
    con_campoPulmonar: string;
    con_palpacionAbdominal: string;
    con_diagnosticoPresuntivo: string;
    con_observaciones: string;
    con_recomendaciones: string;
    patologiasIds?: number[];
    
    historiaClinica_id: number;
    empresa_id: number;
    mascota_id: number;

    createdBy?: string; // Opcional, si existe
    updatedBy?: string; // Opcional, si existe
    created_at?: string; // Opcional, si existe
    updated_at?: string; // Opcional, si existe

}