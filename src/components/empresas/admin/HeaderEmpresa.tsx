import { useLocation } from "react-router-dom";

type HeaderEmpresaProps = {
  title?: string; // <- Hacemos title opcional por si se necesita lógica automática
};

const pageTitles: Record<string, string> = {
  "/mis-empresas/:id/dashboard": "Dashboard",
  "/users": "Usuarios",
  "/user": "Usuario",
  "/user-create":"Agregar Usuarios "
};

const HeaderEmpresa = ({ title }: HeaderEmpresaProps) => {
  const location = useLocation();

  // Manejar rutas dinámicas como "/user/:id"
  const getTitle = () => {
    if (title) return title; // <- si se pasó como prop, úsalo
    if (location.pathname.startsWith("/mis-empresas/")) return "Dashboard";
    return pageTitles[location.pathname] || "Dashboard";
  };
  return (
    <header className="bg-white-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-200">
      <div className="mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-black transition-all duration-300">
          {getTitle()}
        </h1>
      </div>
    </header>
  );
};

export default HeaderEmpresa;

