import { apiFetch } from "../../api";
export const registrarVacuna = async (vacunaData, files) => {
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
export const obtenerConsultaActiva = async (empresaId, mascotaId) => {
    const endpoint = `consulta/activa?empresa_id=${empresaId}&mascota_id=${mascotaId}`;
    return await apiFetch(endpoint);
};
export const getVacunasPorConsulta = async (consultaId) => {
    const res = await apiFetch(`vacuna/consulta/${consultaId}`);
    return res;
};
export const getVacunaPorMascota = async (mascotaId) => {
    try {
        const data = await apiFetch(`vacuna/mascota/${mascotaId}`, {
            method: "GET"
        });
        console.log("mascota obtenida- desde vacunas", data);
        return data;
    }
    catch (error) {
        console.error("error al obtener mascota - desde vacunas ", error);
        throw error;
    }
};
export const updateVacuna = async (vacunaId, updateData, nuevasFotos) => {
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
    ];
    campos.forEach((key) => {
        const value = updateData[key];
        if (value !== undefined && value !== null && value !== "") {
            formData.append(key, String(value));
        }
    });
    // ✅ Adjuntar archivos nuevos
    if (nuevasFotos && nuevasFotos.length > 0) {
        nuevasFotos.forEach((foto) => formData.append("fotos", foto));
    }
    // ✅ Adjuntar IDs de archivos a eliminar
    // Archivos a eliminar (solo si existen)
    if (updateData.archivosAEliminar && updateData.archivosAEliminar.length > 0) {
        updateData.archivosAEliminar.forEach((id) => formData.append("archivosAEliminar[]", id.toString()) // siempre como array
        );
    }
    const response = await apiFetch(`vacuna/${vacunaId}`, {
        method: "PATCH",
        body: formData,
    });
    return response;
};
//********************************************************************************* */
