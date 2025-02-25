export interface User {
    usua_id: string; // o number, dependiendo de tu backend
    usua_ruc: string;
    usua_nombre: string;
    usua_apellido: string;
    usua_email: string;
    usua_celular: string;
    usua_direccion: string;
    usua_contrasenia: string;
    usua_rol: string;
    activo: boolean;
    createdBy?: string; // Opcional, si existe
    updatedBy?: string; // Opcional, si existe
    created_at?: string; // Opcional, si existe
    updated_at?: string; // Opcional, si existe
}