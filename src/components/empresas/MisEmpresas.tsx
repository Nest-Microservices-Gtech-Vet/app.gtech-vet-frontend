import React, { useEffect, useState } from "react";
import { getEmpresasPorUsuario } from "../../services/empresas/empresas";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";


const MisEmpresas = () => {
  const { user, logout } = useAuth();
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      console.warn("No hay usuario logueado.");
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.usua_rol !== "ADMIN") {
      console.warn("Solo los administradores pueden ver sus empresas.");
      return;
    }

    getEmpresasPorUsuario(user.usua_id)
      .then((data) => setEmpresas(data))
      .catch((err) => console.error("Error cargando empresas:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando empresas...</p>;

  return (
    // <div >
    //     <h2>Empresas del admin</h2>
    //     <ul>
    //         {empresas.map((empresa: any) => (
    //             <li key={empresa.emp_id}>{empresa.emp_nombre}</li>
    //         ))}
    //     </ul>
    // </div>

    //     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    //   {empresas.map((empresa: any) => (
    //     <div
    //       key={empresa.emp_id}
    //       className="bg-white text-gray-900 rounded-2xl shadow-md hover:shadow-xl p-5 flex flex-col items-center transition duration-300"
    //     >


    //       <h2 className="text-xl font-semibold mb-2 text-center">
    //         {empresa.emp_nombre}
    //       </h2>
    //       <button
    //         className="mt-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
    //         onClick={() => alert(`Entrar a empresa: ${empresa.emp_nombre}`)}
    //       >
    //         Entrar
    //       </button>
    //     </div>
    //   ))}
    // </div>

    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header tipo Odoo */}
      <header className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold">Mis Empresas</h1>
        <div className="flex gap-3 items-center">
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
            onClick={() => alert("Crear empresa")}
          >
            Crear Empresa
          </button>
          <button
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            onClick={() => alert("Ver perfil")}
          >
            Perfil
          </button>
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
                        onClick={() => alert(`Entrar a empresa: ${empresa.emp_nombre}`)}
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
                        Entrar
                      </button>
                    )}

                    {/* Botones opcionales */}
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                      onClick={() => alert(`Editar empresa: ${empresa.emp_id}`)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                      onClick={() => alert(`Eliminar empresa: ${empresa.emp_id}`)}
                    >
                      Eliminar
                    </button>
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
