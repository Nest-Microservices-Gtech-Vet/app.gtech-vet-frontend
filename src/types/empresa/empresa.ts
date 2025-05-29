import { User } from "../users/user";

export interface Empresa {
    emp_id: string; // o number, dependiendo de tu backend
    emp_nombre: string;
    emp_correo: string;
    emp_direccion: string;
    emp_telefono: string;
    emp_ruc: string;
    emp_tipo_empresa: string;
 
    provincia_id: number
    canton_id: number;
    activo: boolean;
    
    fecha_inicio:string;
    fecha_fin: string;
    admins?: User[];
    createdBy?: string; // Opcional, si existe
    updatedBy?: string; // Opcional, si existe
    created_at?: string; // Opcional, si existe
    updated_at?: string; // Opcional, si existe
}