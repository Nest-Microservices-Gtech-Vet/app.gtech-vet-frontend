export interface MedicamentoInput {
    med_id?: number;
    nombre: string;
    dosis: string;
    empresa_id: number;

}

export interface CrearTratamientoDto {
    consulta_id: number;
    mascota_id: number;
    empresa_id: number;
    medicamentos: MedicamentoInput[];
}

export interface TratamientoResponse {
    tra_id: number;
    consulta_id: number;
    mascota_id: number;
    empresa_id: number;
    created_at?: string;
    medicamentos: {
        med_id: number;
        med_nombre: string;
        med_dosis: string;
    }[];
    consulta: {
        con_id: number;
        con_fecha: string;
        con_motivo: string;
        con_peso: number;
        con_temperaturaCorporal: number;
        con_pulso: number;
        con_frecuenciaRespiratoria: number;
        con_frecuenciaCardiaca: number;
        con_diagnosticoPresuntivo: string;
        con_observaciones: string;
        con_recomendaciones: string;
    };
}
