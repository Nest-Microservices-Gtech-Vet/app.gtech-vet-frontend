import React, { useEffect, useState } from "react";
import { getEmpresasPorUsuario } from "../../services/empresas/empresas";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


const MisEmpresas = () => {
  const { user, logout } = useAuth();
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      console.warn("No hay usuario logueado.");
      return;
    }

    const user = JSON.parse(storedUser);

    if (!["ADMIN", "USUARIO"].includes(user.usua_rol)) {
      Swal.fire({
        icon: "error",
        title: "Acceso no autorizado",
        confirmButtonColor: "#6366F1",
      }).then(() => navigate("/"));
      return;
    }

    getEmpresasPorUsuario(user.usua_id)
      .then((data) => setEmpresas(data))
      .catch((err) => console.error("Error cargando empresas:", err))
      .finally(() => setLoading(false));
  }, []);

  const goEmpresas = (empresaId: string) => {
    const empresa = empresas.find((e: any) => e.emp_id === empresaId);
    if (empresa) {
      localStorage.setItem("empresaSeleccionada", JSON.stringify(empresa));
      // Asegura que el modo oscuro esté desactivado
      document.documentElement.classList.remove("dark");
      navigate(`/mis-empresas/${empresaId}/dashboard`);
    }
  };


  if (loading) return <p>Cargando empresas...</p>;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header tipo Odoo */}
      <header className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold">Mis Empresas</h1>
        <div className="flex gap-3 items-center">

          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            onClick={logout}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Lista estilo Odoo */}
      <main className="p-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {empresas.map((empresa: any) => (
                <tr key={empresa.emp_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{empresa.emp_nombre}</td>
                  <td className="px-6 py-4 space-x-2">
                    {empresa.activo ? (
                      <button
                        className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
                        onClick={() => goEmpresas(empresa.emp_id)}
                      >
                        Entrar
                      </button>
                    ) : (
                      <button
                        className="bg-gray-400 text-white px-3 py-1 rounded  text-sm"
                        onClick={() =>
                          Swal.fire({
                            icon: 'warning',
                            title: 'Empresa desactivada',
                            text: 'Comuníquese con su administrador.',
                            confirmButtonColor: '#6366F1', // color índigo
                          })
                        }
                      >
                        Conectar
                      </button>
                    )}


                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </main>
    </div>


  );
};

export default MisEmpresas;
