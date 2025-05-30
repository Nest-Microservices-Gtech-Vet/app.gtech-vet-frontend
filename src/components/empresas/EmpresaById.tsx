import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Empresa } from "../../types/empresa/empresa";
import { asignarUsuarios, getEmpresaById } from "../../services/empresas/empresas";
import { getCantones, getProvincias } from "../../services/empresas/catalogosEmpresa";
import { getUserById } from "../../services/users/users";
import UsuariosSelectorModal from "../users/UsuariosSelectorModal";
import { User } from "../../types/users/user";



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


const EmpresaDetail = ({ empresaId }: { empresaId: number }) => {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUsuariosModal, setShowUsuariosModal] = useState(false);
  const navigate = useNavigate();


  // 📦 Cargar empresa al iniciar
  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        setLoading(true);
        const data = await getEmpresaById(String(empresaId));
        setEmpresa(data);
        if (Array.isArray(data.admins)) {
          setUsuarios(data.admins);
        }
      } catch (err) {
        console.error('Error al cargar la empresa', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresa();
  }, [empresaId]);

  // 🚀 Manejar asignación de usuarios
  const handleAsignarUsuarios = async (usuarioIds: number[]) => {
    if (!empresa) return;

    try {
      await asignarUsuarios(Number(empresa.emp_id), usuarioIds);
     
    

      // 🔄 Recargar empresa para reflejar usuarios actualizados
      const data = await getEmpresaById(empresa.emp_id);
      setEmpresa(data);
      if (Array.isArray(data.admins)) {
        setUsuarios(data.admins);
      }
    } catch (err) {
      console.error('Error al asignar los usuarios', err);
      alert('Hubo un error al asignar los usuarios');
    }
  };

  const updatedEmpresa = (empresaId: string) => {
    navigate(`/empresa-edit/${empresaId}`);
  }

  return (
    <div className="bg-gray-700 shadow-lg rounded-2xl p-6 max-w-7xl mx-auto text-gray-100 overflow-auto">
      {loading && <p>Cargando empresa...</p>}
      {!loading && empresa && (
        <>
         
          <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-500 pb-2">
            Empresa: {empresa.emp_nombre} | RUC: {empresa.emp_ruc}
          </h2>

          <div className="mt-4 rid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

            {usuarios.length > 0 && (
              <div className="mt-6">
                <h3 className="text-2xl font-semibold text-white mb-2">Usuarios Asignados</h3>
                <ul className="bg-gray-800 rounded-xl p-4 space-y-2 text-xl">
                  {usuarios.map((user) => (
                    <li key={user.usua_id} className="text-white">
                      🟢 {user.usua_nombre} — {user.usua_rol}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Detail label="Fecha Inicio" value={empresa.fecha_inicio?.split('T')[0] || "—"} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Detail label="Fecha Fin" value={empresa.fecha_fin?.split('T')[0] || "—"} />
          </div>





          {/* Aquí tu lógica para mostrar información y abrir el modal */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={() => setShowUsuariosModal(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg transition-all"
            >
              🔎 Asignar Usuarios
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

          <UsuariosSelectorModal
            isOpen={showUsuariosModal}
            onClose={() => setShowUsuariosModal(false)}
            onSave={handleAsignarUsuarios}
          />

        </>
      )}


    </div>
  );
};

const Detail: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div className="bg-gray-800 p-4 rounded-xl shadow-sm break-words">
    <p className="text-sm text-gray-400">{label}</p>
    <p className="text-lg font-medium text-white">{value || "—"}</p>
  </div>
)

export default EmpresaDetail;