import React, { useEffect, useState } from "react";
import { getEmpresasPorUsuario } from "../../services/empresas/empresas";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Building2, ArrowRight } from "lucide-react";

const MisEmpresas = () => {
  const { user, logout } = useAuth();
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

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
      document.documentElement.classList.remove("dark");
      navigate(`/mis-empresas/${empresaId}/dashboard`);
    }
  };

  if (loading)
    return <p className="text-center py-10 text-gray-600">Cargando empresas...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-indigo-600" />
          Mis Empresas
        </h1>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
          onClick={logout}
        >
          Cerrar sesión
        </button>
      </header>

      {/* Lista horizontal tipo Odoo */}
      <main className="p-6 space-y-4">
        {empresas.length === 0 ? (
          <p className="text-center text-gray-600">No tienes empresas asignadas.</p>
        ) : (
          empresas.map((empresa: any) => (
            <div
              key={empresa.emp_id}
              className="flex items-center bg-white rounded-xl shadow-md border border-gray-100 p-4 transition duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-indigo-50 group"
            >
              {/* Logo con efecto hover */}
              <div className="flex-shrink-0 transform transition duration-300 group-hover:scale-105">
                <img
                  src={`https://app.amigovet123.com:8443/uploads/logos/${empresa.emp_foto}`}
                  alt={empresa.emp_nombre}
                  className="w-24 h-24 object-cover rounded-lg border"
                />
              </div>

              {/* Info central */}
              <div className="flex-1 px-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 transition duration-300 group-hover:text-indigo-600">
                  <span>🏢</span>
                  {empresa.emp_nombre}
                </h2>
                <span
                  className={`inline-block text-xs font-medium px-2 py-1 rounded-full mt-1 ${
                    empresa.activo
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {empresa.activo ? "Activa" : "Desactivada"}
                </span>
              </div>

              {/* Botón a la derecha con animación */}
              {empresa.activo ? (
                <button
                  onClick={() => goEmpresas(empresa.emp_id)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:bg-indigo-700"
                >
                  Entrar
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() =>
                    Swal.fire({
                      icon: "warning",
                      title: "Empresa desactivada",
                      text: "Comuníquese con su administrador.",
                      confirmButtonColor: "#6366F1",
                    })
                  }
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed flex items-center gap-2"
                >
                  Conectar
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default MisEmpresas;
