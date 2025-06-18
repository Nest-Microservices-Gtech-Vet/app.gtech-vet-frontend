export interface Cliente {
    cli_id: string;
    cli_identificacion:string;
    cli_nombre:string;
    cli_apellido:string;
    cli_email:string;
    cli_celular:string;
    cli_direccion:string;
    cli_observaciones:string;
    empresa_id:number;
    activo:boolean;
    createdBy?: string; // Opcional, si existe
    updatedBy?: string; // Opcional, si existe
    created_at?: string; // Opcional, si existe
    updated_at?: string; // Opcional, si existe


}