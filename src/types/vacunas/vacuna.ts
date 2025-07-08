export interface Vacuna {
  vac_id?: number;
  vac_nombre: string;
  vac_tipo: string;
  vac_fecha: string; // ISO date
  vac_proxima?: string; // ISO date
  vac_lote?: string;
  vac_foto?: string;
  vac_observacion?: string;
  consulta_id: number;
  empresa_id: number;
  numeroConsulta: number;
  mascota_id: number;
  createdBy?: number;
  updatedBy?: number;
}