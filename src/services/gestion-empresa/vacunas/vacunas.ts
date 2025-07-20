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