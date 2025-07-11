export interface ExamenArchivo {
    exa_id: number;
    examen_id: number;
    exa_categoria: string;
    exa_url: string;
    exa_descripcion: string;
    empresa_id: number;
    createdBy: number;
    created_at: string;
}

export interface Examen {
    exam_id: number;
    consulta_id: number;
    exam_tipo: string;
    empresa_id: number;
    createdBy: number;
    created_at: string;
    archivos: ExamenArchivo[];
}
