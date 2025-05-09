export interface Empresa {
    emp_id: string; // o number, dependiendo de tu backend
    emp_nombre: string;
    emp_correo: string;
    emp_telefono: string;
    emp_direccion: string;
    emp_contrasenia: string;
    emp_ruc: string;
    activo: boolean;
    createdBy?: string; // Opcional, si existe
    updatedBy?: string; // Opcional, si existe
    created_at?: string; // Opcional, si existe
    updated_at?: string; // Opcional, si existe
}