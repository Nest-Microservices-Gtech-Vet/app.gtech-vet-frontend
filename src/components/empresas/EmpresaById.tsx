import React, { useEffect, useState } from "react";

import { Empresa } from "../../types/empresa/empresa";
import { getEmpresaById } from "../../services/empresas/empresas";


interface Props {
    empresaId: string;
}

const EmpresaDetail: React.FC<Props> = ({ empresaId }) => {
    const [empresa, setEmpresa] = useState<Empresa | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmpresa = async () => {
            try {
                setLoading(true);
                const data = await getEmpresaById(empresaId);
                setEmpresa(data);
            } catch (err) {
                setError("No se pudo cargar la empresa.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (empresaId) {
            fetchEmpresa();
        }
    }, [empresaId]);

    if (loading) return <p className="text-gray-500">Cargando empresa...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!empresa) return <p>No se encontró la empresa.</p>;

    return (
        <div className="bg-gray-600 shadow-md p-6 rounded-lg w-full max-w-xl">
            <h2 className="text-xl font-bold text-white-800 mb-4">{empresa.emp_nombre}</h2>
            <p><strong>RUC:</strong> {empresa.emp_ruc}</p>
            <p><strong>Correo:</strong> {empresa.emp_correo}</p>
            <p><strong>Dirección:</strong> {empresa.emp_direccion}</p>
            <p><strong>Teléfono:</strong> {empresa.emp_telefono}</p>
            <p><strong>Provincia:</strong> {empresa.provincia_id}</p>
            <p><strong>Cantón:</strong> {empresa.canton_id}</p>
            <p><strong>Tipo de empresa:</strong> {empresa.tipo_empresa_id}</p>
            <p><strong>Activo:</strong> {empresa.activo ? "Sí" : "No"}</p>
            {empresa.created_at && <p><strong>Creado el:</strong> {new Date(empresa.created_at).toLocaleDateString()}</p>}
        </div>
    );
};

export default EmpresaDetail;
