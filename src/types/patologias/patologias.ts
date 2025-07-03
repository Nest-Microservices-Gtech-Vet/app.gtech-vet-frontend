export interface Patologia {
  pat_id: number;
  pat_nombre: string;
  pat_desc: string | null;
  empresa_id: number;
  activo: boolean;
  createdBy: number;
  updatedBy: number;
  created_at: string;
  updated_at: string;
}

export interface EspecieRazaPatologia {
  erp_id: number;
  especie_id: number;
  raza_id: number;
  patologia_id: number;
  empresa_id: number;
  activo: boolean;
  createdBy: number;
  updatedBy: number;
  created_at: string;
  updated_at: string;

  // 👇 Agrega esto
  patologia: Patologia;
}
