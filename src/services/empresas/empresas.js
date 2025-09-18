import { apiFetch } from "../api";
//Empieza obtener empresas //
export const getEmpresas = async (page = 1, limit = 50, searchQuery) => {
    try {
        const data = await apiFetch(`empresas?search=${searchQuery}`);
        console.log("empresas obtenidos:", data);
        return data;
    }
    catch (error) {
        console.error("Error al obtener empresas:", error);
        return { data: [] };
    }
};
//Termina obtener empresas //
//Empieza obtener empresasinactivas //
export const getEmpresasInactivas = async (page = 1, limit = 50, searchQuery) => {
    try {
        const data = await apiFetch(`empresas/inactivas?search=${searchQuery}`);
        console.log("empresas obtenidos:", data);
        return data;
    }
    catch (error) {
        console.error("Error al obtener empresas:", error);
        return { data: [] };
    }
};
//Termina obtener empresasinactivas //
//Empieza Crear empresas //
// export const createEmpresa = async (empresaData: {
//     emp_nombre: string;
//     emp_correo: string;
//     emp_direccion: string;
//     emp_telefono: string;
//     emp_ruc: string;
//     emp_tipo_empresa: string;
//     provincia_id: number;
//     canton_id: number;
//     activo: boolean;
//     fecha_inicio: string;
//     fecha_fin: string;
// }) => {
//     try {
//         const data = await apiFetch("empresas", {
//             method: "POST",
//             body: JSON.stringify(empresaData),
//         });
//         console.log("empresa creado", data);
//         return data;
//     } catch (error) {
//         console.error("error al crear empresa:", error)
//         return null;
//     }
// };
export const createEmpresa = async (formData) => {
    return await apiFetch("empresas", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: formData,
    });
};
//Fin Crear empresas//
//************************************************************************ */
//inicio empresa de ususario admihn
export const getEmpresasPorUsuario = async (id) => {
    return await apiFetch(`empresas/mis-empresas/${id}`);
};
// fin  empresa de ususario admihn
//Empieza obtener empresas por id//
export const getEmpresaById = async (empresaId) => {
    try {
        const data = await apiFetch(`empresas/${empresaId}`, {
            method: "GET",
        });
        console.log("Usuario obtenido:", data); // Verifica la estructura de la respuesta
        return data;
    }
    catch (error) {
        console.error("Error al obtener el usuario:", error);
        throw error; // Propaga el error para manejarlo en el componente
    }
};
//Finaliza obtener empresas por id//
//Empieza Editar empresa por id//
export const updateEmpresa = async (empresaId, formData) => {
    const response = await apiFetch(`empresas/${empresaId}`, {
        method: 'PATCH',
        body: formData,
    });
    return response;
};
//Finaliza Editar empresa por id//
//Empieza borrrado logico por id//
export const deleteEmpresa = async (empresaId) => {
    try {
        const data = await apiFetch(`empresas/${empresaId}`, {
            method: "DELETE",
        });
        console.log("empresa desactivado:", data);
        return data;
    }
    catch (error) {
        console.error("Error al desactivar empresa:", error);
        return null;
    }
};
//Finaliza borrrado logico por id//
//**************************************************************** */
export const asignarUsuarios = async (empresaId, usuarioIds) => {
    try {
        const data = await apiFetch(`empresas/${empresaId}/asignar-usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuarioIds }),
        });
        // if (!response.ok) {
        //     const error = await response.json();
        //     throw new Error(error.message || 'Error en la asignación');
        // }
        console.log('✅ Asignación exitosa:', data);
        return data;
    }
    catch (error) {
        console.error('❌ Error al asignar usuarios:', error);
    }
};
//**************************************************************** */
//**************************************************************** */
