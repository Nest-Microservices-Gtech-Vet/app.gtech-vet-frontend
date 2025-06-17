import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Empresa } from "../../../types/empresa/empresa";
import { useAuth } from "../../../context/AuthContext";

type HeaderEmpresaProps = {
  title?: string;
};

const pageTitles: Record<string, string> = {
  "/mis-empresas/:id/dashboard": "Dashboard",
  "/users": "Usuarios",
  "/user": "Usuario",
  "/user-create": "Agregar Usuarios",
};

const HeaderEmpresa = ({ title }: HeaderEmpresaProps) => {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const storedEmpresa = localStorage.getItem("empresaSeleccionada");
    if (storedEmpresa) {
      setEmpresa(JSON.parse(storedEmpresa));
    }
  }, []);

  const getTitle = () => {
    if (title) return title;
    if (location.pathname.startsWith("/mis-empresas/")) return "Dashboard";
    return pageTitles[location.pathname] || "Dashboard";
  };

  return (
    <header className="bg-white bg-opacity-80 backdrop-blur-md shadow-lg border-b border-gray-200">
      <div className="flex justify-between items-center mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div>
          
          {empresa && (
            <p className="text-base text-gray-700 mt-1">
              {empresa.emp_nombre}
            </p>
          )}
        </div>
        <div className="text-base text-gray-800 font-medium">
          {user ? `👤 ${user.usua_nombre} ${user.usua_apellido}` : "No autenticado"}
        </div>
      </div>
    </header>
  );
};

export default HeaderEmpresa;
