import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/users": "Usuarios",
  "/user": "Usuario",
  "/empresas": "Empresas",
  "/user-create":"Agregar Usuarios "
};

const Header = () => {
  const location = useLocation();

  // Manejar rutas dinámicas como "/user/:id"
  const getTitle = () => {
    if (location.pathname.startsWith("/user/")) return "Detalle de Usuario";
    return pageTitles[location.pathname] || "Mi Aplicación";
  };

  return (
    <header className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700">
      <div className="mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-100 transition-all duration-300">
          {getTitle()}
        </h1>
      </div>
    </header>
  );
};

export default Header;
