import { Mascota } from "../../../types/mascotas/mascota";
import { Vacuna } from "../../../types/vacunas/vacuna";
import { apiFetch } from "../../api";

export const registrarVacuna = async (vacunaData: any, files: File[]): Promise<any> => {
  const form = new FormData();

  Object.entries(vacunaData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      form.append(key, value.toString());
    }
  });

  files.forEach(file => {
    form.append('files', file);
  });

  // Sólo llamar apiFetch, no hacer más parseo ni chequeo aquí
  return await apiFetch('vacuna/registrar', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
    body: form,
  });
};


export const obtenerConsultaActiva = async (empresaId: string, mascotaId: string) => {
  const endpoint = `consulta/activa?empresa_id=${empresaId}&mascota_id=${mascotaId}`;
  return await apiFetch(endpoint);
};

export const getVacunasPorConsulta = async (consultaId: string) => {
  const res = await apiFetch(`vacuna/consulta/${consultaId}`);
  return res;
};


export const getVacunaPorMascota = async (mascotaId: string) => {
  try {
    const data = await apiFetch(`vacuna/mascota/${mascotaId}`, {
      method: "GET"
    });
    console.log("mascota obtenida- desde vacunas", data);
    return data;
  } catch (error) {
    console.error("error al obtener mascota - desde vacunas ", error);
    throw error;
  }
}

//********************************************************************************* */


export interface UpdateVacunaDto {
  vac_nombre?: string;
  vac_tipo?: string;
  vac_fecha?: string;
  vac_proxima?: string | null;
  vac_lote?: string;
  vac_observacion?: string;
  empresa_id?: string;
  mascota_id?: string;
  historiaClinica_id?: string;
}

export const updateVacuna = async (
  vacunaId: number,
  updateData: UpdateVacunaDto & { empresa_id?: string; mascota_id?: string; historiaClinica_id?: string },
  nuevasFotos?: File[]
) => {
  const formData = new FormData();

  // ✅ Campos posibles
  const campos = [
    "vac_nombre",
    "vac_tipo",
    "vac_fecha",
    "vac_proxima",
    "vac_lote",
    "vac_observacion",
    "empresa_id",
    "mascota_id",
    "historiaClinica_id",
  ] as const;

  campos.forEach((key) => {
    const value = updateData[key];
    if (value !== undefined && value !== null && value !== "") {
      // Solo si hay valor
      formData.append(key, String(value));
    }
  });

  // ✅ Adjuntar archivos
  if (nuevasFotos && nuevasFotos.length > 0) {
    nuevasFotos.forEach((foto) => formData.append("fotos", foto));
  }

  const response = await apiFetch(`vacuna/${vacunaId}`, {
    method: "PATCH",
    body: formData,
  });
  return response;
};




//********************************************************************************* */
