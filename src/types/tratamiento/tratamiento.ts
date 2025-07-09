export interface MedicamentoInput {
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