import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Empresa } from "../../types/empresa/empresa";
import { getEmpresaById } from "../../services/empresas/empresas";
import { getCantones, getProvincias } from "../../services/empresas/catalogosEmpresa";
import { getUserById } from "../../services/users/users";

interface Props {
  empresaId: string;
}

interface Provincia {
  prov_id: number;
  prov_nombre: string;
}

interface Canton {
  can_id: number;
  can_nombre: string;
}


const EmpresaDetail: React.FC<Props> = ({ empresaId }) => {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [provinciaNombre, setProvinciaNombre] = useState<string | null>(null);
  const [cantonNombre, setCantonNombre] = useState<string | null>(null);
  const [nombreAdmin, setNombreAdmin] = useState("");

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        setLoading(true);
        const data = await getEmpresaById(empresaId);
        setEmpresa(data);

        // 🔍 Buscar nombres de provincia y cantón por ID
        const provincias: Provincia[] = await getProvincias();
        const cantones: Canton[] = await getCantones();


        const nombreProvincia = provincias.find(p => p.prov_id === data.provincia_id)?.prov_nombre || null;
        const nombreCanton = cantones.find(c => c.can_id === data.canton_id)?.can_nombre || null;

        const admin = await getUserById(data.usua_admin_id.toString());
        setNombreAdmin(admin.usua_nombre);

        setProvinciaNombre(nombreProvincia);
        setCantonNombre(nombreCanton);
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


  const updatedEmpresa = (empresaId: string) => {
    navigate(`/empresa-edit/${empresaId}`);
  }

  return (
    <div className="bg-gray-700 shadow-lg rounded-2xl p-6 max-w-7xl mx-auto text-gray-100 overflow-auto">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-500 pb-2">
          Detalles de la Empresa | {empresa.emp_nombre} | RUC:  {empresa.emp_ruc}
          
          
        </h2>
        
      </div>

      {/* 📐 Responsive Grid: 1 col (mobile) → 2 cols (md) → 3 cols (lg) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        
        {/* <Detail label="Nombre" value={empresa.emp_nombre} />
        <Detail label="RUC" value={empresa.emp_ruc} />
        <Detail label="Correo" value={empresa.emp_correo} /> */}
        {/* <Detail label="Teléfono" value={empresa.emp_telefono} />
        <Detail label="Dirección" value={empresa.emp_direccion} />
        <Detail label="Provincia" value={provinciaNombre || "—"} />
        <Detail label="Cantón" value={cantonNombre || "—"} />
        <Detail label="Tipo de empresa" value={empresa.emp_tipo_empresa} />
        <Detail label="Activo" value={empresa.activo ? "Sí" : "No"} /> */}
        {/* {empresa.created_at && (
          <Detail
            label="Fecha de registro"
            value={new Date(empresa.created_at).toLocaleDateString()}
          />
        )} */}

        <Detail label="Administrador" value={nombreAdmin || "—"} />
      </div>

      {/* 🎯 Botones */}
      <div className="flex flex-col sm:flex-row justify-end gap-3">
         <button
          onClick={() => updatedEmpresa(empresa.emp_id)}
          className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg transition-all"
        >
          🔎 Buscar Usuarios
        </button>
        <button
          onClick={() => updatedEmpresa(empresa.emp_id)}
          className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg transition-all"
        >
          📝 Actualizar
        </button>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition-all"
        >
          🔙 Regresar
        </button>
      </div>
    </div>
  );
};

export default EmpresaDetail;

const Detail: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div className="bg-gray-800 p-4 rounded-xl shadow-sm break-words">
    <p className="text-sm text-gray-400">{label}</p>
    <p className="text-lg font-medium text-white">{value || "—"}</p>
  </div>
);
